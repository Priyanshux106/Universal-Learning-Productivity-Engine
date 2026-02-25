import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { invokeBedrockModel, parseBedrockJSON } from '../lib/bedrock'
import { executeCode } from '../lib/judge0'
import { dbPut, TABLES, keys } from '../lib/dynamodb'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import {
  getCodeAnalysisSystemPrompt,
  getCodeAnalysisUserPrompt,
} from '../prompts/codeAnalysisPrompt'
import {
  AnalyzeCodeRequest,
  AnalyzeCodeResponse,
  CodeExplanation,
  Improvement,
  Pattern,
  ErrorCode,
} from '../types'

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' })
const S3_BUCKET = process.env.S3_BUCKET_NAME || 'studdybuddy-logs'

const MAX_CODE_SIZE = 64 * 1024 // 64KB

function validateRequest(data: unknown): AnalyzeCodeRequest {
  const req = data as AnalyzeCodeRequest
  if (!req.userId) {
    const err = new Error('userId is required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  if (!req.code || typeof req.code !== 'string') {
    const err = new Error('code is required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  if (Buffer.byteLength(req.code, 'utf8') > MAX_CODE_SIZE) {
    const err = new Error(`Code exceeds maximum size of ${MAX_CODE_SIZE / 1024}KB`)
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  if (!req.language) {
    const err = new Error('language is required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  return req
}

const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  const req = parseBody(event, validateRequest)
  logger.setContext(context.awsRequestId, req.userId, 'analyzeCode')
  logger.info('Analyzing code', { userId: req.userId, language: req.language, codeLen: req.code.length })

  // Step 1: Execute code via Judge0
  const execution = await executeCode(req.code, req.language)

  // Step 2: Explain code + execution output via Bedrock
  const systemPrompt = getCodeAnalysisSystemPrompt()
  const userPrompt = getCodeAnalysisUserPrompt(
    req.code,
    req.language,
    execution.stdout,
    execution.stderr,
    execution.exitCode,
    req.context
  )

  const raw = await invokeBedrockModel(systemPrompt, userPrompt, 4096)
  const parsed = parseBedrockJSON<{
    explanation: CodeExplanation
    patterns: Pattern[]
    suggestions: Improvement[]
  }>(raw)

  // Step 3: Store code log in DynamoDB
  const logId = uuidv4()
  await dbPut({
    TableName: TABLES.CODE_LOGS,
    Item: {
      ...keys.codeLog(req.userId, logId),
      logId,
      userId: req.userId,
      language: req.language,
      codeSnippet: req.code.slice(0, 10240), // 10KB max stored
      executionResult: {
        stdout: execution.stdout,
        stderr: execution.stderr,
        exitCode: execution.exitCode,
        executionTime: execution.executionTime,
      },
      explanation: parsed.explanation?.summary || '',
      patterns: parsed.patterns || [],
      createdAt: new Date().toISOString(),
    },
  })

  // Step 4: Async S3 backup (non-fatal)
  s3.send(
    new PutObjectCommand({
      Bucket: S3_BUCKET,
      Key: `codelogs/${req.userId}/${logId}.json`,
      Body: JSON.stringify({ req, execution, parsed }),
      ContentType: 'application/json',
    })
  ).catch((err: Error) => logger.warn('S3 code log backup failed', { error: err.message }))

  logger.info('Code analysis complete', { logId, exitCode: execution.exitCode })

  const response: AnalyzeCodeResponse = {
    execution: {
      stdout: execution.stdout,
      stderr: execution.stderr,
      exitCode: execution.exitCode,
      executionTime: execution.executionTime,
    },
    explanation: parsed.explanation,
    patterns: parsed.patterns || [],
    suggestions: parsed.suggestions || [],
  }

  return successResponse(response)
}

export { handler as analyzeCodeHandler }
export const lambdaHandler = withErrorHandler(handler)

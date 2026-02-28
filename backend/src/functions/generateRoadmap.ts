import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { invokeBedrockModel, parseBedrockJSON } from '../lib/bedrock'
import { dbPut, TABLES, keys } from '../lib/dynamodb'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { getRoadmapSystemPrompt, getRoadmapUserPrompt } from '../prompts/roadmapPrompt'
import {
  GenerateRoadmapRequest,
  GenerateRoadmapResponse,
  LearningPath,
  ConceptNode,
  ErrorCode,
} from '../types'

const s3 = new S3Client({ region: process.env.AWS_REGION || 'us-east-1' })
const S3_BUCKET = process.env.S3_BUCKET_NAME || 'studdybuddy-logs'

function validateRequest(data: unknown): GenerateRoadmapRequest {
  const req = data as GenerateRoadmapRequest
  if (!req.goal?.title || !req.goal?.targetConcepts?.length) {
    const err = new Error('goal.title and goal.targetConcepts are required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  if (req.goal.title.length > 500) {
    const err = new Error('goal.title cannot exceed 500 characters')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  return req
}

const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  const userId = (event.requestContext as any).authorizer?.jwt?.claims?.sub as string
  if (!userId) {
    throw Object.assign(new Error('Unauthorized'), { code: ErrorCode.UNAUTHORIZED })
  }

  logger.setContext(context.awsRequestId, userId, 'generateRoadmap')

  const req = parseBody(event, validateRequest)
  req.userId = userId
  logger.info('Generating roadmap', { userId: req.userId, goal: req.goal.title })

  // Generate roadmap via Bedrock
  const systemPrompt = getRoadmapSystemPrompt()
  const userPrompt = getRoadmapUserPrompt(req.goal, req.currentProficiency || {})

  const raw = await invokeBedrockModel(systemPrompt, userPrompt, 4096)
  const parsed = parseBedrockJSON<{ concepts: ConceptNode[]; estimatedDuration: number }>(raw)

  const roadmapId = uuidv4()
  const now = new Date().toISOString()

  const roadmap: LearningPath = {
    id: roadmapId,
    userId: req.userId,
    goal: req.goal,
    concepts: parsed.concepts,
    estimatedDuration: parsed.estimatedDuration,
    createdAt: now,
    progress: 0,
  }

  // Persist to DynamoDB
  await dbPut({
    TableName: TABLES.ROADMAPS,
    Item: {
      ...keys.roadmap(req.userId, roadmapId),
      ...roadmap,
    },
  })

  // Backup to S3
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: `roadmaps/${req.userId}/${roadmapId}.json`,
        Body: JSON.stringify(roadmap),
        ContentType: 'application/json',
      })
    )
  } catch (s3Err) {
    // Non-fatal — log and continue
    logger.warn('S3 backup failed', { error: (s3Err as Error).message })
  }

  logger.info('Roadmap generated', { roadmapId, conceptCount: roadmap.concepts.length })

  const response: GenerateRoadmapResponse = {
    roadmap,
    estimatedTotalTime: roadmap.estimatedDuration,
  }

  return successResponse(response, 201)
}

export { handler as generateRoadmapHandler }
export const lambdaHandler = withErrorHandler(handler)

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { invokeBedrockModel, parseBedrockJSON } from '../lib/bedrock'
import { executeCode } from '../lib/judge0'
import { dbGet, dbUpdate, TABLES, keys, calculateLevel } from '../lib/dynamodb'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { getEvaluationSystemPrompt, getEvaluationUserPrompt } from '../prompts/evaluationPrompt'
import {
  EvaluateSolutionRequest,
  EvaluateSolutionResponse,
  Exercise,
  TestResult,
  ProficiencyLevel,
  ErrorExplanation,
  ErrorCode,
} from '../types'

interface StoredExercise extends Exercise {
  PK?: string
  SK?: string
}

function validateRequest(data: unknown): EvaluateSolutionRequest {
  const req = data as EvaluateSolutionRequest
  if (!req.userId || !req.exerciseId || !req.solution || !req.language) {
    const err = new Error('userId, exerciseId, solution, and language are required')
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
  logger.setContext(context.awsRequestId, req.userId, 'evaluateSolution')
  logger.info('Evaluating solution', { userId: req.userId, exerciseId: req.exerciseId })

  // Fetch exercise from DynamoDB (stored in quiz)
  // exerciseId format: "quizId:questionIndex" or just stored directly
  // We look up in a flat concept exercises store; fall back to building test summary from req
  let exercise: StoredExercise | null = null
  try {
    exercise = await dbGet<StoredExercise>({
      TableName: TABLES.QUIZZES,
      Key: {
        PK: `USER#${req.userId}`,
        SK: `EXERCISE#${req.exerciseId}`,
      },
    })
  } catch {
    logger.warn('Exercise not in DynamoDB — evaluating from solution only')
  }

  // Run solution against test cases via Judge0
  const testResults: TestResult[] = []
  let allPassed = true

  if (exercise?.testCases?.length) {
    for (const tc of exercise.testCases) {
      const stdin = tc.input !== undefined ? String(tc.input) : ''
      try {
        const result = await executeCode(req.solution, req.language, stdin)
        const passed =
          result.exitCode === 0 &&
          result.stdout.trim() === String(tc.expectedOutput).trim()
        if (!passed) allPassed = false

        testResults.push({
          testCaseId: tc.description,
          passed,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: result.stdout.trim(),
        })
      } catch (execErr) {
        allPassed = false
        testResults.push({
          testCaseId: tc.description,
          passed: false,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: `Error: ${(execErr as Error).message}`,
        })
      }
    }
  } else {
    // No test cases stored — do a single execution for syntax check
    const result = await executeCode(req.solution, req.language)
    allPassed = result.exitCode === 0
    testResults.push({
      testCaseId: 'syntax_check',
      passed: allPassed,
      input: null,
      expectedOutput: 'Exit code 0',
      actualOutput: result.stderr || result.stdout,
    })
  }

  // AI evaluation via Bedrock
  const testSummary = testResults
    .map((tr) => `${tr.testCaseId}: ${tr.passed ? 'PASS' : 'FAIL'} | Got: ${tr.actualOutput}`)
    .join('\n')

  const systemPrompt = getEvaluationSystemPrompt()
  const userPrompt = getEvaluationUserPrompt(
    exercise?.prompt || 'Evaluate the submitted solution.',
    req.solution,
    req.language,
    testSummary,
    allPassed,
    'intermediate' // default proficiency, could be fetched from DynamoDB
  )

  const raw = await invokeBedrockModel(systemPrompt, userPrompt, 2048)
  const aiEval = parseBedrockJSON<{
    correct: boolean
    feedback: string
    errorAnalysis: ErrorExplanation | null
    xpAwarded: number
    newProficiencyLevel: ProficiencyLevel
  }>(raw)

  // Update XP in DynamoDB
  if (aiEval.xpAwarded > 0) {
    await dbUpdate({
      TableName: TABLES.USERS,
      Key: keys.user(req.userId),
      UpdateExpression:
        'SET totalXP = if_not_exists(totalXP, :zero) + :xp, #lvl = :level',
      ExpressionAttributeNames: { '#lvl': 'level' },
      ExpressionAttributeValues: {
        ':xp': aiEval.xpAwarded,
        ':zero': 0,
        ':level': calculateLevel(aiEval.xpAwarded),
      },
    }).catch((err: Error) => logger.warn('XP update failed', { error: err.message }))
  }

  // Update proficiency in DynamoDB
  if (exercise?.conceptId) {
    await dbUpdate({
      TableName: TABLES.PROFICIENCY,
      Key: keys.proficiency(req.userId, exercise.conceptId),
      UpdateExpression:
        'SET #lvl = :level, lastAssessed = :now, exercisesCompleted = if_not_exists(exercisesCompleted, :zero) + :one',
      ExpressionAttributeNames: { '#lvl': 'level' },
      ExpressionAttributeValues: {
        ':level': aiEval.newProficiencyLevel,
        ':now': new Date().toISOString(),
        ':zero': 0,
        ':one': 1,
      },
    }).catch((err: Error) => logger.warn('Proficiency update failed', { error: err.message }))
  }

  logger.info('Solution evaluated', {
    allPassed,
    xpAwarded: aiEval.xpAwarded,
    newProficiency: aiEval.newProficiencyLevel,
  })

  const response: EvaluateSolutionResponse = {
    correct: aiEval.correct,
    testResults,
    feedback: aiEval.feedback,
    errorAnalysis: aiEval.errorAnalysis ?? undefined,
    xpAwarded: aiEval.xpAwarded,
    newProficiency: aiEval.newProficiencyLevel,
  }

  return successResponse(response)
}

export { handler as evaluateSolutionHandler }
export const lambdaHandler = withErrorHandler(handler)

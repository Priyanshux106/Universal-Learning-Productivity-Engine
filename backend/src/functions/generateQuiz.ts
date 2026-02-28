import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { invokeBedrockModel, parseBedrockJSON } from '../lib/bedrock'
import { dbPut, dbQuery, TABLES, keys } from '../lib/dynamodb'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { getQuizSystemPrompt, getQuizUserPrompt } from '../prompts/quizPrompt'
import {
  GenerateQuizRequest,
  GenerateQuizResponse,
  Exercise,
  ErrorCode,
} from '../types'

function validateRequest(data: unknown): GenerateQuizRequest {
  const req = data as GenerateQuizRequest
  if (!req.conceptIds?.length) {
    const err = new Error('At least one conceptId is required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  req.difficulty = Math.max(1, Math.min(10, req.difficulty || 5))
  req.numberOfQuestions = Math.max(5, Math.min(20, req.numberOfQuestions || 10))
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

  const req = parseBody(event, validateRequest)
  req.userId = userId
  logger.setContext(context.awsRequestId, req.userId, 'generateQuiz')
  logger.info('Generating quiz', {
    userId: req.userId,
    conceptIds: req.conceptIds,
    difficulty: req.difficulty,
    count: req.numberOfQuestions,
  })

  // Fetch recent exercise history for adaptive quiz (avoid repetition)
  let recentExerciseIds: string[] = []
  try {
    const history = await dbQuery<{ questions: Exercise[] }>({
      TableName: TABLES.QUIZZES,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${req.userId}`,
        ':prefix': 'QUIZ#',
      },
      Limit: 5,
      ScanIndexForward: false,
    })
    recentExerciseIds = history
      .flatMap((h) => h.questions || [])
      .map((q) => q.id)
      .filter(Boolean)
  } catch {
    logger.warn('Could not fetch quiz history — proceeding without adaptation')
  }

  // Generate quiz via Bedrock
  const systemPrompt = getQuizSystemPrompt()
  const userPrompt = getQuizUserPrompt(
    req.conceptIds,
    req.difficulty,
    req.numberOfQuestions,
    recentExerciseIds
  )

  const raw = await invokeBedrockModel(systemPrompt, userPrompt, 8192)
  const questions = parseBedrockJSON<Exercise[]>(raw)

  if (!Array.isArray(questions) || questions.length === 0) {
    const err = new Error('No exercises generated')
    ;(err as Error & { code: string }).code = ErrorCode.NO_EXERCISES_AVAILABLE
    throw err
  }

  const quizId = uuidv4()
  const now = new Date().toISOString()
  const timeLimit = req.numberOfQuestions * 120 // 2 min per question

  // Persist quiz session to DynamoDB
  await dbPut({
    TableName: TABLES.QUIZZES,
    Item: {
      ...keys.quiz(req.userId, quizId),
      quizId,
      userId: req.userId,
      conceptIds: req.conceptIds,
      questions,
      difficulty: req.difficulty,
      score: null,
      status: 'in_progress',
      startedAt: now,
      completedAt: null,
    },
  })

  logger.info('Quiz generated', { quizId, questionCount: questions.length })

  const response: GenerateQuizResponse = { quizId, questions, timeLimit }
  return successResponse(response, 201)
}

export { handler as generateQuizHandler }
export const lambdaHandler = withErrorHandler(handler)

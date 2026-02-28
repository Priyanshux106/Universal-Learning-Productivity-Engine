import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { dbPut, dbUpdate, TABLES, keys, checkBadgeThresholds, calculateLevel } from '../lib/dynamodb'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { SaveFlashcardSessionRequest, SaveFlashcardSessionResponse, ErrorCode, FlashcardSession } from '../types'

function validateRequest(data: unknown): SaveFlashcardSessionRequest {
  const req = data as SaveFlashcardSessionRequest
  if (typeof req.totalCards !== 'number' || req.totalCards < 1) {
    throw Object.assign(new Error('totalCards is required and must be >= 1'), { code: ErrorCode.INVALID_INPUT })
  }
  if (typeof req.correctCount !== 'number' || req.correctCount < 0) {
    throw Object.assign(new Error('correctCount is required'), { code: ErrorCode.INVALID_INPUT })
  }
  if (!req.subject || typeof req.subject !== 'string') {
    throw Object.assign(new Error('subject is required'), { code: ErrorCode.INVALID_INPUT })
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

  const req = parseBody(event, validateRequest)
  req.userId = userId
  logger.setContext(context.awsRequestId, req.userId, 'saveFlashcardSession')
  logger.info('Saving flashcard session', { subject: req.subject })

  const sessionId = uuidv4()
  
  // Design doc: Flashcards XP earned = 5 per session + 1 bonus if perfect
  let xpAwarded = 5
  if (req.correctCount === req.totalCards && req.totalCards > 0) {
    xpAwarded += 5 // Bonus for perfect
  }

  // 1. Store the session
  const sessionItem: FlashcardSession = {
    id: sessionId,
    userId: req.userId,
    subject: req.subject,
    chapter: req.chapter,
    totalCards: req.totalCards,
    correctCount: req.correctCount,
    xpEarned: xpAwarded,
    timestamp: new Date().toISOString()
  }

  await dbPut({
    TableName: TABLES.FLASHCARD_SESSIONS,
    Item: {
      ...keys.flashcardSession(req.userId, sessionId),
      ...sessionItem
    }
  })

  // 2. Update user XP
  const userKey = keys.user(req.userId)
  const upRes = await dbUpdate({
    TableName: TABLES.USERS,
    Key: userKey,
    UpdateExpression:
      'SET totalXP = if_not_exists(totalXP, :zero) + :xp, exercisesCompleted = if_not_exists(exercisesCompleted, :zero) + :one',
    ExpressionAttributeValues: {
      ':xp': xpAwarded,
      ':zero': 0,
      ':one': 1,
    },
    ReturnValues: 'ALL_NEW',
  })
  
  const totalXP = (upRes.totalXP as number) || xpAwarded

  const response: SaveFlashcardSessionResponse = {
    sessionId,
    xpAwarded,
    totalXP
  }

  return successResponse(response)
}

export { handler as saveFlashcardSessionHandler }
export const lambdaHandler = withErrorHandler(handler)

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { dbGet, dbUpdate, TABLES, keys } from '../lib/dynamodb'
import { invokeBedrockModel, parseBedrockJSON } from '../lib/bedrock'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { CompleteStudySessionRequest, CompleteStudySessionResponse, ErrorCode, StudySession } from '../types'
import { getStudySessionSystemPrompt, getStudySessionUserPrompt } from '../prompts/studySessionPrompt'

function validateRequest(data: unknown): CompleteStudySessionRequest {
  const req = data as CompleteStudySessionRequest
  if (!req.sessionId || typeof req.sessionId !== 'string') {
    throw Object.assign(new Error('sessionId is required'), { code: ErrorCode.INVALID_INPUT })
  }
  if (!req.accomplishments || typeof req.accomplishments !== 'string') {
    throw Object.assign(new Error('accomplishments log is required'), { code: ErrorCode.INVALID_INPUT })
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
  logger.setContext(context.awsRequestId, req.userId, 'completeStudySession')
  logger.info('Completing study session', { sessionId: req.sessionId })

  // 1. Fetch active session
  const sessionKey = keys.studySession(req.userId, req.sessionId)
  const session = await dbGet<StudySession & { PK: string; SK: string }>({
    TableName: TABLES.STUDY_SESSIONS,
    Key: sessionKey,
  })

  if (!session) {
    throw Object.assign(new Error('Session not found'), { code: ErrorCode.INVALID_INPUT })
  }
  if (session.status !== 'active') {
    throw Object.assign(new Error('Session is already completed'), { code: ErrorCode.INVALID_INPUT })
  }

  // 2. Validate with Bedrock
  const systemProp = getStudySessionSystemPrompt()
  const userProp = getStudySessionUserPrompt(session.topic, session.durationMinutes, req.accomplishments)

  const raw = await invokeBedrockModel(systemProp, userProp, 2048)
  const analysis = parseBedrockJSON<{ success: boolean; summary: string; nextActions: string[] }>(raw)

  let xpAwarded = 0
  if (analysis.success) {
    // Basic scaling: 10xp for 30m, 20xp for 60m, 30xp for 90m
    xpAwarded = Math.floor(session.durationMinutes / 3)
  }

  // 3. Mark session complete
  await dbUpdate({
    TableName: TABLES.STUDY_SESSIONS,
    Key: sessionKey,
    UpdateExpression:
      'SET #st = :status, accomplishments = :acc, xpEarned = :xp, completedAt = :now',
    ExpressionAttributeNames: {
      '#st': 'status'
    },
    ExpressionAttributeValues: {
      ':status': 'completed',
      ':acc': req.accomplishments,
      ':xp': xpAwarded,
      ':now': new Date().toISOString()
    }
  })

  // 4. Update user XP safely if points were awarded
  let totalXP = 0
  if (xpAwarded > 0) {
    const userKey = keys.user(req.userId)
    const upRes = await dbUpdate({
      TableName: TABLES.USERS,
      Key: userKey,
      UpdateExpression:
        'SET totalXP = if_not_exists(totalXP, :zero) + :xp, timeInvested = if_not_exists(timeInvested, :zero) + :dur',
      ExpressionAttributeValues: {
        ':xp': xpAwarded,
        ':zero': 0,
        ':dur': session.durationMinutes,
      },
      ReturnValues: 'ALL_NEW',
    })
    totalXP = (upRes.totalXP as number) || xpAwarded
  }

  const response: CompleteStudySessionResponse = {
    success: analysis.success,
    summary: analysis.summary,
    xpAwarded,
    totalXP
  }

  return successResponse(response)
}

export { handler as completeStudySessionHandler }
export const lambdaHandler = withErrorHandler(handler)

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { v4 as uuidv4 } from 'uuid'
import { dbPut, TABLES, keys } from '../lib/dynamodb'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { StartStudySessionRequest, StartStudySessionResponse, ErrorCode, StudySession } from '../types'

function validateRequest(data: unknown): StartStudySessionRequest {
  const req = data as StartStudySessionRequest
  if (typeof req.durationMinutes !== 'number' || req.durationMinutes < 1) {
    throw Object.assign(new Error('durationMinutes is required and must be >= 1'), { code: ErrorCode.INVALID_INPUT })
  }
  if (!req.topic || typeof req.topic !== 'string') {
    throw Object.assign(new Error('topic is required'), { code: ErrorCode.INVALID_INPUT })
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
  logger.setContext(context.awsRequestId, req.userId, 'startStudySession')
  logger.info('Starting study session', { topic: req.topic, durationMinutes: req.durationMinutes })

  const sessionId = uuidv4()
  
  const sessionItem: StudySession = {
    id: sessionId,
    userId: req.userId,
    topic: req.topic,
    durationMinutes: req.durationMinutes,
    accomplishments: '',
    xpEarned: 0,
    status: 'active',
    startedAt: new Date().toISOString()
  }

  await dbPut({
    TableName: TABLES.STUDY_SESSIONS,
    Item: {
      ...keys.studySession(req.userId, sessionId),
      ...sessionItem
    }
  })

  const response: StartStudySessionResponse = {
    sessionId,
  }

  return successResponse(response)
}

export { handler as startStudySessionHandler }
export const lambdaHandler = withErrorHandler(handler)

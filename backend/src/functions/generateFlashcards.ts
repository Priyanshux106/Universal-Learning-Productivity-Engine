import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { invokeBedrockModel, parseBedrockJSON } from '../lib/bedrock'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { v4 as uuidv4 } from 'uuid'
import {
  getFlashcardSystemPrompt,
  getFlashcardUserPrompt,
} from '../prompts/flashcardPrompt'
import { GenerateFlashcardsRequest, GenerateFlashcardsResponse, ErrorCode, Flashcard } from '../types'

function validateRequest(data: unknown): GenerateFlashcardsRequest {
  const req = data as GenerateFlashcardsRequest
  if (!req.subject || typeof req.subject !== 'string' || req.subject.length > 200) {
    throw Object.assign(new Error('subject is required and must be < 200 chars'), {
      code: ErrorCode.INVALID_INPUT,
    })
  }
  if (req.count !== undefined && (typeof req.count !== 'number' || req.count < 1 || req.count > 20)) {
    throw Object.assign(new Error('count must be between 1 and 20'), {
      code: ErrorCode.INVALID_INPUT,
    })
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
  logger.setContext(context.awsRequestId, req.userId, 'generateFlashcards')
  logger.info('Generating flashcards', { subject: req.subject })

  const count = req.count || 5
  const diff = req.difficulty || 5

  const systemProp = getFlashcardSystemPrompt()
  const userProp = getFlashcardUserPrompt(req.subject, req.chapter, diff, count)

  const raw = await invokeBedrockModel(systemProp, userProp, 2048)
  const flashcardsData = parseBedrockJSON<any[]>(raw)
  
  if (!Array.isArray(flashcardsData)) {
    throw Object.assign(new Error('Bedrock returned invalid flashcard schema (not an array)'), {
      code: ErrorCode.AI_SERVICE_UNAVAILABLE,
    })
  }

  const flashcards: Flashcard[] = flashcardsData.map((f) => ({
    id: f.id || uuidv4(),
    front: f.front || '',
    back: f.back || ''
  }))

  const response: GenerateFlashcardsResponse = {
    flashcards,
  }

  return successResponse(response)
}

export { handler as generateFlashcardsHandler }
export const lambdaHandler = withErrorHandler(handler)

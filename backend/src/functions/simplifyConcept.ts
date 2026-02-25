import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { invokeBedrockModel, parseBedrockJSON } from '../lib/bedrock'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { getConceptSystemPrompt, getConceptUserPrompt } from '../prompts/conceptPrompt'
import {
  SimplifyConceptRequest,
  SimplifyConceptResponse,
  CodeExplanation,
  ErrorCode,
} from '../types'

function validateRequest(data: unknown): SimplifyConceptRequest {
  const req = data as SimplifyConceptRequest
  if (!req.conceptId || !req.conceptName) {
    const err = new Error('conceptId and conceptName are required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  if (!req.proficiencyLevel) req.proficiencyLevel = 'beginner'
  return req
}

const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  logger.setContext(context.awsRequestId, 'system', 'simplifyConcept')

  const req = parseBody(event, validateRequest)
  logger.info('Simplifying concept', {
    conceptId: req.conceptId,
    proficiency: req.proficiencyLevel,
  })

  const systemPrompt = getConceptSystemPrompt()
  const userPrompt = getConceptUserPrompt(req.conceptName, req.proficiencyLevel, req.context)

  const raw = await invokeBedrockModel(systemPrompt, userPrompt, 4096)
  const parsed = parseBedrockJSON<{
    explanation: CodeExplanation
    relatedConcepts: string[]
    suggestedExercises: string[]
  }>(raw)

  const response: SimplifyConceptResponse = {
    explanation: parsed.explanation,
    relatedConcepts: parsed.relatedConcepts || [],
    suggestedExercises: parsed.suggestedExercises || [],
  }

  logger.info('Concept simplified', { conceptId: req.conceptId })
  return successResponse(response)
}

export { handler as simplifyConceptHandler }
export const lambdaHandler = withErrorHandler(handler)

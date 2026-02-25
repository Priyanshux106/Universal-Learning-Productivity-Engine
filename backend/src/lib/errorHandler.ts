import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { ErrorBody, ErrorCode, ErrorResponse, LambdaResponse, SuccessBody } from '../types'
import { logger } from './logger'

type LambdaHandler = (
  event: APIGatewayProxyEventV2,
  context: Context
) => Promise<APIGatewayProxyResultV2>

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': process.env.FRONTEND_URL || '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Cache-Control': 'no-store',
}

/**
 * Build a success response envelope.
 */
export function successResponse<T>(data: T, statusCode = 200): APIGatewayProxyResultV2 {
  const body: SuccessBody<T> = { success: true, data }
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body),
  }
}

/**
 * Build an error response envelope.
 */
export function errorResponse(
  statusCode: number,
  code: ErrorCode,
  message: string,
  userMessage: string,
  options?: { suggestions?: string[]; retryable?: boolean }
): APIGatewayProxyResultV2 {
  const error: ErrorResponse = {
    code,
    message,
    userMessage,
    suggestions: options?.suggestions,
    retryable: options?.retryable ?? false,
  }
  const body: ErrorBody = { success: false, error }
  return {
    statusCode,
    headers: DEFAULT_HEADERS,
    body: JSON.stringify(body),
  }
}

/**
 * Map an error code to an HTTP status code.
 */
function errorCodeToStatus(code: string): number {
  const map: Record<string, number> = {
    [ErrorCode.INVALID_INPUT]: 400,
    [ErrorCode.UNSUPPORTED_LANGUAGE]: 400,
    [ErrorCode.UNAUTHORIZED]: 401,
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 429,
    [ErrorCode.QUIZ_ALREADY_COMPLETED]: 409,
    [ErrorCode.NO_EXERCISES_AVAILABLE]: 404,
    [ErrorCode.INSUFFICIENT_PROFICIENCY]: 422,
    [ErrorCode.USER_NOT_FOUND]: 404,
    [ErrorCode.AI_SERVICE_UNAVAILABLE]: 503,
    [ErrorCode.CODE_EXECUTION_TIMEOUT]: 504,
    [ErrorCode.CODE_EXECUTION_ERROR]: 502,
    [ErrorCode.DATABASE_THROTTLED]: 503,
    [ErrorCode.DATABASE_ERROR]: 500,
  }
  return map[code] ?? 500
}

/**
 * Middleware wrapper for Lambda handlers.
 * Catches all exceptions and maps them to ErrorResponse shapes.
 */
export function withErrorHandler(handler: LambdaHandler): LambdaHandler {
  return async (event: APIGatewayProxyEventV2, context: Context) => {
    try {
      return await handler(event, context)
    } catch (err) {
      const error = err as Error & { code?: string }

      const code = (error.code as ErrorCode) || ErrorCode.DATABASE_ERROR
      const statusCode = errorCodeToStatus(code)

      logger.error('Unhandled Lambda error', {
        error: error.message,
        stack: error.stack,
        code,
      })

      const retryable = [
        ErrorCode.AI_SERVICE_UNAVAILABLE,
        ErrorCode.DATABASE_THROTTLED,
      ].includes(code as ErrorCode)

      return errorResponse(statusCode, code, error.message, getUserMessage(code), {
        retryable,
      })
    }
  }
}

function getUserMessage(code: ErrorCode): string {
  const messages: Record<ErrorCode, string> = {
    [ErrorCode.INVALID_INPUT]: 'The request data was invalid. Please check your input.',
    [ErrorCode.UNSUPPORTED_LANGUAGE]: 'The programming language you selected is not supported.',
    [ErrorCode.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment and try again.',
    [ErrorCode.UNAUTHORIZED]: 'You are not authorized to perform this action.',
    [ErrorCode.AI_SERVICE_UNAVAILABLE]: 'The AI service is temporarily unavailable. Please try again shortly.',
    [ErrorCode.CODE_EXECUTION_TIMEOUT]: 'Your code took too long to execute. Please optimize and try again.',
    [ErrorCode.CODE_EXECUTION_ERROR]: 'Code execution failed. Please check your code.',
    [ErrorCode.DATABASE_THROTTLED]: 'The service is under high load. Please retry in a moment.',
    [ErrorCode.DATABASE_ERROR]: 'A database error occurred. Please try again.',
    [ErrorCode.QUIZ_ALREADY_COMPLETED]: 'This quiz has already been completed.',
    [ErrorCode.NO_EXERCISES_AVAILABLE]: 'No exercises are available at this difficulty level.',
    [ErrorCode.INSUFFICIENT_PROFICIENCY]: 'You need a higher proficiency level for this content.',
    [ErrorCode.USER_NOT_FOUND]: 'User profile not found.',
  }
  return messages[code] ?? 'An unexpected error occurred. Please try again.'
}

/**
 * Parse and validate request body with a validator function.
 */
export function parseBody<T>(
  event: APIGatewayProxyEventV2,
  validator: (data: unknown) => T
): T {
  if (!event.body) {
    const err = new Error('Request body is required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  try {
    const parsed: unknown = JSON.parse(event.body)
    return validator(parsed)
  } catch (err) {
    const validationErr = new Error(
      err instanceof Error ? err.message : 'Invalid request body'
    )
    ;(validationErr as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw validationErr
  }
}

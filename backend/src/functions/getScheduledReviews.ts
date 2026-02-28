import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { dbQuery, TABLES } from '../lib/dynamodb'
import { withErrorHandler, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import { GetReviewsResponse, Review, ErrorCode } from '../types'

const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  const userId = (event.requestContext as any).authorizer?.jwt?.claims?.sub as string
  if (!userId) {
    throw Object.assign(new Error('Unauthorized'), { code: ErrorCode.UNAUTHORIZED })
  }

  logger.setContext(context.awsRequestId, userId, 'getScheduledReviews')
  logger.info('Fetching scheduled reviews', { userId })

  const now = new Date().toISOString()
  const upcoming7Days = new Date(Date.now() + 7 * 86400000).toISOString()

  // Query all reviews for the user
  const allReviews = await dbQuery<Review & { PK: string; SK: string }>({
    TableName: TABLES.REVIEWS,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
    ExpressionAttributeValues: {
      ':pk': `USER#${userId}`,
      ':prefix': 'REVIEW#',
    },
  })

  const dueReviews = allReviews.filter((r) => r.scheduledFor <= now)
  const upcomingReviews = allReviews.filter(
    (r) => r.scheduledFor > now && r.scheduledFor <= upcoming7Days
  )

  // Sort due reviews by scheduledFor (oldest first)
  dueReviews.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))
  upcomingReviews.sort((a, b) => a.scheduledFor.localeCompare(b.scheduledFor))

  logger.info('Reviews fetched', { due: dueReviews.length, upcoming: upcomingReviews.length })

  const response: GetReviewsResponse = { dueReviews, upcomingReviews }
  return successResponse(response)
}

export { handler as getScheduledReviewsHandler }
export const lambdaHandler = withErrorHandler(handler)

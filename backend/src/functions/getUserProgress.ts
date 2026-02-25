import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import { dbGet, dbQuery, TABLES, keys } from '../lib/dynamodb'
import { withErrorHandler, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import {
  GetProgressResponse,
  LearningPath,
  ProficiencyMap,
  ProficiencyData,
  LearningActivity,
  ConceptGap,
  ErrorCode,
} from '../types'

interface UserRecord {
  totalXP?: number
  level?: number
  streak?: number
  exercisesCompleted?: number
  conceptsMastered?: number
  timeInvested?: number
}

interface ProficiencyRecord extends ProficiencyData {
  PK: string
  SK: string
}

interface RoadmapRecord extends LearningPath {
  PK: string
  SK: string
}

interface ActivityRecord extends LearningActivity {
  PK: string
  SK: string
}

const handler = async (
  event: APIGatewayProxyEventV2,
  context: Context
): Promise<APIGatewayProxyResultV2> => {
  const userId = event.pathParameters?.userId
  if (!userId) {
    const err = new Error('userId path parameter is required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }

  logger.setContext(context.awsRequestId, userId, 'getUserProgress')
  logger.info('Fetching user progress', { userId })

  // Parallel fetches
  const [user, proficiencyItems, roadmapItems, activityItems] = await Promise.all([
    dbGet<UserRecord>({ TableName: TABLES.USERS, Key: keys.user(userId) }),
    dbQuery<ProficiencyRecord>({
      TableName: TABLES.PROFICIENCY,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: { ':pk': `USER#${userId}` },
    }),
    dbQuery<RoadmapRecord>({
      TableName: TABLES.ROADMAPS,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':prefix': 'ROADMAP#',
      },
      Limit: 10,
      ScanIndexForward: false,
    }),
    dbQuery<ActivityRecord>({
      TableName: TABLES.XP_HISTORY,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :prefix)',
      ExpressionAttributeValues: {
        ':pk': `USER#${userId}`,
        ':prefix': 'XP#',
      },
      Limit: 20,
      ScanIndexForward: false,
    }),
  ])

  // Build proficiency map from items
  const proficiencyMap: ProficiencyMap = {}
  for (const item of proficiencyItems) {
    const conceptId = item.SK.replace('CONCEPT#', '')
    proficiencyMap[conceptId] = {
      level: item.level,
      confidence: item.confidence,
      lastAssessed: item.lastAssessed,
      exercisesCompleted: item.exercisesCompleted,
      successRate: item.successRate,
    }
  }

  // Build recent activity from XP history
  const recentActivity: LearningActivity[] = activityItems.map((item) => ({
    type: 'exercise',
    timestamp: item.SK.replace('XP#', ''),
    duration: 0,
    result: item.SK,
  }))

  // Identify knowledge gaps: concepts in roadmaps where proficiency is below required
  const knowledgeGaps: ConceptGap[] = []
  for (const roadmap of roadmapItems) {
    for (const concept of roadmap.concepts || []) {
      const proficiency = proficiencyMap[concept.conceptId]
      const currentLevel = proficiency?.level || 'beginner'
      const levels = ['beginner', 'intermediate', 'advanced', 'expert']
      if (levels.indexOf(currentLevel) < levels.indexOf(concept.proficiencyRequired)) {
        knowledgeGaps.push({
          conceptId: concept.conceptId,
          conceptName: concept.name,
          currentLevel,
          requiredLevel: concept.proficiencyRequired,
          suggestedResources: [],
        })
      }
    }
  }

  const stats = {
    totalXP: user?.totalXP || 0,
    level: user?.level || 1,
    streak: user?.streak || 0,
    exercisesCompleted: user?.exercisesCompleted || 0,
    conceptsMastered:
      Object.values(proficiencyMap).filter(
        (p) => p.level === 'expert' || p.successRate >= 0.9
      ).length,
    timeInvested: user?.timeInvested || 0,
  }

  logger.info('Progress fetched', {
    roadmapCount: roadmapItems.length,
    conceptCount: Object.keys(proficiencyMap).length,
    gapCount: knowledgeGaps.length,
  })

  const response: GetProgressResponse = {
    proficiencyMap,
    learningPaths: roadmapItems,
    recentActivity,
    stats,
    knowledgeGaps,
  }

  return successResponse(response)
}

export { handler as getUserProgressHandler }
export const lambdaHandler = withErrorHandler(handler)

import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from 'aws-lambda'
import {
  dbGet,
  dbPut,
  dbUpdate,
  TABLES,
  keys,
  calculateLevel,
  checkBadgeThresholds,
} from '../lib/dynamodb'
import { withErrorHandler, parseBody, successResponse } from '../lib/errorHandler'
import { logger } from '../lib/logger'
import {
  UpdateXPRequest,
  UpdateXPResponse,
  Badge,
  ErrorCode,
} from '../types'

// XP multipliers per action type
const XP_MULTIPLIERS: Record<UpdateXPRequest['action'], number> = {
  exercise_complete: 1.0,
  quiz_complete: 1.5,
  streak_bonus: 0.5,
  milestone: 2.0,
}

// All available badges (in production, store in DynamoDB Concepts table)
const ALL_BADGES: Record<string, Badge> = {
  first_xp: { id: 'first_xp', name: 'First XP', description: 'Earned your first XP!', iconUrl: '/badges/first_xp.svg' },
  xp_500: { id: 'xp_500', name: 'XP Collector', description: 'Reached 500 XP', iconUrl: '/badges/xp_500.svg' },
  xp_1000: { id: 'xp_1000', name: 'XP Champion', description: 'Reached 1000 XP', iconUrl: '/badges/xp_1000.svg' },
  xp_5000: { id: 'xp_5000', name: 'XP Legend', description: 'Reached 5000 XP', iconUrl: '/badges/xp_5000.svg' },
  level_5: { id: 'level_5', name: 'Level 5', description: 'Reached Level 5', iconUrl: '/badges/level_5.svg' },
  level_10: { id: 'level_10', name: 'Level 10', description: 'Reached Level 10', iconUrl: '/badges/level_10.svg' },
  level_25: { id: 'level_25', name: 'Level 25', description: 'Reached Level 25', iconUrl: '/badges/level_25.svg' },
  streak_7: { id: 'streak_7', name: '7-Day Streak', description: '7 days in a row!', iconUrl: '/badges/streak_7.svg' },
  streak_30: { id: 'streak_30', name: '30-Day Streak', description: '30 days in a row!', iconUrl: '/badges/streak_30.svg' },
}

function validateRequest(data: unknown): UpdateXPRequest {
  const req = data as UpdateXPRequest
  if (!req.userId) {
    const err = new Error('userId is required')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  if (!req.action || !['exercise_complete', 'quiz_complete', 'streak_bonus', 'milestone'].includes(req.action)) {
    const err = new Error('Invalid action type')
    ;(err as Error & { code: string }).code = ErrorCode.INVALID_INPUT
    throw err
  }
  if (typeof req.points !== 'number' || req.points < 0) {
    const err = new Error('points must be a non-negative number')
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
  logger.setContext(context.awsRequestId, req.userId, 'updateXP')
  logger.info('Updating XP', { userId: req.userId, action: req.action, points: req.points })

  // Calculate actual points awarded (with multiplier)
  const multiplier = XP_MULTIPLIERS[req.action]
  const pointsAwarded = Math.round(req.points * multiplier)

  // Fetch current user state
  const now = new Date().toISOString()
  const today = now.split('T')[0]

  interface UserRecord {
    totalXP?: number
    level?: number
    streak?: number
    lastActiveDate?: string
    earnedBadges?: string[]
  }

  let user = await dbGet<UserRecord>({
    TableName: TABLES.USERS,
    Key: keys.user(req.userId),
  })

  if (!user) {
    // Create user profile if missing
    user = { totalXP: 0, level: 1, streak: 0, lastActiveDate: '', earnedBadges: [] }
    await dbPut({
      TableName: TABLES.USERS,
      Item: {
        ...keys.user(req.userId),
        ...user,
        createdAt: now,
      },
    })
  }

  const prevXP = user.totalXP || 0
  const newTotalXP = prevXP + pointsAwarded

  // Update streak
  const lastDate = user.lastActiveDate || ''
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  let newStreak = user.streak || 0

  if (lastDate === today) {
    // Already active today — no change
  } else if (lastDate === yesterday) {
    newStreak += 1
  } else {
    newStreak = 1 // Reset streak
  }

  const newLevel = calculateLevel(newTotalXP)

  // Check for new badges (compare against previously earned)
  const alreadyEarned = new Set(user.earnedBadges || [])
  const allEarnedIds = checkBadgeThresholds(newTotalXP, newLevel, newStreak)
  const newBadgeIds = allEarnedIds.filter((id) => !alreadyEarned.has(id))
  const newBadges: Badge[] = newBadgeIds
    .map((id) => ALL_BADGES[id])
    .filter(Boolean)
    .map((b) => ({ ...b, earnedAt: now }))

  // Atomic update in DynamoDB
  await dbUpdate({
    TableName: TABLES.USERS,
    Key: keys.user(req.userId),
    UpdateExpression: `
      SET totalXP = :xp,
          #lvl = :level,
          streak = :streak,
          lastActiveDate = :today,
          earnedBadges = :badges
    `,
    ExpressionAttributeNames: { '#lvl': 'level' },
    ExpressionAttributeValues: {
      ':xp': newTotalXP,
      ':level': newLevel,
      ':streak': newStreak,
      ':today': today,
      ':badges': [...allEarnedIds],
    },
  })

  // Record XP history entry
  await dbPut({
    TableName: TABLES.XP_HISTORY,
    Item: {
      ...keys.xpHistory(req.userId),
      userId: req.userId,
      action: req.action,
      points: pointsAwarded,
      metadata: req.metadata || {},
      createdAt: now,
    },
  })

  logger.info('XP updated', {
    userId: req.userId,
    newTotalXP,
    newLevel,
    newStreak,
    newBadgeCount: newBadges.length,
  })

  const response: UpdateXPResponse = {
    totalXP: newTotalXP,
    level: newLevel,
    streak: newStreak,
    newBadges,
  }

  return successResponse(response)
}

export { handler as updateXPHandler }
export const lambdaHandler = withErrorHandler(handler)

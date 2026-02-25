import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
  UpdateCommand,
  UpdateCommandInput,
  QueryCommand,
  QueryCommandInput,
  BatchGetCommand,
  BatchGetCommandInput,
  DeleteCommand,
  DeleteCommandInput,
} from '@aws-sdk/lib-dynamodb'
import { logger } from './logger'

const TABLE_PREFIX = process.env.DYNAMODB_TABLE_PREFIX || 'studdybuddy'

const clientConfig: Record<string, unknown> = {
  region: process.env.AWS_REGION || 'us-east-1',
}

// Support local DynamoDB for development (SAM local)
if (process.env.DYNAMODB_ENDPOINT) {
  clientConfig.endpoint = process.env.DYNAMODB_ENDPOINT
}

const rawClient = new DynamoDBClient(clientConfig)

export const docClient = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: { removeUndefinedValues: true },
})

// Table names
export const TABLES = {
  USERS: `${TABLE_PREFIX}-users`,
  ROADMAPS: `${TABLE_PREFIX}-roadmaps`,
  QUIZZES: `${TABLE_PREFIX}-quizzes`,
  PROFICIENCY: `${TABLE_PREFIX}-proficiency`,
  REVIEWS: `${TABLE_PREFIX}-reviews`,
  CODE_LOGS: `${TABLE_PREFIX}-codelogs`,
  XP_HISTORY: `${TABLE_PREFIX}-xphistory`,
  CONCEPTS: `${TABLE_PREFIX}-concepts`,
}

// Key helpers
export const keys = {
  user: (userId: string) => ({ PK: `USER#${userId}`, SK: 'PROFILE' }),
  roadmap: (userId: string, roadmapId: string) => ({
    PK: `USER#${userId}`,
    SK: `ROADMAP#${roadmapId}`,
  }),
  quiz: (userId: string, quizId: string) => ({
    PK: `USER#${userId}`,
    SK: `QUIZ#${quizId}`,
  }),
  proficiency: (userId: string, conceptId: string) => ({
    PK: `USER#${userId}`,
    SK: `CONCEPT#${conceptId}`,
  }),
  review: (userId: string, conceptId: string) => ({
    PK: `USER#${userId}`,
    SK: `REVIEW#${conceptId}`,
  }),
  codeLog: (userId: string, logId: string) => ({
    PK: `USER#${userId}`,
    SK: `CODE#${new Date().toISOString()}#${logId}`,
  }),
  xpHistory: (userId: string) => ({
    PK: `USER#${userId}`,
    SK: `XP#${new Date().toISOString()}`,
  }),
  concept: (conceptId: string) => ({
    PK: `CONCEPT#${conceptId}`,
    SK: 'META',
  }),
}

// -------------------------
// Generic DynamoDB helpers
// -------------------------

export async function dbGet<T>(input: GetCommandInput): Promise<T | null> {
  const result = await docClient.send(new GetCommand(input))
  return (result.Item as T) ?? null
}

export async function dbPut(input: PutCommandInput): Promise<void> {
  await docClient.send(new PutCommand(input))
}

export async function dbUpdate(input: UpdateCommandInput): Promise<Record<string, unknown>> {
  const result = await docClient.send(new UpdateCommand(input))
  return (result.Attributes as Record<string, unknown>) ?? {}
}

export async function dbQuery<T>(input: QueryCommandInput): Promise<T[]> {
  const result = await docClient.send(new QueryCommand(input))
  return (result.Items as T[]) ?? []
}

export async function dbBatchGet<T>(input: BatchGetCommandInput): Promise<T[]> {
  const result = await docClient.send(new BatchGetCommand(input))
  const allItems: T[] = []
  if (result.Responses) {
    for (const items of Object.values(result.Responses)) {
      allItems.push(...(items as T[]))
    }
  }
  return allItems
}

export async function dbDelete(input: DeleteCommandInput): Promise<void> {
  await docClient.send(new DeleteCommand(input))
}

// -------------------------
// XP / Level helpers
// -------------------------

export function calculateLevel(totalXP: number): number {
  // Level = floor(sqrt(totalXP / 100)) + 1
  return Math.floor(Math.sqrt(totalXP / 100)) + 1
}

export function checkBadgeThresholds(
  totalXP: number,
  level: number,
  streak: number
): string[] {
  const newBadgeIds: string[] = []

  const xpThresholds: Record<number, string> = {
    100: 'first_xp',
    500: 'xp_500',
    1000: 'xp_1000',
    5000: 'xp_5000',
  }
  for (const [threshold, badgeId] of Object.entries(xpThresholds)) {
    if (totalXP >= Number(threshold)) newBadgeIds.push(badgeId)
  }

  const levelBadges: Record<number, string> = {
    5: 'level_5',
    10: 'level_10',
    25: 'level_25',
  }
  for (const [lvl, badgeId] of Object.entries(levelBadges)) {
    if (level >= Number(lvl)) newBadgeIds.push(badgeId)
  }

  if (streak >= 7) newBadgeIds.push('streak_7')
  if (streak >= 30) newBadgeIds.push('streak_30')

  return newBadgeIds
}

// -------------------------
// SM-2 spaced repetition
// -------------------------

/**
 * Calculate the next review interval using SM-2 algorithm.
 * @param easeFactor Current ease factor (2.5 default)
 * @param repetitions Number of successful reviews
 * @param quality 0-5 (0-2 = fail, 3-5 = pass)
 */
export function sm2NextInterval(
  easeFactor: number,
  repetitions: number,
  quality: number
): { interval: number; newEaseFactor: number; newRepetitions: number } {
  let interval: number
  let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  newEaseFactor = Math.max(1.3, newEaseFactor)

  if (quality < 3) {
    // Failed — reset
    interval = 1
    return { interval, newEaseFactor, newRepetitions: 0 }
  }

  if (repetitions === 0) interval = 1
  else if (repetitions === 1) interval = 6
  else interval = Math.round(repetitions * newEaseFactor)

  return { interval, newEaseFactor, newRepetitions: repetitions + 1 }
}

export { logger }

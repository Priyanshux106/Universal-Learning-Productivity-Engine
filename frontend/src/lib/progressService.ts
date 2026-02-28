import { apiClient } from './apiClient'

export interface UserStats {
  totalXP: number
  level: number
  streak: number
  exercisesCompleted: number
  conceptsMastered: number
  timeInvested: number
}

export interface UserProgressResponse {
  proficiencyMap: Record<string, { level: string; confidence: number; lastAssessed: string; exercisesCompleted: number; successRate: number }>
  learningPaths: unknown[]
  recentActivity: { type: string; timestamp: string; conceptId?: string; duration: number; result?: string }[]
  stats: UserStats
  knowledgeGaps: { conceptId: string; conceptName: string; currentLevel: string; requiredLevel: string }[]
}

export interface GetReviewsResponse {
  dueReviews: { conceptId: string; scheduledFor: string; interval: number }[]
  upcomingReviews: { conceptId: string; scheduledFor: string; interval: number }[]
}

export const progressService = {
  getProgress: (userId: string) =>
    apiClient.get<UserProgressResponse>(`/api/progress/${userId}`),

  getScheduledReviews: () =>
    apiClient.get<GetReviewsResponse>('/api/reviews'),
}

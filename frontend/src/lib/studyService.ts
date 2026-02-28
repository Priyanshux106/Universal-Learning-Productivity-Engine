import { apiClient } from './apiClient'

export interface StartStudySessionResponse {
  sessionId: string
}

export interface CompleteStudySessionResponse {
  success: boolean
  summary: string
  xpAwarded: number
  totalXP: number
}

export const studyService = {
  start: (topic: string, durationMinutes: number) =>
    apiClient.post<StartStudySessionResponse>('/api/study/start', { topic, durationMinutes }),

  complete: (sessionId: string, accomplishments: string) =>
    apiClient.post<CompleteStudySessionResponse>('/api/study/complete', { sessionId, accomplishments }),
}

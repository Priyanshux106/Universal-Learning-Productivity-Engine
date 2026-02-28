import { apiClient } from './apiClient'

export interface LearningGoal {
  title: string
  description: string
  targetConcepts: string[]
  deadline?: string
}

export interface ConceptNode {
  conceptId: string
  name: string
  description: string
  order: number
  prerequisites: string[]
  estimatedTime: number
  status: 'not_started' | 'in_progress' | 'mastered'
}

export interface LearningPath {
  id: string
  userId: string
  goal: LearningGoal
  concepts: ConceptNode[]
  estimatedDuration: number
  createdAt: string
  progress: number
}

export interface GenerateRoadmapResponse {
  roadmap: LearningPath
  estimatedTotalTime: number
}

export const roadmapService = {
  generate: (goal: LearningGoal, currentProficiency: Record<string, unknown> = {}) =>
    apiClient.post<GenerateRoadmapResponse>('/api/roadmap/generate', { goal, currentProficiency }),
}

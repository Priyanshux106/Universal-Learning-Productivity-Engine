import { apiClient } from './apiClient'

export interface QuizQuestion {
  id: string
  conceptId: string
  difficulty: number
  type: 'coding' | 'multiple_choice' | 'explanation' | 'debugging'
  prompt: string
  starterCode?: string
  options?: { label: string; text: string }[]
  correctAnswer: string
  hints: string[]
  explanation: string
  estimatedTime: number
}

export interface GenerateQuizResponse {
  quizId: string
  questions: QuizQuestion[]
  timeLimit: number
}

export const quizService = {
  generate: (conceptIds: string[], difficulty: number, numberOfQuestions: number) =>
    apiClient.post<GenerateQuizResponse>('/api/quiz/generate', {
      conceptIds,
      difficulty,
      numberOfQuestions,
    }),
}

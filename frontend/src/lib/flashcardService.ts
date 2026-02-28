import { apiClient } from './apiClient'

export interface Flashcard {
  id: string
  front: string
  back: string
}

export interface GenerateFlashcardsResponse {
  flashcards: Flashcard[]
}

export interface SaveFlashcardSessionResponse {
  sessionId: string
  xpAwarded: number
  totalXP: number
}

export const flashcardService = {
  generate: (subject: string, chapter?: string, difficulty = 5, count = 10) =>
    apiClient.post<GenerateFlashcardsResponse>('/api/flashcards/generate', {
      subject,
      chapter,
      difficulty,
      count,
    }),

  saveSession: (subject: string, totalCards: number, correctCount: number, chapter?: string) =>
    apiClient.post<SaveFlashcardSessionResponse>('/api/flashcards/session', {
      subject,
      chapter,
      totalCards,
      correctCount,
    }),
}

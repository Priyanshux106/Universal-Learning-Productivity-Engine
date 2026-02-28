import { apiClient } from './apiClient'

export interface SimplifyConceptResponse {
  explanation: {
    summary: string
    stepByStep: { lineRange: [number, number]; explanation: string; conceptsUsed: string[] }[]
    concepts: string[]
    patterns: { name: string; type: string; confidence: number; explanation: string }[]
    suggestions: string[]
  }
  relatedConcepts: string[]
  suggestedExercises: string[]
}

export const conceptService = {
  simplify: (conceptName: string, proficiencyLevel: string, context?: string) =>
    apiClient.post<SimplifyConceptResponse>('/api/concept/simplify', {
      conceptName,
      proficiencyLevel,
      context,
    }),
}

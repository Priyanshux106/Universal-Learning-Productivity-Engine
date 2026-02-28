import { apiClient } from './apiClient'

export interface AnalyzeCodeResponse {
  execution: {
    stdout: string
    stderr: string
    exitCode: number
    executionTime: number
  }
  explanation: {
    summary: string
    stepByStep: { lineRange: [number, number]; explanation: string; conceptsUsed: string[] }[]
    concepts: string[]
    patterns: { name: string; type: string; confidence: number; explanation: string; alternatives?: string[] }[]
    complexity: { timeComplexity: string; spaceComplexity: string; cyclomaticComplexity: number }
    suggestions: string[]
  }
  patterns: { name: string; type: string; confidence: number; explanation: string }[]
  suggestions: { type: string; description: string; suggestedCode?: string; priority: string }[]
}

export interface EvaluateSolutionResponse {
  correct: boolean
  testResults: { testCaseId: string; passed: boolean; input: unknown; expectedOutput: unknown; actualOutput: unknown }[]
  feedback: string
  xpAwarded: number
  newProficiency: string
}

export const developerService = {
  analyzeCode: (code: string, language: string, context?: string) =>
    apiClient.post<AnalyzeCodeResponse>('/api/code/analyze', { code, language, context }),

  evaluateSolution: (exerciseId: string, solution: string, language: string) =>
    apiClient.post<EvaluateSolutionResponse>('/api/code/evaluate', { exerciseId, solution, language }),
}

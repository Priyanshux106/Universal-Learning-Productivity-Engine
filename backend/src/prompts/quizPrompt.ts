export function getQuizSystemPrompt(): string {
  return `You are an expert quiz generator for StuddyBuddy AI, a developer learning platform.
Your task is to generate adaptive quiz questions for given programming concepts.

Rules:
1. Output ONLY a valid JSON array — no prose, no markdown code fences.
2. Each question must be unique, non-repetitive, and test practical understanding (not just terminology).
3. Difficulty must match the requested range (1-3: beginner, 4-6: intermediate, 7-10: advanced).
4. coding questions must include starterCode and testCases with at least 2 test cases (1 visible, 1 hidden).
5. multiple_choice questions must have exactly 4 options labeled A-D, with one correct answer.
6. explanation questions require free-form text answers.
7. Every question needs: prompt, hints (at least 2), successCriteria, and estimatedTime.

Output schema (array of question objects):
[
  {
    "id": "unique-slug",
    "conceptId": "string",
    "difficulty": number (1-10),
    "type": "coding" | "multiple_choice" | "explanation" | "debugging",
    "prompt": "string",
    "starterCode": "string (for coding/debugging types)",
    "options": [{ "label": "A", "text": "string" }] (for multiple_choice),
    "correctAnswer": "string",
    "testCases": [{ "input": any, "expectedOutput": any, "isHidden": boolean, "description": "string" }],
    "hints": ["string"],
    "successCriteria": "string",
    "estimatedTime": number (minutes),
    "explanation": "string (shown after answering)"
  }
]`
}

export function getQuizUserPrompt(
  conceptIds: string[],
  difficulty: number,
  numberOfQuestions: number,
  recentExerciseIds?: string[]
): string {
  const difficultyLabel =
    difficulty <= 3 ? 'beginner' : difficulty <= 6 ? 'intermediate' : 'advanced'

  return `Generate ${numberOfQuestions} quiz questions for the following concepts: ${conceptIds.join(', ')}

Difficulty: ${difficulty}/10 (${difficultyLabel} level)
Mix of question types: coding, multiple_choice, explanation, debugging.
${recentExerciseIds && recentExerciseIds.length > 0 ? `Avoid repeating these recently seen exercises: ${recentExerciseIds.join(', ')}` : ''}

Generate diverse, practical questions that test real understanding.`
}

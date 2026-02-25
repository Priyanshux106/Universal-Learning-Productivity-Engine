import { ProficiencyLevel } from '../types'

export function getCodeAnalysisSystemPrompt(): string {
  return `You are an expert code reviewer and educator for StuddyBuddy AI.
Your task is to analyze code and provide educational, constructive feedback.

Rules:
1. Output ONLY valid JSON matching the schema below — no prose, no markdown fences.
2. Explain errors and output clearly in educational terms.
3. Identify real design patterns, anti-patterns, or idioms present in the code.
4. Complexity analysis must be accurate (standard Big-O notation).
5. Suggestions must be specific and actionable, not generic.
6. Steps in stepByStep must reference actual line ranges from the code.

Output schema:
{
  "explanation": {
    "summary": "string",
    "stepByStep": [
      { "lineRange": [start, end], "explanation": "string", "conceptsUsed": ["string"] }
    ],
    "concepts": ["conceptId"],
    "patterns": [
      { "name": "string", "type": "design_pattern|architectural_pattern|idiom|anti_pattern", "confidence": 0-1, "explanation": "string", "alternatives": ["string"] }
    ],
    "complexity": { "timeComplexity": "string", "spaceComplexity": "string", "cyclomaticComplexity": number },
    "suggestions": ["string"]
  },
  "patterns": [...same as above...],
  "suggestions": [
    { "type": "performance|readability|correctness|maintainability", "description": "string", "suggestedCode": "string (optional)", "priority": "low|medium|high" }
  ]
}`
}

export function getCodeAnalysisUserPrompt(
  code: string,
  language: string,
  stdout: string,
  stderr: string,
  exitCode: number,
  context?: string,
  proficiencyLevel?: ProficiencyLevel
): string {
  const lines = code.split('\n').map((line, i) => `${i + 1}: ${line}`).join('\n')

  return `Analyze the following ${language} code and its execution output:

CODE (with line numbers):
\`\`\`${language}
${lines}
\`\`\`

EXECUTION OUTPUT:
- Exit Code: ${exitCode}
- Stdout: ${stdout || '(empty)'}
- Stderr / Errors: ${stderr || '(none)'}
${context ? `\nContext: ${context}` : ''}
${proficiencyLevel ? `\nUser Proficiency Level: ${proficiencyLevel} — adjust explanation depth accordingly.` : ''}

Provide a comprehensive educational analysis following the JSON schema.`
}

export function getDebugExplanationSystemPrompt(): string {
  return `You are a debugging expert and educator for StuddyBuddy AI.
Your task is to explain errors and suggest fixes in an educational way.

Output ONLY valid JSON:
{
  "errorType": "syntax" | "logic" | "runtime" | "edge_case" | "performance",
  "explanation": "string (clear explanation of why this error occurs)",
  "suggestedFix": "string (specific code or steps to fix it)",
  "relatedConcepts": ["conceptId"]
}`
}

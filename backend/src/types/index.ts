// ============================================================
// StuddyBuddy AI — Shared TypeScript Types
// Based on design.md
// ============================================================

// -------------------------
// API Response Envelope
// -------------------------

export interface LambdaResponse<T> {
  statusCode: number
  headers: Record<string, string>
  body: string // JSON.stringify'd body
}

export interface SuccessBody<T> {
  success: true
  data: T
}

export interface ErrorBody {
  success: false
  error: ErrorResponse
}

export interface ErrorResponse {
  code: ErrorCode
  message: string
  userMessage: string
  suggestions?: string[]
  retryable: boolean
}

export enum ErrorCode {
  // Client errors
  INVALID_INPUT = 'INVALID_INPUT',
  UNSUPPORTED_LANGUAGE = 'UNSUPPORTED_LANGUAGE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED = 'UNAUTHORIZED',

  // Service errors
  AI_SERVICE_UNAVAILABLE = 'AI_SERVICE_UNAVAILABLE',
  CODE_EXECUTION_TIMEOUT = 'CODE_EXECUTION_TIMEOUT',
  CODE_EXECUTION_ERROR = 'CODE_EXECUTION_ERROR',
  DATABASE_THROTTLED = 'DATABASE_THROTTLED',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // Business logic errors
  QUIZ_ALREADY_COMPLETED = 'QUIZ_ALREADY_COMPLETED',
  NO_EXERCISES_AVAILABLE = 'NO_EXERCISES_AVAILABLE',
  INSUFFICIENT_PROFICIENCY = 'INSUFFICIENT_PROFICIENCY',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
}

// -------------------------
// Proficiency
// -------------------------

export type ProficiencyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'

export interface ProficiencyData {
  level: ProficiencyLevel
  confidence: number // 0-1
  lastAssessed: string // ISO 8601
  exercisesCompleted: number
  successRate: number // 0-1
}

export type ProficiencyMap = Record<string, ProficiencyData>

// -------------------------
// Learning Path / Roadmap
// -------------------------

export interface LearningGoal {
  title: string
  description: string
  targetConcepts: string[]
  deadline?: string // ISO 8601
}

export interface ConceptNode {
  conceptId: string
  name: string
  description: string
  order: number
  prerequisites: string[]
  estimatedTime: number // minutes
  status: 'not_started' | 'in_progress' | 'mastered'
  proficiencyRequired: ProficiencyLevel
}

export interface LearningPath {
  id: string
  userId: string
  goal: LearningGoal
  concepts: ConceptNode[]
  estimatedDuration: number // minutes
  createdAt: string // ISO 8601
  progress: number // 0-100
}

// -------------------------
// Exercises
// -------------------------

export interface TestCase {
  input: unknown
  expectedOutput: unknown
  isHidden: boolean
  description: string
}

export interface Exercise {
  id: string
  conceptId: string
  difficulty: number // 1-10
  type: 'coding' | 'multiple_choice' | 'explanation' | 'debugging'
  prompt: string
  starterCode?: string
  testCases: TestCase[]
  hints: string[]
  successCriteria: string
  estimatedTime: number // minutes
}

export interface TestResult {
  testCaseId: string
  passed: boolean
  input: unknown
  expectedOutput: unknown
  actualOutput: unknown
}

// -------------------------
// Code Explanation
// -------------------------

export interface ExplanationStep {
  lineRange: [number, number]
  explanation: string
  conceptsUsed: string[]
}

export interface Pattern {
  name: string
  type: 'design_pattern' | 'architectural_pattern' | 'idiom' | 'anti_pattern'
  confidence: number // 0-1
  explanation: string
  alternatives?: string[]
}

export interface ComplexityAnalysis {
  timeComplexity: string
  spaceComplexity: string
  cyclomaticComplexity: number
}

export interface CodeExplanation {
  summary: string
  stepByStep: ExplanationStep[]
  concepts: string[] // concept IDs
  patterns: Pattern[]
  complexity: ComplexityAnalysis
  suggestions: string[]
}

export interface Improvement {
  type: 'performance' | 'readability' | 'correctness' | 'maintainability'
  description: string
  suggestedCode?: string
  priority: 'low' | 'medium' | 'high'
}

export interface ErrorExplanation {
  errorType: 'syntax' | 'logic' | 'runtime' | 'edge_case' | 'performance'
  explanation: string
  suggestedFix: string
  relatedConcepts: string[]
}

// -------------------------
// Spaced Repetition
// -------------------------

export interface Review {
  conceptId: string
  scheduledFor: string // ISO 8601
  interval: number // days
  easeFactor: number // SM-2 algorithm
  repetitions: number
}

// -------------------------
// Gamification
// -------------------------

export interface Badge {
  id: string
  name: string
  description: string
  iconUrl: string
  earnedAt?: string // ISO 8601
}

// -------------------------
// Knowledge Graph / Concepts
// -------------------------

export interface LearningResource {
  type: 'article' | 'video' | 'documentation' | 'interactive'
  url: string
  title: string
  estimatedTime: number // minutes
}

export interface Concept {
  id: string
  name: string
  description: string
  category: string
  difficulty: number // 1-10
  estimatedLearningTime: number // minutes
  resources: LearningResource[]
  prerequisites: string[] // concept IDs
  relatedConcepts: string[] // concept IDs
}

// -------------------------
// User / Preferences
// -------------------------

export interface UserPreferences {
  preferredLanguages: string[]
  learningStyle: 'visual' | 'textual' | 'interactive' | 'mixed'
  difficultyPreference: 'gradual' | 'challenging'
  sessionDuration: number // preferred minutes per session
  notificationsEnabled: boolean
}

// -------------------------
// Activity / Progress
// -------------------------

export interface LearningActivity {
  type: 'exercise' | 'quiz' | 'review' | 'code_analysis' | 'roadmap'
  timestamp: string // ISO 8601
  conceptId?: string
  duration: number // seconds
  result?: string
}

export interface ExerciseAttempt {
  exerciseId: string
  conceptId: string
  timestamp: string // ISO 8601
  metrics: {
    correct: boolean
    timeSpent: number // seconds
    hintsUsed: number
    attempts: number
    codeQuality?: number // 0-1
  }
}

export interface ConceptGap {
  conceptId: string
  conceptName: string
  currentLevel: ProficiencyLevel
  requiredLevel: ProficiencyLevel
  suggestedResources: LearningResource[]
}

// -------------------------
// Deep Study / Flashcards
// -------------------------

export interface Flashcard {
  id: string
  front: string
  back: string
}

export interface FlashcardSession {
  id: string
  userId: string
  subject: string
  chapter?: string
  totalCards: number
  correctCount: number
  xpEarned: number
  timestamp: string // ISO 8601
}

export interface StudySession {
  id: string
  userId: string
  durationMinutes: number
  topic: string
  accomplishments: string
  xpEarned: number
  status: 'active' | 'completed'
  startedAt: string // ISO 8601
  completedAt?: string // ISO 8601
}

// -------------------------
// Lambda Request / Response Types
// -------------------------

export interface GenerateRoadmapRequest {
  userId: string
  goal: LearningGoal
  currentProficiency: ProficiencyMap
}

export interface GenerateRoadmapResponse {
  roadmap: LearningPath
  estimatedTotalTime: number
}

export interface SimplifyConceptRequest {
  conceptId: string
  conceptName: string
  proficiencyLevel: ProficiencyLevel
  context?: string
}

export interface SimplifyConceptResponse {
  explanation: CodeExplanation
  relatedConcepts: string[]
  suggestedExercises: string[]
}

export interface GenerateQuizRequest {
  userId: string
  conceptIds: string[]
  difficulty: number // 1-10
  numberOfQuestions: number // 5-20
}

export interface GenerateQuizResponse {
  quizId: string
  questions: Exercise[]
  timeLimit: number // seconds
}

export interface AnalyzeCodeRequest {
  userId: string
  code: string
  language: string
  context?: string
}

export interface AnalyzeCodeResponse {
  execution: {
    stdout: string
    stderr: string
    exitCode: number
    executionTime: number // ms
  }
  explanation: CodeExplanation
  patterns: Pattern[]
  suggestions: Improvement[]
}

export interface EvaluateSolutionRequest {
  userId: string
  exerciseId: string
  solution: string
  language: string
}

export interface EvaluateSolutionResponse {
  correct: boolean
  testResults: TestResult[]
  feedback: string
  errorAnalysis?: ErrorExplanation
  xpAwarded: number
  newProficiency: ProficiencyLevel
}

export interface UpdateXPRequest {
  userId: string
  action: 'exercise_complete' | 'quiz_complete' | 'streak_bonus' | 'milestone'
  points: number
  metadata?: Record<string, unknown>
}

export interface UpdateXPResponse {
  totalXP: number
  level: number
  streak: number
  newBadges: Badge[]
}

export interface GetReviewsResponse {
  dueReviews: Review[]
  upcomingReviews: Review[]
}

export interface GetProgressResponse {
  proficiencyMap: ProficiencyMap
  learningPaths: LearningPath[]
  recentActivity: LearningActivity[]
  stats: {
    totalXP: number
    level: number
    streak: number
    exercisesCompleted: number
    conceptsMastered: number
    timeInvested: number // minutes
  }
  knowledgeGaps: ConceptGap[]
}

export interface GenerateFlashcardsRequest {
  userId: string
  subject: string
  chapter?: string
  difficulty: number
  count: number
}

export interface GenerateFlashcardsResponse {
  flashcards: Flashcard[]
}

export interface SaveFlashcardSessionRequest {
  userId: string
  subject: string
  chapter?: string
  totalCards: number
  correctCount: number
}

export interface SaveFlashcardSessionResponse {
  sessionId: string
  xpAwarded: number
  totalXP: number
}

export interface StartStudySessionRequest {
  userId: string
  durationMinutes: number
  topic: string
}

export interface StartStudySessionResponse {
  sessionId: string
}

export interface CompleteStudySessionRequest {
  userId: string
  sessionId: string
  accomplishments: string
}

export interface CompleteStudySessionResponse {
  success: boolean
  summary: string
  xpAwarded: number
  totalXP: number
}

// -------------------------
// CloudWatch Logger
// -------------------------

export interface LogEntry {
  timestamp: string
  requestId: string
  userId: string
  function: string
  level: 'INFO' | 'WARN' | 'ERROR'
  message: string
  duration?: number
  metadata?: Record<string, unknown>
}

// -------------------------
// Judge0 Types
// -------------------------

export type Judge0LanguageId =
  | 71  // Python 3
  | 63  // JavaScript
  | 62  // Java
  | 54  // C++
  | 60  // Go
  | 73  // Rust

export const JUDGE0_LANGUAGE_MAP: Record<string, Judge0LanguageId> = {
  python: 71,
  javascript: 63,
  java: 62,
  cpp: 54,
  go: 60,
  rust: 73,
}

export interface Judge0SubmissionRequest {
  source_code: string
  language_id: Judge0LanguageId
  stdin?: string
  expected_output?: string
}

export interface Judge0SubmissionResponse {
  token: string
}

export interface Judge0Result {
  stdout: string | null
  stderr: string | null
  compile_output: string | null
  message: string | null
  time: string | null // seconds as string
  memory: number | null
  exit_code: number | null
  status: {
    id: number
    description: string
  }
}

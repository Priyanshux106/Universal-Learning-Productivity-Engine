import axios from 'axios'
import { SSMClient, GetParameterCommand } from '@aws-sdk/client-ssm'
import {
  Judge0LanguageId,
  Judge0Result,
  Judge0SubmissionRequest,
  JUDGE0_LANGUAGE_MAP,
  ErrorCode,
} from '../types'
import { logger } from './logger'

const JUDGE0_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com'
let JUDGE0_KEY = '' // Fetched from SSM
const JUDGE0_HOST = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com'

const MAX_POLL_ATTEMPTS = 20
const POLL_INTERVAL_MS = 500

// Status codes that mean "still running"
const PENDING_STATUS_IDS = new Set([1, 2]) // In Queue, Processing

async function getApiKey(): Promise<string> {
  if (JUDGE0_KEY) return JUDGE0_KEY

  const ssm = new SSMClient({ region: process.env.AWS_REGION || 'us-east-1' })
  try {
    const res = await ssm.send(new GetParameterCommand({
      Name: '/studdybuddy/prod/judge0-api-key',
      WithDecryption: true
    }))
    JUDGE0_KEY = res.Parameter?.Value || ''
    return JUDGE0_KEY
  } catch (err) {
    logger.error('Failed to fetch Judge0 API key from SSM', { error: (err as Error).message })
    throw err
  }
}

async function getHeaders() {
  const key = await getApiKey()
  return {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': key,
    'X-RapidAPI-Host': JUDGE0_HOST,
  }
}

/**
 * Resolve a language string to a Judge0 language_id.
 */
export function resolveLanguageId(language: string): Judge0LanguageId {
  const normalized = language.toLowerCase().trim()
  const id = JUDGE0_LANGUAGE_MAP[normalized]
  if (!id) {
    const err = new Error(`Unsupported language: ${language}`)
    ;(err as Error & { code: string }).code = ErrorCode.UNSUPPORTED_LANGUAGE
    throw err
  }
  return id
}

/**
 * Submit code to Judge0 and return the submission token.
 */
async function submitCode(
  sourceCode: string,
  languageId: Judge0LanguageId,
  stdin?: string
): Promise<string> {
  const payload: Judge0SubmissionRequest = {
    source_code: sourceCode,
    language_id: languageId,
    stdin,
  }

  const currentHeaders = await getHeaders()

  const response = await axios.post<{ token: string }>(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=false`,
    payload,
    { headers: currentHeaders }
  )

  return response.data.token
}

/**
 * Poll Judge0 for a submission result.
 * Polls every 500ms, up to 20 attempts (10s total).
 */
async function pollResult(token: string): Promise<Judge0Result> {
  const currentHeaders = await getHeaders()

  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS))

    const response = await axios.get<Judge0Result>(
      `${JUDGE0_URL}/submissions/${token}?base64_encoded=false`,
      { headers: currentHeaders }
    )

    const result = response.data
    if (!PENDING_STATUS_IDS.has(result.status.id)) {
      return result
    }

    logger.info('Judge0 polling...', { attempt, token, status: result.status.description })
  }

  const err = new Error('CODE_EXECUTION_TIMEOUT')
  ;(err as Error & { code: string }).code = ErrorCode.CODE_EXECUTION_TIMEOUT
  throw err
}

export interface CodeExecutionResult {
  stdout: string
  stderr: string
  exitCode: number
  executionTime: number // ms
  statusDescription: string
}

/**
 * Execute code via Judge0 (submit + poll pattern).
 * Returns structured execution result.
 */
export async function executeCode(
  code: string,
  language: string,
  stdin?: string
): Promise<CodeExecutionResult> {
  const start = Date.now()

  const languageId = resolveLanguageId(language)

  logger.info('Submitting code to Judge0', { language, languageId, codeLen: code.length })
  const token = await submitCode(code, languageId, stdin)
  const result = await pollResult(token)

  const durationMs = Date.now() - start
  logger.timing('Judge0 execution completed', durationMs, {
    statusId: result.status.id,
    statusDesc: result.status.description,
    exitCode: result.exit_code,
  })

  // Status id 6 = compilation error
  const stderr =
    result.stderr ||
    result.compile_output ||
    result.message ||
    ''

  return {
    stdout: result.stdout || '',
    stderr,
    exitCode: result.exit_code ?? (result.status.id === 3 ? 0 : 1),
    executionTime: Math.round(parseFloat(result.time || '0') * 1000),
    statusDescription: result.status.description,
  }
}

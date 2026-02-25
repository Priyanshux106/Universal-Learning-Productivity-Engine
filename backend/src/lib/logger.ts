import { LogEntry } from '../types'

const PII_FIELDS = ['email', 'displayName', 'password', 'token']

function maskPII(obj: Record<string, unknown>): Record<string, unknown> {
  const masked: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (PII_FIELDS.includes(key)) {
      masked[key] = '[REDACTED]'
    } else if (value && typeof value === 'object' && !Array.isArray(value)) {
      masked[key] = maskPII(value as Record<string, unknown>)
    } else {
      masked[key] = value
    }
  }
  return masked
}

class Logger {
  private requestId: string
  private userId: string
  private functionName: string

  constructor(requestId = 'local', userId = 'system', functionName = 'unknown') {
    this.requestId = requestId
    this.userId = userId
    this.functionName = functionName
  }

  setContext(requestId: string, userId: string, functionName: string) {
    this.requestId = requestId
    this.userId = userId
    this.functionName = functionName
  }

  private log(
    level: LogEntry['level'],
    message: string,
    metadata?: Record<string, unknown>,
    duration?: number
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      requestId: this.requestId,
      userId: this.userId,
      function: this.functionName,
      level,
      message,
      duration,
      metadata: metadata ? maskPII(metadata) : undefined,
    }
    // CloudWatch picks up stdout from Lambda
    console.log(JSON.stringify(entry))
  }

  info(message: string, metadata?: Record<string, unknown>) {
    this.log('INFO', message, metadata)
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    this.log('WARN', message, metadata)
  }

  error(message: string, metadata?: Record<string, unknown>) {
    this.log('ERROR', message, metadata)
  }

  timing(message: string, durationMs: number, metadata?: Record<string, unknown>) {
    this.log('INFO', message, metadata, durationMs)
  }
}

// Singleton logger — set context in each Lambda handler
export const logger = new Logger()
export { Logger }

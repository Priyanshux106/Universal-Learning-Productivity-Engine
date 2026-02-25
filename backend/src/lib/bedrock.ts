import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { ErrorCode } from '../types'
import { logger } from './logger'

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0'
const REGION = process.env.BEDROCK_REGION || 'us-east-1'

const bedrockClient = new BedrockRuntimeClient({ region: REGION })

const MAX_RETRIES = 3
const RETRY_DELAYS_MS = [1000, 2000, 4000]

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Invoke AWS Bedrock Claude 3 Sonnet with structured output.
 * Retries up to 3× with exponential backoff on service errors.
 */
export async function invokeBedrockModel(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 4096
): Promise<string> {
  let lastError: Error | undefined

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const start = Date.now()
    try {
      const command = new InvokeModelCommand({
        modelId: MODEL_ID,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }],
        }),
      })

      const response = await bedrockClient.send(command)
      const responseBody = JSON.parse(new TextDecoder().decode(response.body))
      const text: string = responseBody.content[0].text

      const durationMs = Date.now() - start
      logger.timing('Bedrock invocation succeeded', durationMs, {
        attempt,
        modelId: MODEL_ID,
        inputLen: userPrompt.length,
        outputLen: text.length,
      })

      return text
    } catch (err) {
      lastError = err as Error
      const durationMs = Date.now() - start
      logger.warn('Bedrock invocation failed', {
        attempt,
        error: lastError.message,
        durationMs,
      })

      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAYS_MS[attempt])
      }
    }
  }

  logger.error('Bedrock exhausted retries', { error: lastError?.message })
  const serviceError = new Error('AI_SERVICE_UNAVAILABLE')
  ;(serviceError as Error & { code: string }).code = ErrorCode.AI_SERVICE_UNAVAILABLE
  throw serviceError
}

/**
 * Parse JSON output from Bedrock, stripping markdown code fences if present.
 */
export function parseBedrockJSON<T>(raw: string): T {
  // Strip markdown code fence if Bedrock wraps JSON in ```json ... ```
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/, '')
    .trim()

  return JSON.parse(stripped) as T
}

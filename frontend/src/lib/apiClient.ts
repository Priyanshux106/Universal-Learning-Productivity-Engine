/**
 * Shared API client for all AWS API Gateway calls.
 * Automatically injects the JWT token from localStorage.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('studdybuddy_token')
}

export function setToken(token: string): void {
  localStorage.setItem('studdybuddy_token', token)
}

export function clearToken(): void {
  localStorage.removeItem('studdybuddy_token')
  localStorage.removeItem('studdybuddy_user')
}

async function request<T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  body?: unknown,
  requireAuth = true
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (requireAuth) {
    const token = getToken()
    if (!token) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Not authenticated. Please sign in.')
    }
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json().catch(() => ({ success: false, error: { code: 'PARSE_ERROR', message: 'Invalid response' } }))

  if (!res.ok || !json.success) {
    const err = json.error || {}
    throw new ApiError(res.status, err.code || 'UNKNOWN_ERROR', err.message || 'An error occurred')
  }

  return json.data as T
}

export const apiClient = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
}

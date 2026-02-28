/**
 * Auth utilities for JWT token management.
 * StuddyBuddy AI expects Amazon Cognito (or any OIDC provider) JWTs.
 */
import { setToken, clearToken } from './apiClient'

export interface AuthUser {
  sub: string
  email: string
  name?: string
}

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export function saveSession(token: string): AuthUser | null {
  const payload = parseJwtPayload(token)
  if (!payload) return null

  const user: AuthUser = {
    sub: payload.sub as string,
    email: payload.email as string,
    name: payload.name as string | undefined,
  }

  setToken(token)
  if (typeof window !== 'undefined') {
    localStorage.setItem('studdybuddy_user', JSON.stringify(user))
  }
  return user
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('studdybuddy_user')
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function signOut(): void {
  clearToken()
}

export function isTokenExpired(token: string): boolean {
  const payload = parseJwtPayload(token)
  if (!payload || typeof payload.exp !== 'number') return true
  return Date.now() / 1000 > payload.exp
}

/**
 * Google OAuth 2.0 Client Service
 */

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

function generateState(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function getGoogleOAuthUrl(): string {
  const clientId = CLIENT_ID || 'mock-google-client-id.apps.googleusercontent.com'
  const state = generateState()
  sessionStorage.setItem('oauth_state_google', state)

  const redirectUri = `${window.location.origin}/login?provider=google`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'select_account',
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export function initiateGoogleLogin(): void {
  if (CLIENT_ID) {
    window.location.href = getGoogleOAuthUrl()
  } else {
    // Development OAuth redirect simulation
    const mockCode = `mock_google_code_${Date.now()}`
    const redirectUri = `${window.location.origin}/login?provider=google&code=${mockCode}`
    window.location.href = redirectUri
  }
}

export const isGoogleConfigured = (): boolean => true

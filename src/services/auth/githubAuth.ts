/**
 * GitHub OAuth 2.0 Client Service
 */

const CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID as string | undefined
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

function generateState(): string {
  const arr = new Uint8Array(16)
  crypto.getRandomValues(arr)
  return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('')
}

export function getGithubOAuthUrl(): string {
  const clientId = CLIENT_ID || 'mock-github-client-id'
  const state = generateState()
  sessionStorage.setItem('oauth_state_github', state)

  const redirectUri = `${window.location.origin}/login?provider=github`

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user user:email',
    state,
  })

  return `https://github.com/login/oauth/authorize?${params.toString()}`
}

export function initiateGithubLogin(): void {
  if (CLIENT_ID) {
    window.location.href = getGithubOAuthUrl()
  } else {
    // Development OAuth redirect simulation
    const mockCode = `mock_github_code_${Date.now()}`
    const redirectUri = `${window.location.origin}/login?provider=github&code=${mockCode}`
    window.location.href = redirectUri
  }
}

export const isGithubConfigured = (): boolean => true

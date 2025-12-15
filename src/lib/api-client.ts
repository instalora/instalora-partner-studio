const ACCESS_TOKEN_KEY = "access_token"
const TOKEN_EXPIRES_AT_KEY = "token_expires_at"

export const clearAuthTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY)
}

export const fetchWithAuth = async (
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> => {
  const headers = new Headers(init?.headers ?? {})
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)

  if (token) {
    headers.set("Authorization", `Bearer ${token}`)
  }

  const response = await fetch(input, { ...init, headers })

  if (response.status === 401) {
    clearAuthTokens()
    window.location.href = "/login"
  }

  return response
}

'use client'

const baseURL = process.env.NEXT_PUBLIC_BASE_URL || ''

function isFormData(body: any) {
  return typeof FormData !== 'undefined' && body instanceof FormData
}

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { headers = {}, body } = options

  // Only set JSON content-type if:
  //  - a body exists
  //  - it's not FormData (let the browser set multipart boundaries)
  const computedHeaders: HeadersInit = {
    ...(body && !isFormData(body) ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  }

  const res = await fetch(`${baseURL}${url}`, {
    credentials: 'include', // send cookies (session) by default
    headers: computedHeaders,
    ...options,
  })

  // Do NOT parse or throw here — let the caller decide.
  return res
}

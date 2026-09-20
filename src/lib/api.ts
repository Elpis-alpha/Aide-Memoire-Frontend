import type { paths } from './api-types'

/**
 * The one API client.
 *
 * S2-22 — there were eight near-identical fetch wrappers, none of which
 * checked `response.ok`, handled a 204, or timed out. This is the only place
 * the app talks to the API, so those behaviours exist once.
 *
 * Requests go to `/api/*` on this origin and Next rewrites them through to the
 * backend (Phase 0.4's same-origin strategy). That is what keeps the auth
 * cookie host-only and keeps CORS out of the picture entirely.
 */

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: Array<{ path: string; message: string }>

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Array<{ path: string; message: string }>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  /** True when signing in again would plausibly fix it. */
  get isAuthError() {
    return this.status === 401
  }

  get isNotFound() {
    return this.status === 404
  }

  /** Field-level messages keyed by form field, for react-hook-form. */
  get fieldErrors(): Record<string, string> {
    const out: Record<string, string> = {}
    for (const detail of this.details ?? []) {
      if (detail.path && !out[detail.path]) out[detail.path] = detail.message
    }
    return out
  }
}

const DEFAULT_TIMEOUT_MS = 15_000

export type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  /** Merged with the internal timeout signal. */
  signal?: AbortSignal
  timeoutMs?: number
  /** Forwarded from a Server Component so the request is authenticated. */
  headers?: Record<string, string>
  /** Next.js fetch cache hints, used by the public Server Components. */
  next?: { revalidate?: number | false; tags?: string[] }
  cache?: RequestCache
}

/**
 * On the client this is empty, so requests are same-origin and the browser
 * attaches the cookie itself. On the server there is no origin to be relative
 * to, so Server Components must reach the API directly.
 */
const baseUrl = (): string => {
  if (typeof window !== 'undefined') return ''
  return process.env.API_ORIGIN ?? 'http://localhost:5000'
}

export const apiFetch = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const { method = 'GET', body, signal, timeoutMs = DEFAULT_TIMEOUT_MS, headers, next, cache } = options

  // A request that never settles is worse than one that fails.
  const timeout = AbortSignal.timeout(timeoutMs)
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout

  let response: Response
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      method,
      credentials: 'include',
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: combined,
      ...(next ? { next } : {}),
      ...(cache ? { cache } : {}),
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'TimeoutError') {
      throw new ApiError(408, 'timeout', 'That took too long. Check your connection and try again.')
    }
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new ApiError(0, 'network_error', 'Could not reach the server.')
  }

  // 204 has no body; parsing it would throw.
  if (response.status === 204) return undefined as T

  const contentType = response.headers.get('content-type') ?? ''
  const isJson = contentType.includes('application/json')
  const payload: unknown = isJson ? await response.json().catch(() => null) : await response.text()

  if (!response.ok) {
    const shape = (payload ?? {}) as {
      error?: string
      code?: string
      details?: Array<{ path: string; message: string }>
    }
    throw new ApiError(
      response.status,
      shape.code ?? 'error',
      shape.error ?? 'Something went wrong.',
      shape.details,
    )
  }

  return payload as T
}

/* ---- Types pulled from the generated contract -------------------------- */

type Json<T> = T extends { content: { 'application/json': infer C } } ? C : never

export type User = Json<paths['/api/users/me']['get']['responses'][200]>
export type PublicProfile = Json<paths['/api/users/{id}']['get']['responses'][200]>
export type Note = Json<paths['/api/notes/{id}']['get']['responses'][200]>
export type NotePage = Json<paths['/api/notes']['get']['responses'][200]>
export type Section = Json<paths['/api/sections/{id}']['get']['responses'][200]>
export type Tag = Json<paths['/api/tags/{id}']['get']['responses'][200]>
export type Tree = Json<paths['/api/tree']['get']['responses'][200]>

export type NoteSummary = NotePage['items'][number]

/* ---- Endpoints ---------------------------------------------------------- */

const qs = (params: Record<string, string | number | undefined>) => {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') search.set(key, String(value))
  }
  const out = search.toString()
  return out ? `?${out}` : ''
}

export const api = {
  auth: {
    register: (body: { name: string; email: string; password: string }) =>
      apiFetch<{ user: User }>('/api/auth/register', { method: 'POST', body }),

    login: (body: { email: string; password: string }) =>
      apiFetch<{ user: User }>('/api/auth/login', { method: 'POST', body }),

    logout: () => apiFetch<{ message: string }>('/api/auth/logout', { method: 'POST' }),

    logoutAll: () => apiFetch<{ message: string }>('/api/auth/logout-all', { method: 'POST' }),

    refresh: () => apiFetch<{ user: User }>('/api/auth/refresh', { method: 'POST' }),

    requestVerification: () =>
      apiFetch<{ message: string }>('/api/auth/verify/request', { method: 'POST' }),

    changePassword: (body: { oldPassword: string; newPassword: string }) =>
      apiFetch<{ message: string }>('/api/auth/password', { method: 'POST', body }),
  },

  users: {
    me: (options?: RequestOptions) => apiFetch<User>('/api/users/me', options),
    update: (body: Partial<Pick<User, 'name' | 'biography' | 'noteName'>>) =>
      apiFetch<User>('/api/users/me', { method: 'PATCH', body }),
    remove: () => apiFetch<{ message: string }>('/api/users/me', { method: 'DELETE' }),
    publicProfile: (id: string, options?: RequestOptions) =>
      apiFetch<PublicProfile>(`/api/users/${id}`, options),
  },

  notes: {
    list: (params: { limit?: number; cursor?: string } = {}) =>
      apiFetch<NotePage>(`/api/notes${qs(params)}`),

    free: (params: { limit?: number; cursor?: string } = {}) =>
      apiFetch<NotePage>(`/api/notes/free${qs(params)}`),

    search: (params: { q: string; limit?: number; cursor?: string }) =>
      apiFetch<NotePage>(`/api/notes/search${qs(params)}`),

    byTag: (tagId: string, params: { limit?: number; cursor?: string } = {}) =>
      apiFetch<NotePage>(`/api/notes/by-tag/${tagId}${qs(params)}`),

    get: (id: string, options?: RequestOptions) => apiFetch<Note>(`/api/notes/${id}`, options),

    bySpecialName: (name: string) => apiFetch<Note>(`/api/notes/special/${name}`),

    create: (body: { name: string; description?: string; text?: string; sections?: string[]; tags?: string[] }) =>
      apiFetch<Note>('/api/notes', { method: 'POST', body }),

    update: (id: string, body: { name?: string; description?: string; text?: string }) =>
      apiFetch<Note>(`/api/notes/${id}`, { method: 'PATCH', body }),

    remove: (id: string) => apiFetch<{ message: string }>(`/api/notes/${id}`, { method: 'DELETE' }),

    toggleVisibility: (id: string) =>
      apiFetch<{ isPublic: boolean }>(`/api/notes/${id}/toggle-public`, { method: 'POST' }),

    addSection: (id: string, sectionId: string) =>
      apiFetch<Note['sections']>(`/api/notes/${id}/sections`, { method: 'POST', body: { id: sectionId } }),

    removeSection: (id: string, sectionId: string) =>
      apiFetch<Note['sections']>(`/api/notes/${id}/sections/${sectionId}`, { method: 'DELETE' }),

    addTag: (id: string, tagId: string) =>
      apiFetch<Note['tags']>(`/api/notes/${id}/tags`, { method: 'POST', body: { id: tagId } }),

    removeTag: (id: string, tagId: string) =>
      apiFetch<Note['tags']>(`/api/notes/${id}/tags/${tagId}`, { method: 'DELETE' }),
  },

  sections: {
    list: () => apiFetch<Section[]>('/api/sections'),
    get: (id: string) => apiFetch<Section>(`/api/sections/${id}`),
    notes: (id: string, params: { limit?: number; cursor?: string } = {}) =>
      apiFetch<NotePage>(`/api/sections/${id}/notes${qs(params)}`),
    create: (body: { name: string; description?: string }) =>
      apiFetch<Section>('/api/sections', { method: 'POST', body }),
    update: (id: string, body: { name?: string; description?: string; isPublic?: boolean }) =>
      apiFetch<Section>(`/api/sections/${id}`, { method: 'PATCH', body }),
    toggleOpen: (id: string) =>
      apiFetch<{ open: boolean }>(`/api/sections/${id}/toggle-open`, { method: 'POST' }),
    toggleVisibility: (id: string) =>
      apiFetch<{ isPublic: boolean }>(`/api/sections/${id}/toggle-public`, { method: 'POST' }),
    remove: (id: string) => apiFetch<{ message: string }>(`/api/sections/${id}`, { method: 'DELETE' }),
  },

  tags: {
    get: (id: string) => apiFetch<Tag>(`/api/tags/${id}`),
    search: (prefix: string, limit = 10) => apiFetch<Tag[]>(`/api/tags/search${qs({ prefix, limit })}`),
    create: (name: string) => apiFetch<Tag>('/api/tags', { method: 'POST', body: { name } }),
  },

  tree: () => apiFetch<Tree>('/api/tree'),

  media: {
    sign: (kind: 'avatar' | 'note-image') =>
      apiFetch<{
        timestamp: number
        signature: string
        apiKey: string
        cloudName: string
        folder: string
        uploadUrl: string
      }>('/api/media/sign', { method: 'POST', body: { kind } }),

    setAvatar: (body: { publicId: string; url: string }) =>
      apiFetch<{ avatarUrl: string | null }>('/api/media/avatar', { method: 'POST', body }),

    removeAvatar: () => apiFetch<{ message: string }>('/api/media/avatar', { method: 'DELETE' }),
  },

  contact: (body: { title: string; content: string }) =>
    apiFetch<{ message: string }>('/api/mail/send', { method: 'POST', body }),

  /** Unauthenticated reads. Cached at the edge — these are the SEO surface. */
  publicReads: {
    note: (id: string, options?: RequestOptions) =>
      apiFetch<Note>(`/api/public/notes/${id}`, { next: { revalidate: 300 }, ...options }),

    section: (id: string, options?: RequestOptions) =>
      apiFetch<Section>(`/api/public/sections/${id}`, { next: { revalidate: 300 }, ...options }),

    sectionNotes: (id: string, params: { limit?: number; cursor?: string } = {}, options?: RequestOptions) =>
      apiFetch<NotePage>(`/api/public/sections/${id}/notes${qs(params)}`, {
        next: { revalidate: 300 },
        ...options,
      }),

    sectionNote: (sectionId: string, noteId: string, options?: RequestOptions) =>
      apiFetch<{ section: Section; note: Note }>(
        `/api/public/sections/${sectionId}/notes/${noteId}`,
        { next: { revalidate: 300 }, ...options },
      ),

    search: (params: { q: string; limit?: number; cursor?: string }, options?: RequestOptions) =>
      apiFetch<NotePage>(`/api/public/notes/search${qs(params)}`, options),

    byTag: (tagId: string, params: { limit?: number; cursor?: string } = {}, options?: RequestOptions) =>
      apiFetch<NotePage>(`/api/public/notes/by-tag/${tagId}${qs(params)}`, options),
  },
}

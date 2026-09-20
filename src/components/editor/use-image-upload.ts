'use client'

import { useCallback, useRef, useState } from 'react'
import { api } from '@/lib/api'

/**
 * Note images go straight from the browser to Cloudinary using a signature the
 * API issues. Only the resulting URL is stored.
 *
 * The old editor called `canvas.toDataURL()` and inlined the base64 into the
 * note HTML, which bloated every note document, made them uncacheable, and
 * counted against Mongo's 16MB document limit.
 */

const MAX_BYTES = 10 * 1024 * 1024
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

export type UploadState = {
  uploading: boolean
  error: string | null
}

export const useImageUpload = () => {
  const [state, setState] = useState<UploadState>({ uploading: false, error: null })
  const inputRef = useRef<HTMLInputElement | null>(null)

  /** Opens the file picker, uploads, and resolves with a URL or null. */
  const pickImage = useCallback(async (): Promise<string | null> => {
    const file = await new Promise<File | null>(resolve => {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = ACCEPTED.join(',')
      input.onchange = () => resolve(input.files?.[0] ?? null)
      // Covers the case where the dialog is dismissed without choosing.
      input.oncancel = () => resolve(null)
      inputRef.current = input
      input.click()
    })

    if (!file) return null

    if (!ACCEPTED.includes(file.type)) {
      setState({ uploading: false, error: 'That file type is not supported. Use JPEG, PNG, WebP, GIF or AVIF.' })
      return null
    }

    if (file.size > MAX_BYTES) {
      setState({ uploading: false, error: 'That image is larger than 10MB. Choose a smaller one.' })
      return null
    }

    setState({ uploading: true, error: null })

    try {
      const signature = await api.media.sign('note-image')

      const form = new FormData()
      form.append('file', file)
      form.append('api_key', signature.apiKey)
      form.append('timestamp', String(signature.timestamp))
      form.append('signature', signature.signature)
      form.append('folder', signature.folder)

      const response = await fetch(signature.uploadUrl, { method: 'POST', body: form })
      if (!response.ok) throw new Error('upload failed')

      const result = (await response.json()) as { secure_url?: string }
      if (!result.secure_url) throw new Error('no url returned')

      setState({ uploading: false, error: null })
      return result.secure_url
    } catch {
      setState({ uploading: false, error: 'That image could not be uploaded. Try again.' })
      return null
    }
  }, [])

  const clearError = useCallback(() => setState(s => ({ ...s, error: null })), [])

  return { pickImage, clearError, ...state }
}

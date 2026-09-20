'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * S3-35 — saving a note used to be a four-step modal wizard (Save → name and
 * description → sections → tags → Save Note), with no autosave, no draft
 * persistence and no shortcut. Navigating away mid-compose lost the work.
 *
 * Here the note is created immediately with a default title and everything
 * after that is autosaved: sections and tags become post-hoc edits on a note
 * that already exists, rather than gates in front of writing one.
 *
 * What this has to get right:
 *   - never save what is already saved (the editor fires on every keystroke)
 *   - never run two saves at once, and never lose the edit made *during* a save
 *   - flush on unmount, so a client-side navigation does not drop the last edit
 *   - warn on a real page unload while something is genuinely unsaved
 *   - honour ⌘S / Ctrl+S, because people will press it regardless
 *
 * Note what is state and what is a ref. Anything the UI renders — whether a
 * save is running, what the server last accepted — is state, so the status and
 * the unload guard cannot go stale. The refs exist only so the save routine
 * can read the newest draft synchronously from a timer, and are never read
 * during render.
 */

export type SaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'error'

export type AutosaveOptions<T> = {
  /**
   * The current draft. Compared structurally, so a new object each render is
   * fine. Mount the component only once the real value is available — the
   * first render establishes the baseline for "unchanged".
   */
  value: T
  /** Persists the draft. Rejections surface as the `error` status. */
  save: (value: T) => Promise<unknown>
  /** Quiet period after the last edit. */
  delay?: number
}

export type Autosave = {
  status: SaveStatus
  /** Set when the last attempt failed, so the UI can offer a retry. */
  error: Error | null
  /** Forces a save now, bypassing the debounce. */
  saveNow: () => Promise<void>
  /** True when the draft differs from what the server last accepted. */
  isDirty: boolean
}

export function useAutosave<T>({ value, save, delay = 1200 }: AutosaveOptions<T>): Autosave {
  const serialised = JSON.stringify(value)

  /**
   * What the server has accepted. Seeded from the first render, which is the
   * note as it was loaded — so opening a note is not itself an edit.
   */
  const [saved, setSaved] = useState(() => serialised)
  const [isSaving, setIsSaving] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const isDirty = serialised !== saved

  // Latest-value refs, written after render rather than during it. `flush`
  // runs from a timer and from event handlers, long after the render that
  // scheduled it, so it must not close over a stale draft.
  const valueRef = useRef(value)
  const serialisedRef = useRef(serialised)
  const savedRef = useRef(saved)
  const saveRef = useRef(save)
  const dirtyRef = useRef(isDirty)

  useEffect(() => {
    valueRef.current = value
    serialisedRef.current = serialised
    savedRef.current = saved
    saveRef.current = save
    dirtyRef.current = isDirty
  })

  /** Guards against two saves overlapping. */
  const savingRef = useRef(false)
  /** An edit arrived while a save was in flight. */
  const queuedRef = useRef(false)

  const flush = useCallback(async (): Promise<void> => {
    if (savingRef.current) {
      queuedRef.current = true
      return
    }

    if (serialisedRef.current === savedRef.current) return

    savingRef.current = true
    setIsSaving(true)

    try {
      // A loop rather than recursion: an edit made *during* a save sets
      // `queued`, and this comes back round to write it instead of leaving the
      // newest text unsaved behind a "Saved" label.
      do {
        queuedRef.current = false

        const attempted = serialisedRef.current
        if (attempted === savedRef.current) break

        await saveRef.current(valueRef.current)

        savedRef.current = attempted
        setSaved(attempted)
        setHasSaved(true)
        setError(null)
      } while (queuedRef.current)
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error('Could not save'))
    } finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }, [])

  // Debounce. Re-runs on every edit, so the timer always measures from the
  // most recent keystroke rather than the first one.
  useEffect(() => {
    if (!isDirty) return

    const timer = setTimeout(() => void flush(), delay)
    return () => clearTimeout(timer)
  }, [isDirty, serialised, delay, flush])

  // A client-side navigation unmounts this without any unload event, so the
  // final debounced edit would otherwise never be written.
  useEffect(() => {
    return () => {
      if (dirtyRef.current) void flush()
    }
  }, [flush])

  // Registered only while something is actually unsaved. A permanently
  // installed handler makes every reload prompt, which trains people to
  // dismiss the one prompt that mattered.
  useEffect(() => {
    if (!isDirty) return

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      // Browsers ignore custom text now, but the assignment is still what
      // triggers the prompt in some of them.
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        // Otherwise the browser offers to save the page as a file.
        event.preventDefault()
        void flush()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [flush])

  const status: SaveStatus = isSaving
    ? 'saving'
    : error
      ? 'error'
      : isDirty
        ? 'dirty'
        : hasSaved
          ? 'saved'
          : 'idle'

  return { status, error, saveNow: flush, isDirty }
}

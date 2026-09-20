'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useNoteSearch } from '@/hooks/use-api'
import { NoteList } from '@/components/notes/note-list'
import { QueryError, QuerySkeleton } from '@/components/query-state'

/**
 * Search over your own notes.
 *
 * S1-09 — the API backs this with a weighted text index now. The old
 * implementation interpolated the query straight into a regular expression,
 * so a `(` was a 500 and `.*` was a table scan.
 *
 * That index covers the title and description, not the body. Note bodies are
 * stored as sanitised HTML, so indexing them would tokenise the markup along
 * with the prose and make a search for "p" match everything. The wording here
 * says so rather than promising a search this cannot perform — verified
 * against the running API, where a word present only in a note's body
 * correctly returns nothing.
 *
 * The URL is the source of truth for the query, so a result page can be
 * shared, bookmarked and reached with Back. The box is debounced into it
 * rather than pushing a history entry per keystroke.
 */
export function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('q') ?? ''

  const [input, setInput] = useState(query)
  const [lastQuery, setLastQuery] = useState(query)

  /*
   * The URL can change without this box: the header search, a shared link, or
   * the Back button. Adjusting during render — rather than in an effect that
   * fires after a wasted commit — is React's own answer to "reset state when a
   * prop changes". The `key` trick is not usable here: it would remount the
   * input on every debounced URL update and take the focus with it.
   */
  if (query !== lastQuery) {
    setLastQuery(query)
    setInput(query)
  }

  useEffect(() => {
    const trimmed = input.trim()
    if (trimmed === query) return

    const timer = setTimeout(() => {
      // Replace, not push: typing should not bury the previous page under a
      // history entry per word.
      router.replace(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
    }, 350)

    return () => clearTimeout(timer)
  }, [input, query, router])

  const results = useNoteSearch(query)

  return (
    <div className="space-y-6">
      <header className="space-y-4 border-b border-rule pb-5">
        <div>
          <h1 className="font-serif text-display font-semibold tracking-tight text-ink">Search</h1>
          <p className="mt-1 text-small text-ink-muted">
            Across the titles and descriptions of your notes.
          </p>
        </div>

        <form role="search" onSubmit={event => event.preventDefault()}>
          <label htmlFor="search-notes" className="sr-only">
            Search your notes by title and description
          </label>
          <input
            id="search-notes"
            type="search"
            value={input}
            autoFocus
            onChange={event => setInput(event.target.value)}
            placeholder="Search titles and descriptions"
            className="w-full rounded-md border border-rule bg-surface px-3 py-2 text-read text-ink placeholder:text-ink-faint hover:border-rule-strong"
          />
        </form>
      </header>

      {query.trim().length <= 1 && (
        <p className="py-8 text-center text-ink-faint">
          Type at least two characters to search.
        </p>
      )}

      {results.isPending && query.trim().length > 1 && (
        <QuerySkeleton label={`Searching for ${query}`} rows={3} />
      )}

      {results.isError && (
        <QueryError
          title="That search could not be run"
          message={results.error.message}
          onRetry={() => void results.refetch()}
        />
      )}

      {results.data && (
        <>
          <p aria-live="polite" className="text-small text-ink-muted">
            {results.data.items.length === 0
              ? `Nothing matches “${query}”.`
              : `${results.data.items.length === 1 ? '1 note' : `${results.data.items.length} notes`} matching “${query}”.`}
          </p>

          <NoteList
            notes={results.data.items}
            emptyMessage="Nothing here. Titles and descriptions are searched, not note bodies."
          />
        </>
      )}
    </div>
  )
}

'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, type Note, type Section, type Tree } from '@/lib/api'

/**
 * One place where cache keys are defined, so an invalidation cannot miss a
 * consumer. The old `refreshTree()` callback threaded through the component
 * tree is replaced by invalidating `keys.tree()`.
 */
export const keys = {
  me: () => ['me'] as const,
  tree: () => ['tree'] as const,
  notes: () => ['notes'] as const,
  note: (id: string) => ['notes', id] as const,
  noteSearch: (q: string) => ['notes', 'search', q] as const,
  freeNotes: () => ['notes', 'free'] as const,
  notesByTag: (tagId: string) => ['notes', 'tag', tagId] as const,
  sections: () => ['sections'] as const,
  section: (id: string) => ['sections', id] as const,
  sectionNotes: (id: string) => ['sections', id, 'notes'] as const,
  tagSearch: (prefix: string) => ['tags', 'search', prefix] as const,
  tag: (id: string) => ['tags', id] as const,
}

/* ---- Reads -------------------------------------------------------------- */

export const useMe = () => useQuery({ queryKey: keys.me(), queryFn: () => api.users.me() })

/** S2-23 — the whole sidebar in one request instead of one per section. */
export const useTree = () => useQuery({ queryKey: keys.tree(), queryFn: () => api.tree() })

export const useNote = (id: string | undefined) =>
  useQuery({
    queryKey: keys.note(id ?? ''),
    queryFn: () => api.notes.get(id as string),
    enabled: Boolean(id),
  })

export const useSections = () =>
  useQuery({ queryKey: keys.sections(), queryFn: () => api.sections.list() })

export const useSection = (id: string | undefined) =>
  useQuery({
    queryKey: keys.section(id ?? ''),
    queryFn: () => api.sections.get(id as string),
    enabled: Boolean(id),
  })

export const useSectionNotes = (id: string | undefined) =>
  useQuery({
    queryKey: keys.sectionNotes(id ?? ''),
    queryFn: () => api.sections.notes(id as string),
    enabled: Boolean(id),
  })

export const useNoteSearch = (q: string) =>
  useQuery({
    queryKey: keys.noteSearch(q),
    queryFn: () => api.notes.search({ q }),
    // Avoids a request per keystroke on an empty or one-character box.
    enabled: q.trim().length > 1,
  })

export const useTagSearch = (prefix: string) =>
  useQuery({
    queryKey: keys.tagSearch(prefix),
    queryFn: () => api.tags.search(prefix),
    enabled: prefix.trim().length > 0,
    staleTime: 5 * 60_000,
  })

export const useFreeNotes = () =>
  useQuery({ queryKey: keys.freeNotes(), queryFn: () => api.notes.free() })

export const useNotesByTag = (tagId: string | undefined) =>
  useQuery({
    queryKey: keys.notesByTag(tagId ?? ''),
    queryFn: () => api.notes.byTag(tagId as string),
    enabled: Boolean(tagId),
  })

export const useTag = (id: string | undefined) =>
  useQuery({
    queryKey: keys.tag(id ?? ''),
    queryFn: () => api.tags.get(id as string),
    enabled: Boolean(id),
    // A tag is a name and an id. It does not change while you read a page.
    staleTime: 5 * 60_000,
  })

/* ---- Writes ------------------------------------------------------------- */

export const useCreateNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.notes.create,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.tree() })
      void qc.invalidateQueries({ queryKey: keys.notes() })
    },
  })
}

/**
 * Used by autosave (S3-35), so it runs often. The note is written into the
 * cache directly rather than refetched, and the tree is invalidated because a
 * rename changes what the sidebar shows.
 */
export const useUpdateNote = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name?: string; description?: string; text?: string }) =>
      api.notes.update(id, body),
    onSuccess: note => {
      qc.setQueryData(keys.note(id), note)
      void qc.invalidateQueries({ queryKey: keys.tree() })
    },
  })
}

export const useDeleteNote = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.notes.remove,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.tree() })
      void qc.invalidateQueries({ queryKey: keys.notes() })
    },
  })
}

/** Optimistic: the switch flips immediately and rolls back if the call fails. */
export const useToggleNoteVisibility = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.notes.toggleVisibility(id),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: keys.note(id) })
      const previous = qc.getQueryData<Note>(keys.note(id))
      if (previous) qc.setQueryData(keys.note(id), { ...previous, isPublic: !previous.isPublic })
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) qc.setQueryData(keys.note(id), context.previous)
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: keys.note(id) })
      void qc.invalidateQueries({ queryKey: keys.tree() })
    },
  })
}

export const useCreateSection = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.sections.create,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.sections() })
      void qc.invalidateQueries({ queryKey: keys.tree() })
    },
  })
}

export const useUpdateSection = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body: { name?: string; description?: string; isPublic?: boolean }) =>
      api.sections.update(id, body),
    onSuccess: (section: Section) => {
      qc.setQueryData(keys.section(id), section)
      void qc.invalidateQueries({ queryKey: keys.sections() })
      void qc.invalidateQueries({ queryKey: keys.tree() })
    },
  })
}

export const useDeleteSection = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.sections.remove,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.sections() })
      void qc.invalidateQueries({ queryKey: keys.tree() })
      // Deleting a section pulls its reference out of the notes it held.
      void qc.invalidateQueries({ queryKey: keys.notes() })
    },
  })
}

export const useNoteRelations = (noteId: string) => {
  const qc = useQueryClient()
  const settle = () => {
    void qc.invalidateQueries({ queryKey: keys.note(noteId) })
    void qc.invalidateQueries({ queryKey: keys.tree() })
  }

  return {
    addTag: useMutation({ mutationFn: (tagId: string) => api.notes.addTag(noteId, tagId), onSuccess: settle }),
    removeTag: useMutation({ mutationFn: (tagId: string) => api.notes.removeTag(noteId, tagId), onSuccess: settle }),
    addSection: useMutation({ mutationFn: (id: string) => api.notes.addSection(noteId, id), onSuccess: settle }),
    removeSection: useMutation({ mutationFn: (id: string) => api.notes.removeSection(noteId, id), onSuccess: settle }),
  }
}

/**
 * S3-40 — open/closed lived in Mongo *and* in a parallel localStorage copy
 * that the two could not keep in agreement across devices. The server record
 * is the only one now; this flips it optimistically so the disclosure still
 * feels instant.
 */
export const useToggleSectionOpen = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.sections.toggleOpen(id),
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: keys.tree() })
      const previous = qc.getQueryData<Tree>(keys.tree())
      if (previous) {
        qc.setQueryData<Tree>(keys.tree(), {
          ...previous,
          sections: previous.sections.map(section =>
            section._id === id ? { ...section, open: !section.open } : section,
          ),
        })
      }
      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) qc.setQueryData(keys.tree(), context.previous)
    },
    onSettled: () => void qc.invalidateQueries({ queryKey: keys.tree() }),
  })
}

export const useToggleSectionVisibility = (id: string) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.sections.toggleVisibility(id),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: keys.section(id) })
      const previous = qc.getQueryData<Section>(keys.section(id))
      if (previous) qc.setQueryData(keys.section(id), { ...previous, isPublic: !previous.isPublic })
      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) qc.setQueryData(keys.section(id), context.previous)
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: keys.section(id) })
      void qc.invalidateQueries({ queryKey: keys.sections() })
    },
  })
}

export const useCreateTag = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => api.tags.create(name),
    // The prefix search should offer a tag the moment it exists.
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['tags', 'search'] }),
  })
}

/* ---- Account ------------------------------------------------------------ */

export const useUpdateMe = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.users.update,
    onSuccess: user => qc.setQueryData(keys.me(), user),
  })
}

export const useChangePassword = () => useMutation({ mutationFn: api.auth.changePassword })

export const useRequestVerification = () =>
  useMutation({ mutationFn: api.auth.requestVerification })

export const useConfirmVerification = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (token: string) => api.auth.confirmVerification(token),
    // `verified` is part of the user record the whole app reads.
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.me() }),
  })
}

export const useSetAvatar = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.media.setAvatar,
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.me() }),
  })
}

export const useRemoveAvatar = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.media.removeAvatar,
    onSuccess: () => void qc.invalidateQueries({ queryKey: keys.me() }),
  })
}

export const useDeleteAccount = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.users.remove,
    onSuccess: () => qc.clear(),
  })
}

/* ---- Session ------------------------------------------------------------ */

export const useLogin = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.auth.login,
    onSuccess: ({ user }) => qc.setQueryData(keys.me(), user),
  })
}

export const useRegister = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.auth.register,
    onSuccess: ({ user }) => qc.setQueryData(keys.me(), user),
  })
}

/** Signs out every device — the control that makes a leaked session fixable. */
export const useLogoutAll = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.auth.logoutAll,
    onSuccess: () => qc.clear(),
  })
}

export const useLogout = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.auth.logout,
    // Everything in the cache belonged to the session that just ended.
    onSuccess: () => qc.clear(),
  })
}

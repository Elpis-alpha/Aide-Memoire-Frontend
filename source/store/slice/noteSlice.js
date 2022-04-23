import { createSlice } from '@reduxjs/toolkit'


const noteSlice = createSlice({

  name: "note",

  initialState: {

    savedChanges: false,

    refreshTree: { _: "user" },

    activeNote: "Welcome"

  },

  reducers: {

    reloadTree: (state, { payload }) => {

      state.refreshTree = { _: payload }

    },

    setSavedChanges: (state, { payload }) => {

      state.savedChanges = payload

    },

    setActiveNote: (state, { payload }) => {

      state.activeNote = payload

    },

  }

})

export default noteSlice.reducer;

export const { setSavedChanges, reloadTree, setActiveNote } = noteSlice.actions

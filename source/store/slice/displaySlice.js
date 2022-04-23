import { createSlice } from '@reduxjs/toolkit'


const displaySlice = createSlice({

  name: "item",

  initialState: {

    showSearch: false,

    showNav: true,

    showTree: false,

    revealView: false,

    loadingTreeSide: true,

    divider: "20%"

  },

  reducers: {

    toggleShowSearch: (state) => {

      state.showSearch = !state.showSearch

    },

    setShowSearch: (state, { payload }) => {

      state.showSearch = payload

    },

    setShowNav: (state, { payload }) => {

      state.showNav = payload

    },

    setShowTree: (state, { payload }) => {

      state.showTree = payload

    },

    setRevealView: (state, { payload }) => {

      state.revealView = payload

    },

    setLoadingTreeSide: (state, { payload }) => {

      state.loadingTreeSide = payload

    },

    setDivider: (state, { payload }) => {

      state.divider = payload

    },

  }

})

export default displaySlice.reducer;

export const { setShowSearch, toggleShowSearch, setShowNav, setShowTree, setRevealView, setLoadingTreeSide, setDivider } = displaySlice.actions

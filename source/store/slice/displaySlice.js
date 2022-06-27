import { createSlice } from '@reduxjs/toolkit'

const isWindowContext = typeof window !== "undefined"

const displaySlice = createSlice({

  name: "item",

  initialState: {

    showSearch: false,

    showNav: true,

    showTree: false,

    revealView: false,

    loadingTreeSide: true,

    divider: "20%",

    prevDivider: "x",

    isVerify: false

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

    setIsVerify: (state, { payload }) => {

      state.isVerify = payload

    },

    setLoadingTreeSide: (state, { payload }) => {

      state.loadingTreeSide = payload

    },

    setDivider: (state, { payload }) => {

      if (isWindowContext) {

        const under700 = window.matchMedia('(max-width: 700px)').matches

        if (under700) {

          state.divider = "small"

        } else {

          state.divider = payload

        }

      } else {

        state.divider = payload

      }

      state.prevDivider = payload

    },

  }

})

export default displaySlice.reducer;

export const { setShowSearch, toggleShowSearch, setShowNav, setShowTree, setRevealView, setLoadingTreeSide, setDivider, setIsVerify } = displaySlice.actions

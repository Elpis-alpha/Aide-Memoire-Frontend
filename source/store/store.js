import { configureStore } from "@reduxjs/toolkit";

import userSlice from "./slice/userSlice";

import displaySlice from "./slice/displaySlice";

import messagesSlice from "./slice/messagesSlice";

import noteSlice from "./slice/noteSlice";


const store = configureStore({

  reducer: {

    user: userSlice,

    display: displaySlice,

    messages: messagesSlice,

    note: noteSlice,

  }

});


export default store;
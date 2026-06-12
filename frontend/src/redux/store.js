// =====================================================
// REDUX STORE
// Combines all "slices" (pieces of global state) into one store
// This covers "Redux Toolkit, global state management" from Efff Club project
// =====================================================

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import appointmentReducer from "./appointmentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer, // handles login state, user info, token
    appointments: appointmentReducer, // handles appointments list
  },
});

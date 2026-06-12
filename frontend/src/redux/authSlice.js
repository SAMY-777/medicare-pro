// =====================================================
// AUTH SLICE
// Manages: logged-in user info, JWT token, login/logout actions
// "Slice" = a piece of global state + the functions to update it
// =====================================================

import { createSlice } from "@reduxjs/toolkit";

// Try to load saved login info from browser's localStorage
// (so user stays logged in even after page refresh)
const userFromStorage = localStorage.getItem("user")
  ? JSON.parse(localStorage.getItem("user"))
  : null;
const tokenFromStorage = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: userFromStorage, // { id, name, email, role } or null
    token: tokenFromStorage, // JWT string or null
  },
  reducers: {
    // Called after successful login/signup
    // action.payload = { user, token } from backend response
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // Save to localStorage so refresh doesn't log user out
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    // Called when user clicks logout
    logout: (state) => {
      state.user = null;
      state.token = null;

      // Clear localStorage too
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

// Export actions to use in components (dispatch(loginSuccess(...)))
export const { loginSuccess, logout } = authSlice.actions;

// Export reducer to register in store.js
export default authSlice.reducer;

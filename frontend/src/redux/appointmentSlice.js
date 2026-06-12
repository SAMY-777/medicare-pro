// =====================================================
// APPOINTMENT SLICE
// Manages: list of appointments shown on dashboard
// =====================================================

import { createSlice } from "@reduxjs/toolkit";

const appointmentSlice = createSlice({
  name: "appointments",
  initialState: {
    list: [], // array of appointment objects
  },
  reducers: {
    // Replace entire list (used after fetching from backend)
    setAppointments: (state, action) => {
      state.list = action.payload;
    },

    // Add a single new appointment to the list (after creating one)
    addAppointment: (state, action) => {
      state.list.push(action.payload);
    },

    // Remove an appointment by its _id (after deleting)
    removeAppointment: (state, action) => {
      state.list = state.list.filter((appt) => appt._id !== action.payload);
    },

    // Update an existing appointment in the list (after editing)
    updateAppointmentInList: (state, action) => {
      const index = state.list.findIndex((appt) => appt._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
});

export const { setAppointments, addAppointment, removeAppointment, updateAppointmentInList } =
  appointmentSlice.actions;

export default appointmentSlice.reducer;

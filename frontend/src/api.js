// API.JS - Centralized axios setup
// All backend calls go through this file


import axios from "axios";

// Base URL of our backend server
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// INTERCEPTOR: runs before every request
// Automatically attaches JWT token (if user is logged in) to headers
// So we don't have to manually add it in every single API call
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

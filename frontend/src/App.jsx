// APP.JSX - Main app component
// Sets up all page routes and decides which page to show


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // hook to read Redux state
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";

function App() {
  // Read current logged-in user from Redux store
  const { user } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes - accessible without login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected route - only if user is logged in */}
      <Route
        path="/dashboard"
        element={user ? <Dashboard /> : <Navigate to="/login" />}
      />

      {/* Admin-only route - only if user is logged in AND role is admin */}
      <Route
        path="/admin"
        element={
          user && user.role === "admin" ? <AdminPanel /> : <Navigate to="/login" />
        }
      />

      {/* Default route - redirect based on login status */}
      <Route
        path="/"
        element={<Navigate to={user ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

export default App;

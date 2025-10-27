// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = UserAuth();

  // 1. If auth state is still resolving, we wait (return null, App.js handles the spinner)
  if (loading) {
    return null;
  }

  // 2. If no user is logged in, redirect them to the login page
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 3. If a user is present, render the protected component
  return children;
};

export default ProtectedRoute;

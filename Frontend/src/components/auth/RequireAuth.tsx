import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  // If an admin hits root, send to admin dashboard
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  return children;
};

export default RequireAuth;
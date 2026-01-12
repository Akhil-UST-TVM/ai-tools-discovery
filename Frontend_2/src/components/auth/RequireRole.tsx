import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  role: "admin" | "user";
  children: React.ReactElement;
}

const RequireRole: React.FC<Props> = ({ role, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default RequireRole;
// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

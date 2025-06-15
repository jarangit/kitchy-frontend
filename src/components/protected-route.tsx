// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

import type { ReactNode } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();

  if (!auth || auth.loading) return <div>Loading...</div>;

  if (!auth.user) return <Navigate to="/login" replace />;

  return children;
};

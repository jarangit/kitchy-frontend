// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Spinner } from "@/shared/components/ui/spinner";
import { useTranslation } from "@/shared/i18n/use-translation";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const { t } = useTranslation();

  if (!auth?.isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner size="lg" label={t("common.loading")} />
      </div>
    );
  }

  if (!auth.isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Spinner } from "@/shared/components/ui/spinner";
import { useTranslation } from "@/shared/i18n/use-translation";
import { hasDeviceToken } from "@/features/device/utils/device-token";

/**
 * Route guard for the KDS board. Accepts either a signed-in user or a
 * device paired via the /pair page (device_token in localStorage).
 */
export const KdsRoute = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  const { t } = useTranslation();

  if (!auth?.isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Spinner size="lg" label={t("common.loading")} />
      </div>
    );
  }

  if (!auth.isAuthenticated && !hasDeviceToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

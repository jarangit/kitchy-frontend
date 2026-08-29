import { useCallback, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsPinDialog } from "@/features/store/components/settings-pin-dialog";
import {
  hasStorePin,
  isValidStorePin,
  setStorePinCache,
} from "@/features/store/utils/store-pin-cache";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  children: ReactNode;
}

export function SettingsPinGuard({ children }: Props) {
  const storeIdParam = useStoreRouteParam();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const storeId = storeIdParam ?? "";

  const [, forceUpdate] = useState(0);
  const unlocked = storeId ? hasStorePin(storeId) : true;
  const dialogOpen = !unlocked;

  const handleClose = useCallback(() => {
    if (storeId) navigate(`/store/${storeId}`, { replace: true });
    else navigate("/dashboard", { replace: true });
  }, [navigate, storeId]);

  const handleVerify = useCallback(
    (pin: string) => {
      if (!isValidStorePin(pin)) return false;
      setStorePinCache(storeId, pin);
      forceUpdate((v) => v + 1);
      return true;
    },
    [storeId],
  );

  if (!storeId) return <>{children}</>;

  if (unlocked) return <>{children}</>;

  return (
    <>
      <div className="flex min-h-[40vh] items-center justify-center px-4">
        <div className="rounded-card border border-card-border bg-surface p-6 text-center">
          <p className="text-body font-medium text-text-primary">
            {t("settings.pin.verify.title")}
          </p>
          <p className="mt-1 text-body-sm text-text-secondary">
            {t("settings.pin.verify.description")}
          </p>
        </div>
      </div>
      <SettingsPinDialog
        open={dialogOpen}
        mode="verify"
        onClose={handleClose}
        onVerify={handleVerify}
      />
    </>
  );
}

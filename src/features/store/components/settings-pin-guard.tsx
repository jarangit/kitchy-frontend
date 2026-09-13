import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { SettingsPinDialog } from "@/features/store/components/settings-pin-dialog";
import {
  hasStorePin,
  isValidStorePin,
  setStorePinCache,
} from "@/features/store/utils/store-pin-cache";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useStorePin } from "@/features/store/hooks/useStorePin";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { setCurrentStoreId } from "@/shared/store/slices/current-store-slice";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  children: ReactNode;
}

export function SettingsPinGuard({ children }: Props) {
  const storeIdParam = useStoreRouteParam();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const storeId = storeIdParam ?? "";

  // The store query reads the id from Redux, so sync it from the route here.
  // (SettingsFrame does the same, but it only mounts after this guard unlocks.)
  const reduxStoreId = useAppSelector((state) => state.currentStore.storeId);
  useEffect(() => {
    if (storeId && reduxStoreId !== storeId) {
      dispatch(setCurrentStoreId(storeId));
    }
  }, [dispatch, reduxStoreId, storeId]);

  const { storeFinOneQuery, storeFinOneLoading } = useStoreService({});
  const { setPinFirstTime } = useStorePin();

  const [unlocked, setUnlocked] = useState(() =>
    storeId ? hasStorePin(storeId) : true,
  );

  const handleClose = useCallback(() => {
    if (storeId) navigate(`/store/${storeId}`, { replace: true });
    else navigate("/dashboard", { replace: true });
  }, [navigate, storeId]);

  const handleVerify = useCallback(
    (pin: string) => {
      if (!isValidStorePin(pin)) return false;
      setStorePinCache(storeId, pin);
      setUnlocked(true);
      return true;
    },
    [storeId],
  );

  const handleCreateConfirm = useCallback(
    async (pin: string) => {
      try {
        await setPinFirstTime(pin);
        setUnlocked(true);
      } catch {
        // error handled inside the hook with toast; keep dialog open
      }
    },
    [setPinFirstTime],
  );

  if (!storeId) return <>{children}</>;

  // Re-check the cache every render so switching stores re-locks correctly.
  if (unlocked || hasStorePin(storeId)) return <>{children}</>;

  // Wait for the store so the dialog opens in the right mode
  // (create when the store has no PIN yet, verify otherwise).
  // Render nothing behind the modal — no placeholder card.
  if (storeFinOneLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-body-sm text-text-tertiary">
          {t("store.dashboard.loading")}
        </p>
      </div>
    );
  }

  // Fall back to verify when the PIN state is unknown (query error, demo data).
  const needsCreate = storeFinOneQuery?.pinSet === false;

  if (needsCreate) {
    return (
      <SettingsPinDialog
        open
        mode="create"
        onClose={handleClose}
        onVerify={() => {}}
        onCreateConfirm={handleCreateConfirm}
      />
    );
  }

  return (
    <SettingsPinDialog
      open
      mode="verify"
      onClose={handleClose}
      onVerify={handleVerify}
    />
  );
}

import { useMemo } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import {
  DEFAULT_STORE_SETTINGS,
  type StoreSettings,
} from "@/features/store/types/store.model";

export type StoreSettingsPatch = Partial<{
  hours: string;
  promptpay: string;
  dailyRevenueTarget: string;
  paused: boolean;
  sales: Partial<StoreSettings["sales"]>;
  payments: Partial<StoreSettings["payments"]>;
  safety: Partial<StoreSettings["safety"]>;
  delivery: Partial<StoreSettings["delivery"]>;
}>;

const mergeSettings = (
  base: StoreSettings,
  patch: StoreSettingsPatch,
): StoreSettings => ({
  hours: patch.hours ?? base.hours,
  promptpay: patch.promptpay ?? base.promptpay,
  dailyRevenueTarget: patch.dailyRevenueTarget ?? base.dailyRevenueTarget,
  paused: patch.paused ?? base.paused,
  sales: { ...base.sales, ...patch.sales },
  payments: { ...base.payments, ...patch.payments },
  safety: { ...base.safety, ...patch.safety },
  delivery: { ...base.delivery, ...patch.delivery },
});

/**
 * API-backed store settings.
 * Reads `settings` from the store query and persists full replacements
 * through `PATCH /stores/:id`. Falls back to DEFAULT_STORE_SETTINGS when
 * the store has no persisted settings yet.
 */
export function useStoreSettings() {
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const { storeFinOneQuery, updateStore, updateStoreLoading } = useStoreService(
    { userId },
  );

  const settings = useMemo<StoreSettings>(() => {
    const stored = storeFinOneQuery?.settings;
    if (!stored) return DEFAULT_STORE_SETTINGS;

    return {
      hours: stored.hours ?? DEFAULT_STORE_SETTINGS.hours,
      promptpay: stored.promptpay ?? DEFAULT_STORE_SETTINGS.promptpay,
      dailyRevenueTarget:
        stored.dailyRevenueTarget ?? DEFAULT_STORE_SETTINGS.dailyRevenueTarget,
      paused: stored.paused ?? DEFAULT_STORE_SETTINGS.paused,
      sales: { ...DEFAULT_STORE_SETTINGS.sales, ...stored.sales },
      payments: { ...DEFAULT_STORE_SETTINGS.payments, ...stored.payments },
      safety: { ...DEFAULT_STORE_SETTINGS.safety, ...stored.safety },
      delivery: { ...DEFAULT_STORE_SETTINGS.delivery, ...stored.delivery },
    };
  }, [storeFinOneQuery]);

  const updateSettings = (patch: StoreSettingsPatch) => {
    if (!storeFinOneQuery) return;
    updateStore({
      storeData: {
        name: storeFinOneQuery.name,
        settings: mergeSettings(settings, patch),
      },
    });
  };

  return {
    settings,
    updateSettings,
    isSaving: updateStoreLoading,
    storeReady: Boolean(storeFinOneQuery),
  };
}

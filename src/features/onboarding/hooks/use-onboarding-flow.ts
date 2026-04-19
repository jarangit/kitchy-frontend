import { useState } from "react";
import {
  createInitialMenus,
  initStoreWithStation,
} from "@/features/onboarding/services/onboarding-setup";
import type { OnboardingMenuDraft } from "@/features/onboarding/types/onboarding.model";

/**
 * Thin orchestrator around the composite onboarding services.
 *
 * Keeps wizard components free of try/catch boilerplate and exposes
 * `submitting` flags per step so buttons can show loading states.
 */
export function useOnboardingFlow() {
  const [initStoreLoading, setInitStoreLoading] = useState(false);
  const [initStoreError, setInitStoreError] = useState<string | null>(null);

  const [createMenusLoading, setCreateMenusLoading] = useState(false);
  const [createMenusError, setCreateMenusError] = useState<string | null>(null);

  const submitStore = async (params: {
    userId: string;
    storeName: string;
    defaultStationName: string;
  }) => {
    setInitStoreLoading(true);
    setInitStoreError(null);
    try {
      const result = await initStoreWithStation(params);
      return result;
    } catch (err) {
      setInitStoreError(extractMessage(err));
      throw err;
    } finally {
      setInitStoreLoading(false);
    }
  };

  const submitMenus = async (params: {
    storeId: string;
    stationId: string;
    menus: OnboardingMenuDraft[];
  }) => {
    setCreateMenusLoading(true);
    setCreateMenusError(null);
    try {
      await createInitialMenus(params);
    } catch (err) {
      setCreateMenusError(extractMessage(err));
      throw err;
    } finally {
      setCreateMenusLoading(false);
    }
  };

  return {
    submitStore,
    initStoreLoading,
    initStoreError,

    submitMenus,
    createMenusLoading,
    createMenusError,
  };
}

function extractMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    return String((err as { message?: unknown }).message ?? "");
  }
  return "Unknown error";
}

import { storeServiceApi } from "@/features/store/services/store";
import { stationServiceApi } from "@/features/station/services/station";
import { productApiService } from "@/features/product/services/product";
import type { OnboardingMenuDraft } from "@/features/onboarding/types/onboarding.model";

/**
 * Composite onboarding API calls.
 *
 * These orchestrate multiple domain services in sequence so the wizard
 * components stay declarative. Each helper returns the ids needed by
 * later steps.
 */

export interface InitStoreResult {
  storeId: string;
  stationId: string;
}

/**
 * Step 1 submit:
 *  1) POST /stores    → { name, userId }
 *  2) POST /stations  → auto-create "ครัว" station for that store
 *
 * Station name is passed by the caller (i18n-resolved) so this stays i18n-agnostic.
 */
export async function initStoreWithStation(params: {
  userId: string;
  storeName: string;
  defaultStationName: string;
}): Promise<InitStoreResult> {
  const storeRes = await storeServiceApi.addStore({
    userId: params.userId,
    name: params.storeName.trim(),
  });

  const storeData = storeRes?.data ?? storeRes;
  const storeId = String(storeData?.id ?? storeData?._id ?? "");
  if (!storeId) {
    throw new Error("Failed to create store: missing id in response");
  }

  const stationRes = await stationServiceApi.add({
    storeId,
    name: params.defaultStationName,
  });
  const stationData = stationRes?.data ?? stationRes;
  const stationId = String(stationData?.id ?? stationData?._id ?? "");
  if (!stationId) {
    throw new Error("Failed to create default station: missing id in response");
  }

  return { storeId, stationId };
}

/**
 * Step 2 submit: batch-create all drafted menus against the store + auto station.
 *
 * Sequential (not Promise.all) so a failure in one doesn't leave
 * the user guessing which one errored — we surface the first failure.
 */
export async function createInitialMenus(params: {
  storeId: string;
  stationId: string;
  menus: OnboardingMenuDraft[];
}): Promise<void> {
  for (const menu of params.menus) {
    const priceNumber = Number(menu.price);
    if (!menu.name.trim() || !Number.isFinite(priceNumber) || priceNumber < 0) {
      continue;
    }
    await productApiService.createProduct({
      name: menu.name.trim(),
      storeId: params.storeId,
      stationId: params.stationId,
      price: priceNumber,
      isActive: true,
    });
  }
}

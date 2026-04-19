/**
 * Local-storage keys and helpers for onboarding flags.
 *
 * We do NOT persist the in-flight wizard draft here — that lives in
 * React state + sessionStorage inside `OnboardingContext`. This file is
 * for post-onboarding flags we want to survive tab reloads (e.g. whether
 * the POS coach tour has been seen for a given store).
 */

const STORAGE_PREFIX = "kitchy.onboarding";

export const onboardingStorageKeys = {
  /** Set once when the user completes the wizard for a given store. */
  completed: (storeId: string) => `${STORAGE_PREFIX}.completed.${storeId}`,
  /** Active flag — set while the wizard is still live for this store. */
  active: (storeId: string) => `${STORAGE_PREFIX}.active.${storeId}`,
  /** User dismissed the POS coach marks. */
  posTourSkipped: (storeId: string) => `${STORAGE_PREFIX}.posTourSkipped.${storeId}`,
  /** First order was placed within the onboarding session. */
  firstOrderDone: (storeId: string) => `${STORAGE_PREFIX}.firstOrderDone.${storeId}`,
  /** Selected shop type (drives default orderType in cart). */
  shopType: (storeId: string) => `${STORAGE_PREFIX}.shopType.${storeId}`,
} as const;

function readBool(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeBool(key: string, value: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (value) {
      window.localStorage.setItem(key, "1");
    } else {
      window.localStorage.removeItem(key);
    }
  } catch {
    /* ignore quota errors */
  }
}

export const onboardingStorage = {
  isCompleted: (storeId: string) => readBool(onboardingStorageKeys.completed(storeId)),
  markCompleted: (storeId: string) => writeBool(onboardingStorageKeys.completed(storeId), true),

  isActive: (storeId: string) => readBool(onboardingStorageKeys.active(storeId)),
  setActive: (storeId: string, active: boolean) =>
    writeBool(onboardingStorageKeys.active(storeId), active),

  isPosTourSkipped: (storeId: string) =>
    readBool(onboardingStorageKeys.posTourSkipped(storeId)),
  markPosTourSkipped: (storeId: string) =>
    writeBool(onboardingStorageKeys.posTourSkipped(storeId), true),

  isFirstOrderDone: (storeId: string) =>
    readBool(onboardingStorageKeys.firstOrderDone(storeId)),
  markFirstOrderDone: (storeId: string) =>
    writeBool(onboardingStorageKeys.firstOrderDone(storeId), true),

  getShopType: (storeId: string): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(onboardingStorageKeys.shopType(storeId));
    } catch {
      return null;
    }
  },
  setShopType: (storeId: string, shopType: string) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(onboardingStorageKeys.shopType(storeId), shopType);
    } catch {
      /* ignore */
    }
  },
};

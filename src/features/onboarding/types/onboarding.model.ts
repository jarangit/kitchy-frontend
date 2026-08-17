/** Steps in the onboarding wizard, in visit order. */
export type OnboardingStep = "welcome" | "store" | "menu" | "pos" | "done";

/** One menu item captured in Step 2. */
export interface OnboardingMenuDraft {
  /** Local client-side id for list rendering/removal. */
  localId: string;
  name: string;
  /** Price in THB, stored as string while editing to avoid input jumpiness. */
  price: string;
}

/**
 * All data captured during the wizard.
 *
 * `storeId` / `stationId` are populated after Step 1 submit (store + auto
 * station created). Subsequent steps reuse them.
 */
export interface OnboardingDraft {
  storeName: string;
  promptpay: string;
  menus: OnboardingMenuDraft[];
  storeId?: string;
  stationId?: string;
}

export const ONBOARDING_STEP_ORDER: OnboardingStep[] = [
  "welcome",
  "store",
  "menu",
  "pos",
  "done",
];

/** Human-facing progress count excluding terminal states. */
export const ONBOARDING_VISIBLE_STEPS: OnboardingStep[] = [
  "welcome",
  "store",
  "menu",
  "pos",
];

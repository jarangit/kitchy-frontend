import { createContext } from "react";
import type {
  OnboardingDraft,
  OnboardingMenuDraft,
  OnboardingShopType,
  OnboardingStep,
} from "@/features/onboarding/types/onboarding.model";

export interface OnboardingContextValue {
  step: OnboardingStep;
  draft: OnboardingDraft;
  /** 1-based index within visible steps; 0 if on a terminal step. */
  stepIndex: number;
  totalVisibleSteps: number;

  goTo: (step: OnboardingStep) => void;
  next: () => void;
  back: () => void;

  setStoreName: (name: string) => void;
  setPromptpay: (value: string) => void;

  addMenu: () => void;
  updateMenu: (localId: string, patch: Partial<Omit<OnboardingMenuDraft, "localId">>) => void;
  removeMenu: (localId: string) => void;

  setShopType: (value: OnboardingShopType | null) => void;

  /** Populate backend-issued ids after Step 1 submit succeeds. */
  setCreatedIds: (ids: { storeId: string; stationId: string }) => void;

  resetDraft: () => void;
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null);

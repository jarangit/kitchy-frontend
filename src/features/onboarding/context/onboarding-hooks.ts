import { useContext } from "react";
import { OnboardingContext } from "@/features/onboarding/context/onboarding-context-value";
import type { OnboardingContextValue } from "@/features/onboarding/context/onboarding-context-value";

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within <OnboardingProvider>");
  }
  return ctx;
}

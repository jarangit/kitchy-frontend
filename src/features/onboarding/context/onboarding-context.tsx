import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  OnboardingDraft,
  OnboardingMenuDraft,
  OnboardingShopType,
  OnboardingStep,
} from "@/features/onboarding/types/onboarding.model";
import {
  ONBOARDING_STEP_ORDER,
  ONBOARDING_VISIBLE_STEPS,
} from "@/features/onboarding/types/onboarding.model";

interface OnboardingContextValue {
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

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

function createInitialDraft(): OnboardingDraft {
  return {
    storeName: "",
    promptpay: "",
    menus: [newMenuDraft()],
    shopType: null,
  };
}

function newMenuDraft(): OnboardingMenuDraft {
  return {
    localId: `menu_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: "",
    price: "",
  };
}

interface ProviderProps {
  children: ReactNode;
  initialStep?: OnboardingStep;
}

export function OnboardingProvider({
  children,
  initialStep = "welcome",
}: ProviderProps) {
  const [step, setStep] = useState<OnboardingStep>(initialStep);
  const [draft, setDraft] = useState<OnboardingDraft>(() => createInitialDraft());

  const goTo = useCallback((target: OnboardingStep) => setStep(target), []);

  const next = useCallback(() => {
    setStep((current) => {
      const idx = ONBOARDING_STEP_ORDER.indexOf(current);
      if (idx < 0 || idx === ONBOARDING_STEP_ORDER.length - 1) return current;
      return ONBOARDING_STEP_ORDER[idx + 1];
    });
  }, []);

  const back = useCallback(() => {
    setStep((current) => {
      const idx = ONBOARDING_STEP_ORDER.indexOf(current);
      if (idx <= 0) return current;
      return ONBOARDING_STEP_ORDER[idx - 1];
    });
  }, []);

  const setStoreName = useCallback((name: string) => {
    setDraft((prev) => ({ ...prev, storeName: name }));
  }, []);

  const setPromptpay = useCallback((value: string) => {
    setDraft((prev) => ({ ...prev, promptpay: value }));
  }, []);

  const addMenu = useCallback(() => {
    setDraft((prev) => ({ ...prev, menus: [...prev.menus, newMenuDraft()] }));
  }, []);

  const updateMenu = useCallback(
    (localId: string, patch: Partial<Omit<OnboardingMenuDraft, "localId">>) => {
      setDraft((prev) => ({
        ...prev,
        menus: prev.menus.map((m) => (m.localId === localId ? { ...m, ...patch } : m)),
      }));
    },
    [],
  );

  const removeMenu = useCallback((localId: string) => {
    setDraft((prev) => {
      const filtered = prev.menus.filter((m) => m.localId !== localId);
      // Always keep at least one row visible so the form isn't empty.
      return {
        ...prev,
        menus: filtered.length > 0 ? filtered : [newMenuDraft()],
      };
    });
  }, []);

  const setShopType = useCallback((value: OnboardingShopType | null) => {
    setDraft((prev) => ({ ...prev, shopType: value }));
  }, []);

  const setCreatedIds = useCallback(
    ({ storeId, stationId }: { storeId: string; stationId: string }) => {
      setDraft((prev) => ({ ...prev, storeId, stationId }));
    },
    [],
  );

  const resetDraft = useCallback(() => {
    setDraft(createInitialDraft());
    setStep("welcome");
  }, []);

  const stepIndex = useMemo(() => {
    const idx = ONBOARDING_VISIBLE_STEPS.indexOf(step);
    return idx < 0 ? 0 : idx + 1;
  }, [step]);

  const value = useMemo<OnboardingContextValue>(
    () => ({
      step,
      draft,
      stepIndex,
      totalVisibleSteps: ONBOARDING_VISIBLE_STEPS.length,
      goTo,
      next,
      back,
      setStoreName,
      setPromptpay,
      addMenu,
      updateMenu,
      removeMenu,
      setShopType,
      setCreatedIds,
      resetDraft,
    }),
    [
      step,
      draft,
      stepIndex,
      goTo,
      next,
      back,
      setStoreName,
      setPromptpay,
      addMenu,
      updateMenu,
      removeMenu,
      setShopType,
      setCreatedIds,
      resetDraft,
    ],
  );

  return (
    <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>
  );
}

export function useOnboarding(): OnboardingContextValue {
  const ctx = useContext(OnboardingContext);
  if (!ctx) {
    throw new Error("useOnboarding must be used within <OnboardingProvider>");
  }
  return ctx;
}

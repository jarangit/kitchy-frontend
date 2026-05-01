import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppDispatch } from "@/shared/hooks/hooks";
import { setCurrentStore } from "@/shared/store/slices/current-store-slice";
import { setCurrentStation } from "@/shared/store/slices/current-station-slice";
import {
  OnboardingProvider,
} from "@/features/onboarding/context/onboarding-context";
import { useOnboarding } from "@/features/onboarding/context/onboarding-hooks";
import { useOnboardingFlow } from "@/features/onboarding/hooks/use-onboarding-flow";
import { onboardingStorage } from "@/features/onboarding/utils/onboarding-storage";
import { WizardShell } from "@/features/onboarding/components/wizard-shell";
import { StepWelcome } from "@/features/onboarding/components/step-welcome";
import { StepStoreInfo } from "@/features/onboarding/components/step-store-info";
import { StepAddMenu } from "@/features/onboarding/components/step-add-menu";
import { StepShopType } from "@/features/onboarding/components/step-shop-type";

/**
 * Onboarding wizard route.
 *
 * Mounts its own Provider so state is scoped to this flow — leaving/resetting
 * the route drops the draft entirely. If the user refreshes mid-wizard, they
 * restart from Welcome (acceptable for a ≤2-minute flow).
 */
export default function OnboardingWizardPage() {
  return (
    <OnboardingProvider>
      <WizardBody />
    </OnboardingProvider>
  );
}

function WizardBody() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;

  const {
    step,
    draft,
    stepIndex,
    totalVisibleSteps,
    next,
    back,
    setCreatedIds,
  } = useOnboarding();

  const flow = useOnboardingFlow();

  const goToPosAsActive = useCallback(
    (storeId: string, stationId: string, storeName: string) => {
      dispatch(setCurrentStore({ storeId, storeName }));
      dispatch(
        setCurrentStation({
          stationId,
          stationName: t("onboarding.autoStationName"),
        }),
      );
      onboardingStorage.setActive(storeId, true);
      // Persist shop type so POS can default its orderType
      if (draft.shopType) {
        onboardingStorage.setShopType(storeId, draft.shopType);
      }
      // Persist PromptPay into the existing localStorage keys used by settings
      if (draft.promptpay.trim()) {
        try {
          window.localStorage.setItem(
            `kitchy.setting.store.${storeId}.promptpay`,
            JSON.stringify(draft.promptpay.trim()),
          );
        } catch {
          /* ignore */
        }
      }
      // Refresh stores list so dashboard reflects new store if user navigates back.
      queryClient.invalidateQueries({ queryKey: ["stores", userId] });
      queryClient.invalidateQueries({ queryKey: ["products", storeId] });
      navigate(`/store/${storeId}/pos`);
    },
    [dispatch, draft.promptpay, draft.shopType, navigate, queryClient, t, userId],
  );

  // ── Step dispatchers ──
  const handleStoreSubmit = useCallback(async () => {
    if (!userId) return;
    try {
      const { storeId, stationId } = await flow.submitStore({
        userId,
        storeName: draft.storeName,
        defaultStationName: t("onboarding.autoStationName"),
      });
      setCreatedIds({ storeId, stationId });
      next();
    } catch {
      /* error shown inline */
    }
  }, [userId, flow, draft.storeName, t, setCreatedIds, next]);

  const handleMenuSubmit = useCallback(async () => {
    if (!draft.storeId || !draft.stationId) return;
    try {
      await flow.submitMenus({
        storeId: draft.storeId,
        stationId: draft.stationId,
        menus: draft.menus,
      });
      next();
    } catch {
      /* error shown inline */
    }
  }, [draft.menus, draft.stationId, draft.storeId, flow, next]);

  const handleShopTypeSubmit = useCallback(() => {
    if (!draft.storeId || !draft.stationId) return;
    goToPosAsActive(draft.storeId, draft.stationId, draft.storeName.trim());
  }, [draft.stationId, draft.storeId, draft.storeName, goToPosAsActive]);

  const handleSkipToPos = useCallback(() => {
    if (!draft.storeId || !draft.stationId) return;
    goToPosAsActive(draft.storeId, draft.stationId, draft.storeName.trim());
  }, [draft.stationId, draft.storeId, draft.storeName, goToPosAsActive]);

  const handleSkipToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  // ── Render per step ──
  switch (step) {
    case "welcome":
      return (
        <WizardShell
          stepIndex={stepIndex}
          totalSteps={totalVisibleSteps}
          onSkip={handleSkipToDashboard}
        >
          <StepWelcome onStart={next} />
        </WizardShell>
      );

    case "store":
      return (
        <WizardShell
          stepIndex={stepIndex}
          totalSteps={totalVisibleSteps}
          onBack={back}
          onSkip={handleSkipToDashboard}
        >
          <StepStoreInfo
            onSubmit={handleStoreSubmit}
            submitting={flow.initStoreLoading}
            error={flow.initStoreError ? t("onboarding.store.submitError") : null}
          />
        </WizardShell>
      );

    case "menu":
      return (
        <WizardShell
          stepIndex={stepIndex}
          totalSteps={totalVisibleSteps}
          onBack={back}
          onSkip={draft.storeId ? handleSkipToPos : undefined}
        >
          <StepAddMenu
            onSubmit={handleMenuSubmit}
            submitting={flow.createMenusLoading}
            error={flow.createMenusError ? t("onboarding.menu.submitError") : null}
          />
        </WizardShell>
      );

    case "shopType":
      return (
        <WizardShell
          stepIndex={stepIndex}
          totalSteps={totalVisibleSteps}
          onBack={back}
          onSkip={handleShopTypeSubmit}
        >
          <StepShopType onSubmit={handleShopTypeSubmit} />
        </WizardShell>
      );

    default:
      // For "pos" / "done" we don't render anything — wizard hands off to POS.
      return null;
  }
}

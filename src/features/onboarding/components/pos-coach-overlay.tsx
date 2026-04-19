import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "@/shared/i18n/use-translation";
import { appBus } from "@/shared/events/app-events";
import { onboardingStorage } from "@/features/onboarding/utils/onboarding-storage";
import { CoachMark } from "./coach-mark";
import { SuccessMoment } from "./success-moment";

type CoachStage = "tapProduct" | "tapPay" | "done";

interface Props {
  /** Whether the cart has any items yet — drives stage transition. */
  cartItemCount: number;
  /** Current subtotal — shown in success moment. */
  subtotal: number;
}

/**
 * Orchestrator for the POS coach marks.
 *
 * Stage 1: highlights the first product card → "tap to add".
 * Stage 2: once cart has >= 1 item, highlights the pay button.
 * Stage 3 (done): listens to `order:created` and shows SuccessMoment.
 *
 * All state is scoped to the current storeId so different stores track
 * independently.
 */
export function PosCoachOverlay({ cartItemCount, subtotal }: Props) {
  const { t } = useTranslation();
  const { id: storeId } = useParams<{ id: string }>();

  const [active, setActive] = useState(false);
  const [stage, setStage] = useState<CoachStage>("tapProduct");
  const [firstProductSelector, setFirstProductSelector] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0);

  // Decide initial activeness + stage on mount / when storeId changes.
  useEffect(() => {
    if (!storeId) {
      setActive(false);
      return;
    }
    const tourActive = onboardingStorage.isActive(storeId);
    const tourSkipped = onboardingStorage.isPosTourSkipped(storeId);
    const firstOrderDone = onboardingStorage.isFirstOrderDone(storeId);
    setActive(tourActive && !tourSkipped && !firstOrderDone);
  }, [storeId]);

  // Find the first product card to target in stage 1.
  useEffect(() => {
    if (!active || stage !== "tapProduct") return;
    const pickTarget = () => {
      const el = document.querySelector("[data-onboarding-target^='product-card-']");
      if (el) {
        const selector = `[data-onboarding-target='${el.getAttribute("data-onboarding-target")}']`;
        setFirstProductSelector(selector);
      }
    };
    pickTarget();
    // Retry a few times in case products haven't loaded yet.
    const id = window.setInterval(pickTarget, 600);
    return () => window.clearInterval(id);
  }, [active, stage]);

  // Advance stage when cart gets its first item.
  useEffect(() => {
    if (!active) return;
    if (stage === "tapProduct" && cartItemCount > 0) {
      setStage("tapPay");
    }
  }, [active, cartItemCount, stage]);

  // Listen for order:created → show success moment (once per store).
  useEffect(() => {
    if (!storeId || !active) return;
    const unsub = appBus.on("order:created", () => {
      if (onboardingStorage.isFirstOrderDone(storeId)) return;
      onboardingStorage.markFirstOrderDone(storeId);
      onboardingStorage.setActive(storeId, false);
      setSuccessAmount(subtotal);
      setShowSuccess(true);
      setStage("done");
    });
    return unsub;
  }, [active, storeId, subtotal]);

  const handleSkipTour = () => {
    if (!storeId) return;
    onboardingStorage.markPosTourSkipped(storeId);
    onboardingStorage.setActive(storeId, false);
    setActive(false);
  };

  if (!active && !showSuccess) return null;

  return (
    <>
      {active && stage === "tapProduct" && firstProductSelector ? (
        <CoachMark
          targetSelector={firstProductSelector}
          message={t("onboarding.pos.coach.tapProduct")}
          placement="bottom"
          skipLabel={t("onboarding.pos.coach.skip")}
          onSkip={handleSkipTour}
          onDismiss={handleSkipTour}
        />
      ) : null}

      {active && stage === "tapPay" ? (
        <CoachMark
          targetSelector="[data-onboarding-target='pay-button']"
          message={t("onboarding.pos.coach.tapPay")}
          placement="top"
          skipLabel={t("onboarding.pos.coach.skip")}
          onSkip={handleSkipTour}
          onDismiss={handleSkipTour}
        />
      ) : null}

      {showSuccess ? (
        <SuccessMoment
          amount={successAmount}
          onClose={() => {
            setShowSuccess(false);
            onboardingStorage.markCompleted(storeId ?? "");
          }}
        />
      ) : null}
    </>
  );
}

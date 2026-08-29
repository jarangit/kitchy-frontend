import { useCallback, useEffect, useMemo, useState } from "react";
import { LuDelete } from "react-icons/lu";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

const PIN_MIN_LENGTH = 4;
const PIN_MAX_LENGTH = 6;
const PIN_LENGTH = 6;

interface SettingsPinDialogProps {
  open: boolean;
  mode: "verify" | "create" | "confirm";
  expectedPin?: string;
  title?: string;
  description?: string;
  errorText?: string;
  onClose: () => void;
  onVerify: (pin: string) => boolean | void;
  onCreateConfirm?: (pin: string) => void;
}

function PinDots({
  value,
  length,
  hasError,
  shakeKey,
}: {
  value: string;
  length: number;
  hasError: boolean;
  shakeKey: number;
}) {
  return (
    <div
      key={shakeKey}
      className={cn(
        "flex items-center justify-center gap-3",
        hasError && "animate-[shake_0.3s_ease-in-out]",
      )}
    >
      {Array.from({ length }).map((_, index) => {
        const filled = index < value.length;
        return (
          <span
            key={index}
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded-full border transition-colors duration-fast",
              filled ? "border-primary bg-primary" : "border-border bg-surface",
              hasError && !filled && "border-danger/50",
              hasError && filled && "border-danger bg-danger",
            )}
            aria-hidden="true"
          >
            {filled && <span className="h-2 w-2 rounded-full bg-on-primary" />}
          </span>
        );
      })}
    </div>
  );
}

function NumpadButton({
  label,
  onPress,
  variant = "default",
  ariaLabel,
}: {
  label: string;
  onPress: () => void;
  variant?: "default" | "ghost";
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? label}
      onClick={onPress}
      className={cn(
        "flex h-14 w-14 items-center justify-center rounded-full text-title font-medium transition-colors duration-fast active:scale-[0.98]",
        variant === "default"
          ? "bg-surface text-text-primary hover:bg-surface-hover border border-border"
          : "bg-transparent text-text-secondary hover:bg-surface-hover",
      )}
    >
      {label}
    </button>
  );
}

export function SettingsPinDialog({
  open,
  mode,
  expectedPin,
  title,
  description,
  errorText,
  onClose,
  onVerify,
  onCreateConfirm,
}: SettingsPinDialogProps) {
  const { t } = useTranslation();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [pendingCreatePin, setPendingCreatePin] = useState<string | null>(null);

  const isConfirmStep =
    mode === "confirm" || (mode === "create" && pendingCreatePin !== null);

  const effectiveTitle = useMemo(() => {
    if (title) return title;
    if (mode === "verify") return t("settings.pin.verify.title");
    if (isConfirmStep) return t("settings.pin.confirm.title");
    return t("settings.pin.create.title");
  }, [isConfirmStep, mode, t, title]);

  const effectiveDescription = useMemo(() => {
    if (description) return description;
    if (mode === "verify") return t("settings.pin.verify.description");
    if (isConfirmStep) return t("settings.pin.confirm.description");
    return t("settings.pin.create.description");
  }, [description, isConfirmStep, mode, t]);

  const resetState = useCallback(() => {
    setPin("");
    setError(null);
  }, []);

  useEffect(() => {
    if (!open) {
      setPin("");
      setError(null);
      setPendingCreatePin(null);
      setShakeKey(0);
    }
  }, [open]);

  const triggerHaptic = useCallback(() => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(8);
    }
  }, []);

  const handleFail = useCallback(
    (message: string) => {
      triggerHaptic();
      setError(message);
      setShakeKey((prev) => prev + 1);
      setPin("");
    },
    [triggerHaptic],
  );

  const commitVerify = useCallback(
    (nextPin: string) => {
      if (expectedPin && expectedPin.length > 0) {
        if (nextPin !== expectedPin) {
          handleFail(errorText ?? t("settings.pin.error.incorrect"));
          return;
        }
      }
      const result = onVerify(nextPin);
      if (result === false) {
        handleFail(errorText ?? t("settings.pin.error.incorrect"));
        return;
      }
      triggerHaptic();
      setPin("");
      setError(null);
    },
    [errorText, expectedPin, handleFail, onVerify, t, triggerHaptic],
  );

  const commitCreate = useCallback(
    (nextPin: string) => {
      if (pendingCreatePin === null) {
        setPendingCreatePin(nextPin);
        setPin("");
        setError(null);
        triggerHaptic();
        return;
      }
      if (nextPin !== pendingCreatePin) {
        handleFail(t("settings.pin.error.mismatch"));
        setPendingCreatePin(null);
        return;
      }
      triggerHaptic();
      if (onCreateConfirm) onCreateConfirm(nextPin);
      else onVerify(nextPin);
      setPin("");
      setPendingCreatePin(null);
      setError(null);
    },
    [handleFail, onCreateConfirm, onVerify, pendingCreatePin, t, triggerHaptic],
  );

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= PIN_MAX_LENGTH) return;
      const next = `${pin}${digit}`.slice(0, PIN_MAX_LENGTH);
      triggerHaptic();
      setError(null);
      setPin(next);
    },
    [pin, triggerHaptic],
  );

  const handleConfirm = useCallback(() => {
    if (pin.length < PIN_MIN_LENGTH || pin.length > PIN_MAX_LENGTH) {
      handleFail(t("settings.pin.error.invalidFormat"));
      return;
    }
    if (mode === "verify") commitVerify(pin);
    else commitCreate(pin);
  }, [commitCreate, commitVerify, handleFail, mode, pin, t]);

  const handleBackspace = useCallback(() => {
    triggerHaptic();
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  }, [triggerHaptic]);

  const handleClose = useCallback(() => {
    resetState();
    setPendingCreatePin(null);
    onClose();
  }, [onClose, resetState]);

  const canConfirm =
    pin.length >= PIN_MIN_LENGTH && pin.length <= PIN_MAX_LENGTH;

  return (
    <Dialog open={open} onClose={handleClose} className="max-w-sm text-center">
      <DialogHeader className="text-center">
        <DialogTitle className="text-center">{effectiveTitle}</DialogTitle>
        <DialogDescription className="text-center">
          {effectiveDescription}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center gap-5 py-2">
        <PinDots
          value={pin}
          length={PIN_LENGTH}
          hasError={Boolean(error)}
          shakeKey={shakeKey}
        />
        {error ? (
          <p className="min-h-5 text-body-sm text-danger">{error}</p>
        ) : (
          <p className="min-h-5 text-body-sm text-text-tertiary">
            {isConfirmStep
              ? t("settings.pin.confirm.hint")
              : t("settings.pin.verify.hint")}
          </p>
        )}

        <div className="grid w-full max-w-[260px] grid-cols-3 place-items-center gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
            <NumpadButton
              key={digit}
              label={digit}
              onPress={() => handleDigit(digit)}
            />
          ))}
          <span className="h-14 w-14" aria-hidden="true" />
          <NumpadButton label="0" onPress={() => handleDigit("0")} />
          <button
            type="button"
            aria-label={t("settings.pin.backspace")}
            onClick={handleBackspace}
            className="flex h-14 w-14 items-center justify-center rounded-full text-text-secondary transition-colors duration-fast hover:bg-surface-hover active:scale-[0.98]"
          >
            <LuDelete size={22} />
          </button>
        </div>

        <div className="flex w-full gap-3 pt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            className="flex-1"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm}
            className="flex-1"
          >
            {t("common.confirm")}
          </Button>
        </div>
      </div>

      <style>{`@keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }`}</style>
    </Dialog>
  );
}

export const SETTINGS_PIN_LENGTH = PIN_MIN_LENGTH;
export const SETTINGS_PIN_MIN_LENGTH = PIN_MIN_LENGTH;
export const SETTINGS_PIN_MAX_LENGTH = PIN_MAX_LENGTH;

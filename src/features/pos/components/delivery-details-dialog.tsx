import { useEffect, type RefObject } from "react";
import { LuBike, LuKeyboard } from "react-icons/lu";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { SelectionChip } from "@/shared/components/ui/selection-chip";
import { Label } from "@/shared/components/ui/label";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { AlphanumericKeypad } from "@/shared/components/ui/alphanumeric-keypad";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  deliveryPlatforms: string[];
  deliveryPlatform: string;
  deliveryOrderNumber: string;
  isDeliveryKeypadOpen: boolean;
  isDeviceKeyboardEnabled: boolean;
  deliveryOrderInputRef: RefObject<HTMLInputElement | null>;
  onDeliveryPlatformChange: (platform: string) => void;
  onDeliveryOrderNumberChange: (orderNumber: string) => void;
  onOpenCustomKeypad: () => void;
  onOpenDeviceKeyboard: () => void;
  onCloseKeypad: () => void;
}

export function DeliveryDetailsDialog({
  open,
  onClose,
  deliveryPlatforms,
  deliveryPlatform,
  deliveryOrderNumber,
  isDeliveryKeypadOpen,
  isDeviceKeyboardEnabled,
  deliveryOrderInputRef,
  onDeliveryPlatformChange,
  onDeliveryOrderNumberChange,
  onOpenCustomKeypad,
  onOpenDeviceKeyboard,
  onCloseKeypad,
}: Props) {
  const { t } = useTranslation();
  const hasSelectedPlatform = deliveryPlatform.trim().length > 0;
  const hasOrderNumber = deliveryOrderNumber.trim().length > 0;
  const summaryText = hasSelectedPlatform
    ? hasOrderNumber
      ? `${deliveryPlatform.trim()} • ${deliveryOrderNumber.trim()}`
      : deliveryPlatform.trim()
    : t("pos.deliveryDialog.platformRequired");

  useEffect(() => {
    if (!open || !isDeviceKeyboardEnabled) return;

    const timeoutId = window.setTimeout(() => {
      deliveryOrderInputRef.current?.focus();
      deliveryOrderInputRef.current?.select();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [deliveryOrderInputRef, isDeviceKeyboardEnabled, open]);

  const handlePlatformSelect = (platform: string) => {
    onDeliveryPlatformChange(platform);
    onOpenCustomKeypad();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={cn(isDeliveryKeypadOpen ? "max-w-5xl" : "max-w-lg")}
    >
      <DialogHeader>
        <DialogTitle>{t("pos.orderType.delivery")}</DialogTitle>
        <DialogDescription>
          {t("pos.deliveryDialog.description")}
        </DialogDescription>
      </DialogHeader>

      <div
        className={cn(
          "page-stack-tight",
          isDeliveryKeypadOpen &&
            "grid grid-cols-1 items-start gap-4 lg:grid-cols-[minmax(0,1fr)_380px]",
        )}
      >
        <div className={cn("page-stack-tight min-w-0", isDeliveryKeypadOpen && "lg:gap-4")}> 
          <div>
            <Label className="mb-2 uppercase tracking-[0.08em] text-text-tertiary">
              {t("pos.cart.deliveryPlatform")}
            </Label>
            <div className="grid grid-cols-2 gap-3">
              {deliveryPlatforms.map((platform) => (
                <SelectionChip
                  key={platform}
                  active={deliveryPlatform === platform}
                  onClick={() => handlePlatformSelect(platform)}
                  className="justify-center text-center"
                >
                  {platform}
                </SelectionChip>
              ))}
            </div>
            {!hasSelectedPlatform && (
                <p className="mt-2 text-label text-danger">
                  {t("pos.deliveryDialog.platformRequired")}
                </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="deliveryOrderNumberDialog">
                {t("pos.cart.deliveryOrderNumber")}
              </Label>
              <span className="text-label text-text-tertiary">
                {t("pos.deliveryDialog.optional")}
              </span>
            </div>

            {isDeviceKeyboardEnabled ? (
              <input
                id="deliveryOrderNumberDialog"
                ref={deliveryOrderInputRef}
                value={deliveryOrderNumber}
                onChange={(event) =>
                  onDeliveryOrderNumberChange(event.target.value.slice(0, 24))
                }
                onBlur={onCloseKeypad}
                inputMode="text"
                autoComplete="off"
                autoFocus
                className="mt-1 h-input-height w-full rounded-input border border-input-border bg-input-bg px-input-padding-x font-mono text-input text-text-primary tabular-nums outline-none transition-colors duration-[var(--motion-fast)] placeholder:text-input-placeholder focus:border-input-border-focus focus:ring-2 focus:ring-accent/25"
                placeholder={t("pos.cart.deliveryOrderNumberPlaceholder")}
              />
            ) : (
              <button
                id="deliveryOrderNumberDialog"
                type="button"
                onClick={onOpenCustomKeypad}
                aria-haspopup="dialog"
                aria-expanded={isDeliveryKeypadOpen}
                className="mt-1 flex h-input-height w-full items-center justify-between gap-3 rounded-input border border-input-border bg-input-bg px-input-padding-x text-left text-input-text transition-colors duration-[var(--motion-fast)] focus:border-input-border-focus focus:outline-none focus:ring-2 focus:ring-accent/25"
              >
                <span
                  className={
                    deliveryOrderNumber
                      ? "font-mono text-input tabular-nums text-text-primary"
                      : "text-input text-input-placeholder"
                  }
                >
                  {deliveryOrderNumber ||
                    t("pos.cart.deliveryOrderNumberPlaceholder")}
                </span>
                <LuKeyboard className="h-5 w-5 shrink-0 text-text-tertiary" />
              </button>
            )}

            <p className="mt-2 text-label text-text-tertiary">
              {t("pos.cart.deliveryOrderNumberHelp")}
            </p>
          </div>

          <div>
            <Card variant="muted" padding="sm" className="flex items-center gap-2 text-body-sm text-text-secondary">
              <LuBike className="h-4 w-4 shrink-0 text-text-tertiary" />
              <span>{summaryText}</span>
            </Card>
          </div>
        </div>

        {isDeliveryKeypadOpen && (
          <div className="min-w-0 lg:sticky lg:top-0">
            <AlphanumericKeypad
              value={deliveryOrderNumber}
              onChange={onDeliveryOrderNumberChange}
              onDone={onClose}
              onRequestDeviceKeyboard={onOpenDeviceKeyboard}
            />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          {t("common.close")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

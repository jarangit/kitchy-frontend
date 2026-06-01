import type { RefObject } from "react";
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={cn(isDeliveryKeypadOpen ? "max-w-5xl" : "max-w-lg")}
    >
      <DialogHeader>
        <DialogTitle>{t("pos.orderType.delivery")}</DialogTitle>
        <DialogDescription>
          {t("pos.payment.selectPlatformFirst")}
        </DialogDescription>
      </DialogHeader>

      <div
        className={cn(
          "space-y-5",
          isDeliveryKeypadOpen &&
            "space-y-0 lg:grid lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start lg:gap-6",
        )}
      >
        <div className="min-w-0 space-y-5">
          <div>
            <p className="mb-3 text-label uppercase tracking-[0.08em] text-text-tertiary">
              {t("pos.cart.deliveryPlatform")}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {deliveryPlatforms.map((platform) => (
                <SelectionChip
                  key={platform}
                  active={deliveryPlatform === platform}
                  onClick={() => onDeliveryPlatformChange(platform)}
                  className="justify-center text-center"
                >
                  {platform}
                </SelectionChip>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="deliveryOrderNumberDialog">
              {t("pos.cart.deliveryOrderNumber")}
            </Label>

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

          <div className="flex items-center gap-2 rounded-card border border-card-border bg-surface px-3 py-3 text-body-sm text-text-secondary">
            <LuBike className="h-4 w-4 shrink-0 text-text-tertiary" />
            <span>
              {deliveryPlatform.trim().length > 0
                ? deliveryOrderNumber.trim().length > 0
                  ? `${deliveryPlatform.trim()} • ${deliveryOrderNumber.trim()}`
                  : deliveryPlatform.trim()
                : t("pos.payment.selectPlatformFirst")}
            </span>
          </div>
        </div>

        {isDeliveryKeypadOpen && (
          <div className="min-w-0 lg:sticky lg:top-0">
            <AlphanumericKeypad
              value={deliveryOrderNumber}
              onChange={onDeliveryOrderNumberChange}
              onDone={onCloseKeypad}
              onRequestDeviceKeyboard={onOpenDeviceKeyboard}
            />
          </div>
        )}
      </div>

      <DialogFooter>
        <Button variant="secondary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button onClick={onClose}>{t("common.confirm")}</Button>
      </DialogFooter>
    </Dialog>
  );
}

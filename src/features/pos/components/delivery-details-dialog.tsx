import { useEffect, type RefObject } from "react";
import { LuBike, LuKeyboard, LuX } from "react-icons/lu";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { SelectionChip } from "@/shared/components/ui/selection-chip";
import { Label } from "@/shared/components/ui/label";
import { Card } from "@/shared/components/ui/card";
import { AlphanumericKeypad } from "@/shared/components/ui/alphanumeric-keypad";
import { Button } from "@/shared/components/ui/button";
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
  autoOpenOrderNumberOnPlatformSelect?: boolean;
  onKeypadDone?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
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
  autoOpenOrderNumberOnPlatformSelect = true,
  onKeypadDone,
  onConfirm,
  confirmLabel,
}: Props) {
  const { t } = useTranslation();
  const hasSelectedPlatform = deliveryPlatform.trim().length > 0;
  const hasOrderNumber = deliveryOrderNumber.trim().length > 0;
  const platformHelpId = "delivery-platform-help";
  const orderNumberInputId = "deliveryOrderNumberDialog";
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
    if (autoOpenOrderNumberOnPlatformSelect) {
      onOpenCustomKeypad();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className={cn(isDeliveryKeypadOpen ? "max-w-5xl" : "max-w-lg")}
    >
      <DialogHeader className="flex flex-row items-start justify-between gap-3">
        <div>
          <DialogTitle>{t("pos.orderType.delivery")}</DialogTitle>
          <DialogDescription>
            {t("pos.deliveryDialog.description")}
          </DialogDescription>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="mt-0.5 shrink-0 rounded-full p-1 text-text-tertiary transition-colors duration-[var(--motion-fast)] hover:bg-surface hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
        >
          <LuX size={18} />
        </button>
      </DialogHeader>

      <div
        className={cn(
          isDeliveryKeypadOpen
            ? "grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_360px]"
            : "page-stack-tight",
        )}
      >
        <div
          className={cn(
            "page-stack-tight min-w-0",
            isDeliveryKeypadOpen && "md:gap-4",
          )}
        >
          <Card variant="default" padding="sm" className="page-stack-tight">
            <div className="flex items-center justify-between gap-3">
              <Label className="uppercase tracking-[0.08em] text-text-tertiary">
                {t("pos.cart.deliveryPlatform")}
              </Label>
              <span className="text-label text-text-tertiary">
                {hasSelectedPlatform
                  ? deliveryPlatform.trim()
                  : t("pos.deliveryDialog.platformRequired")}
              </span>
            </div>

            <div
              role="radiogroup"
              aria-label={t("pos.cart.deliveryPlatform")}
              aria-describedby={
                !hasSelectedPlatform ? platformHelpId : undefined
              }
              className="grid grid-cols-3 gap-3"
            >
              {deliveryPlatforms.map((platform) => {
                const selected = deliveryPlatform === platform;

                return (
                  <SelectionChip
                    key={platform}
                    active={selected}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handlePlatformSelect(platform)}
                    className={cn(
                      "h-16 justify-center text-center",
                      selected && "ring-2 ring-accent/20",
                    )}
                  >
                    {platform}
                  </SelectionChip>
                );
              })}
            </div>

            {!hasSelectedPlatform && (
              <p id={platformHelpId} className="text-label text-danger">
                {t("pos.deliveryDialog.platformRequired")}
              </p>
            )}
          </Card>

          {hasSelectedPlatform && !isDeliveryKeypadOpen && (
            <Card variant="muted" padding="sm" className="page-stack-tight">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor={orderNumberInputId}>
                  {t("pos.cart.deliveryOrderNumber")}
                </Label>
                <span className="text-label text-text-tertiary">
                  {t("pos.deliveryDialog.optional")}
                </span>
              </div>

              {isDeviceKeyboardEnabled ? (
                <input
                  id={orderNumberInputId}
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
                  id={orderNumberInputId}
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
            </Card>
          )}

          <Card
            variant="muted"
            padding="sm"
            className={cn(
              "flex items-center gap-2",
              hasSelectedPlatform &&
                hasOrderNumber &&
                "border-success-border bg-success-bg",
            )}
          >
            <LuBike
              className={cn(
                "h-4 w-4 shrink-0",
                hasSelectedPlatform && hasOrderNumber
                  ? "text-success"
                  : "text-text-tertiary",
              )}
            />
            <span
              className={cn(
                "text-body-sm",
                hasSelectedPlatform && hasOrderNumber
                  ? "text-success"
                  : "text-text-secondary",
              )}
            >
              {summaryText}
            </span>
            {hasSelectedPlatform && hasOrderNumber && (
              <span className="ml-auto rounded-full border border-success-border bg-success-bg px-2 py-0.5 text-caption text-success">
                พร้อม
              </span>
            )}
          </Card>
        </div>

        {isDeliveryKeypadOpen && (
          <div className="min-w-0 self-start md:sticky md:top-0">
            <AlphanumericKeypad
              value={deliveryOrderNumber}
              onChange={onDeliveryOrderNumberChange}
              onDone={onKeypadDone ?? onClose}
              onRequestDeviceKeyboard={onOpenDeviceKeyboard}
              label={t("pos.cart.deliveryOrderNumber")}
              placeholder={t("pos.cart.deliveryOrderNumberPlaceholder")}
            />
          </div>
        )}
      </div>

      {onConfirm && (
        <div className="mt-5 flex justify-end">
          <Button
            type="button"
            onClick={onConfirm}
            disabled={!hasSelectedPlatform}
          >
            {confirmLabel ?? t("common.confirm")}
          </Button>
        </div>
      )}
    </Dialog>
  );
}

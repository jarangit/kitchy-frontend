import { useEffect, type RefObject } from "react";
import { LuBike, LuCheck, LuKeyboard, LuSparkles, LuX } from "react-icons/lu";
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
import { getDeliveryPlatformBrand } from "@/shared/utils/delivery-platform-brands";
import { cn } from "@/shared/utils/cn";

interface Props {
  open: boolean;
  onClose: () => void;
  deliveryPlatforms: string[];
  deliveryPlatform: string;
  deliveryOrderNumber: string;
  suggestedDeliveryOrderNumber?: string | null;
  customerName: string;
  isDeliveryKeypadOpen: boolean;
  isDeviceKeyboardEnabled: boolean;
  deliveryOrderInputRef: RefObject<HTMLInputElement | null>;
  onDeliveryPlatformChange: (platform: string) => void;
  onDeliveryOrderNumberChange: (orderNumber: string) => void;
  onCustomerNameChange: (name: string) => void;
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
  suggestedDeliveryOrderNumber,
  customerName,
  isDeliveryKeypadOpen,
  isDeviceKeyboardEnabled,
  deliveryOrderInputRef,
  onDeliveryPlatformChange,
  onDeliveryOrderNumberChange,
  onCustomerNameChange,
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
  const customerNameInputId = "customerNameDialog";
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
          className="mt-0.5 shrink-0 rounded-full p-1 text-text-tertiary transition-colors duration-fast hover:bg-surface hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
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
              <Label className="uppercase tracking-widest text-text-tertiary">
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
                const brand = getDeliveryPlatformBrand(platform);

                return (
                  <SelectionChip
                    key={platform}
                    active={selected}
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handlePlatformSelect(platform)}
                    style={
                      brand
                        ? {
                            backgroundColor: brand.brandColor,
                            color: brand.onColor,
                            borderColor: "transparent",
                            boxShadow: selected
                              ? `inset 0 0 0 2px ${brand.onColor}, 0 0 0 3px rgba(0,0,0,0.35)`
                              : undefined,
                          }
                        : undefined
                    }
                    className={cn(
                      "relative h-16 justify-center text-center",
                      brand && "font-medium",
                      selected && !brand && "ring-2 ring-accent/20",
                      brand && !selected && "opacity-85 hover:opacity-100",
                      selected && "scale-[1.03]",
                    )}
                  >
                    {platform}
                    {selected && (
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full",
                          brand ? "" : "bg-accent text-on-accent",
                        )}
                        style={
                          brand
                            ? {
                                backgroundColor: brand.onColor,
                                color: brand.brandColor,
                              }
                            : undefined
                        }
                      >
                        <LuCheck size={13} strokeWidth={3.5} />
                      </span>
                    )}
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
                <Label htmlFor={customerNameInputId}>
                  {t("pos.cart.customerName")}
                </Label>
                <span className="text-label text-text-tertiary">
                  {t("pos.deliveryDialog.optional")}
                </span>
              </div>
              <input
                id={customerNameInputId}
                value={customerName}
                onChange={(event) =>
                  onCustomerNameChange(event.target.value.slice(0, 40))
                }
                inputMode="text"
                autoComplete="name"
                className="mt-1 h-input-height w-full rounded-input border border-input-border bg-input-bg px-input-padding-x text-input text-text-primary outline-none transition-colors duration-fast placeholder:text-input-placeholder focus:border-input-border-focus focus:ring-2 focus:ring-accent/25"
                placeholder={t("pos.deliveryDialog.customerNamePlaceholder")}
              />

              <div className="mt-4 flex items-center justify-between gap-3">
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
                  className="mt-1 h-input-height w-full rounded-input border border-input-border bg-input-bg px-input-padding-x font-mono text-input text-text-primary tabular-nums outline-none transition-colors duration-fast placeholder:text-input-placeholder focus:border-input-border-focus focus:ring-2 focus:ring-accent/25"
                  placeholder={t("pos.cart.deliveryOrderNumberPlaceholder")}
                />
              ) : (
                <button
                  id={orderNumberInputId}
                  type="button"
                  onClick={onOpenCustomKeypad}
                  aria-haspopup="dialog"
                  aria-expanded={isDeliveryKeypadOpen}
                  className="mt-1 flex h-input-height w-full items-center justify-between gap-3 rounded-input border border-input-border bg-input-bg px-input-padding-x text-left text-input-text transition-colors duration-fast focus:border-input-border-focus focus:outline-none focus:ring-2 focus:ring-accent/25"
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

              {suggestedDeliveryOrderNumber &&
                suggestedDeliveryOrderNumber !== deliveryOrderNumber && (
                  <button
                    type="button"
                    onClick={() =>
                      onDeliveryOrderNumberChange(suggestedDeliveryOrderNumber)
                    }
                    className="mt-2 inline-flex items-center gap-1.5 self-start rounded-full border border-accent-border bg-accent-bg px-3 py-1 text-label font-medium text-accent-text transition-colors duration-fast hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                  >
                    <LuSparkles size={14} />
                    {t("pos.cart.deliveryOrderNumberSuggest", {
                      number: suggestedDeliveryOrderNumber,
                    })}
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
            {suggestedDeliveryOrderNumber &&
              suggestedDeliveryOrderNumber !== deliveryOrderNumber && (
                <button
                  type="button"
                  onClick={() =>
                    onDeliveryOrderNumberChange(suggestedDeliveryOrderNumber)
                  }
                  className="mb-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-accent-border bg-accent-bg px-3 py-2 text-label font-medium text-accent-text transition-colors duration-fast hover:bg-accent/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <LuSparkles size={14} />
                  {t("pos.cart.deliveryOrderNumberSuggest", {
                    number: suggestedDeliveryOrderNumber,
                  })}
                </button>
              )}
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

      {onConfirm && !isDeliveryKeypadOpen && (
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

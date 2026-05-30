import { useEffect, useMemo, useRef, useState } from "react";
import type { ICartItem } from "@/features/pos/types/pos.model";
import type { OrderType } from "@/features/pos/types/pos.model";
import { LuKeyboard, LuShoppingCart } from "react-icons/lu";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";
import TablePickerDialog from "./table-picker-dialog";
import ItemNoteDialog from "./item-note-dialog";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useTranslation } from "@/shared/i18n/use-translation";
import { SelectionChip } from "@/shared/components/ui/selection-chip";
import { Label } from "@/shared/components/ui/label";
import { AlphanumericKeypad } from "@/shared/components/ui/alphanumeric-keypad";
import { getDefaultDeliveryPlatforms, getDefaultQuickNotes } from "@/shared/i18n/presets";

const ORDER_TYPE_VALUES: OrderType[] = ["DINE_IN", "TOGO", "DELIVERY"];

const ORDER_TYPE_LABEL_KEYS = {
  DINE_IN: "pos.orderType.dine_in",
  TOGO: "pos.orderType.togo",
  DELIVERY: "pos.orderType.delivery",
} as const;

const hasQuickNotes = (value: unknown): value is string[] => {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
};

const hasEnabledPlatforms = (
  value: string[] | { enabledPlatforms?: string[] }
): value is { enabledPlatforms: string[] } => {
  return !Array.isArray(value) && Array.isArray(value.enabledPlatforms);
};

interface Props {
  items: ICartItem[];
  subtotal: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onUpdateItemNote: (productId: string, note: string) => void;
  onClearCart: () => void;
  onPay: () => void;
  orderType: OrderType;
  tableNumber: string | null;
  deliveryPlatform: string;
  deliveryOrderNumber: string;
  onOrderTypeChange: (type: OrderType) => void;
  onTableNumberChange: (tableNumber: string | null) => void;
  onDeliveryPlatformChange: (platform: string) => void;
  onDeliveryOrderNumberChange: (orderNumber: string) => void;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-3 text-label uppercase tracking-[0.08em] text-text-tertiary">
    {children}
  </p>
);

const CartArea = ({
  items,
  subtotal,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateItemNote,
  onClearCart,
  onPay,
  orderType,
  tableNumber,
  deliveryPlatform,
  deliveryOrderNumber,
  onOrderTypeChange,
  onTableNumberChange,
  onDeliveryPlatformChange,
  onDeliveryOrderNumberChange,
}: Props) => {
  const { t, language } = useTranslation();
  const defaultDeliveryPlatforms = useMemo(
    () => getDefaultDeliveryPlatforms(language),
    [language]
  );
  const defaultQuickNotes = useMemo(() => getDefaultQuickNotes(language), [language]);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [activeNoteItem, setActiveNoteItem] = useState<ICartItem | null>(null);
  const [deliveryPlatforms, setDeliveryPlatforms] = useState(
    defaultDeliveryPlatforms
  );
  const [quickNotes, setQuickNotes] = useState(defaultQuickNotes);
  const [isDeliveryKeypadOpen, setIsDeliveryKeypadOpen] = useState(false);
  const [isDeviceKeyboardEnabled, setIsDeviceKeyboardEnabled] = useState(false);
  const deliveryOrderInputRef = useRef<HTMLInputElement | null>(null);

  const deliverySettingsKey = useMemo(
    () => `store:${window.location.pathname.split("/")[2]}:delivery-platforms`,
    []
  );
  const quickNotesSettingsKey = useMemo(
    () => `store:${window.location.pathname.split("/")[2]}:quick-notes`,
    []
  );

  useEffect(() => {
    setDeliveryPlatforms(defaultDeliveryPlatforms);
  }, [defaultDeliveryPlatforms]);

  useEffect(() => {
    setQuickNotes(defaultQuickNotes);
  }, [defaultQuickNotes]);

  useEffect(() => {
    const stored = localStorage.getItem(deliverySettingsKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as
        | string[]
        | { enabledPlatforms?: string[] };
      if (Array.isArray(parsed) && parsed.length > 0) {
        setDeliveryPlatforms(parsed);
        return;
      }

      if (hasEnabledPlatforms(parsed) && parsed.enabledPlatforms.length > 0) {
        setDeliveryPlatforms(parsed.enabledPlatforms);
      }
    } catch {
      localStorage.removeItem(deliverySettingsKey);
    }
  }, [deliverySettingsKey]);

  useEffect(() => {
    const stored = localStorage.getItem(quickNotesSettingsKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as unknown;
      if (hasQuickNotes(parsed) && parsed.length > 0) {
        setQuickNotes(parsed);
      }
    } catch {
      localStorage.removeItem(quickNotesSettingsKey);
    }
  }, [quickNotesSettingsKey]);

  const handleOrderTypeChange = (nextType: OrderType) => {
    onOrderTypeChange(nextType);
    if (nextType === "DINE_IN") {
      setIsTableDialogOpen(true);
    }
    if (nextType !== "DELIVERY") {
      setIsDeliveryKeypadOpen(false);
      setIsDeviceKeyboardEnabled(false);
    }
  };

  const openDeviceKeyboard = () => {
    setIsDeliveryKeypadOpen(false);
    setIsDeviceKeyboardEnabled(true);
    window.setTimeout(() => deliveryOrderInputRef.current?.focus(), 0);
  };

  const openCustomKeypad = () => {
    setIsDeviceKeyboardEnabled(false);
    setIsDeliveryKeypadOpen((current) => !current);
  };

  return (
    <div className="flex h-full w-full flex-col bg-card-bg border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <div className="flex items-center gap-3">
          <h2 className="text-title text-text-primary">{t("pos.cart.title")}</h2>
          {totalItems > 0 && (
            <span className="inline-flex min-w-6 h-6 items-center justify-center rounded-full bg-accent px-2 text-label font-semibold text-on-accent tabular-nums">
              {totalItems}
            </span>
          )}
        </div>
        {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearCart}
              className="text-danger hover:text-danger-hover"
            >
            {t("pos.cart.clearAll")}
          </Button>
        )}
      </div>

      {/* Scroll region */}
      <div className="flex-1 overflow-y-auto">
        {/* Order config */}
         <div className="space-y-6 border-b border-border px-6 py-6">
          <div>
            <SectionLabel>{t("pos.cart.orderType")}</SectionLabel>
            <div className="grid grid-cols-3 gap-3">
              {ORDER_TYPE_VALUES.map((value) => (
                <SelectionChip
                  key={value}
                  active={orderType === value}
                  onClick={() => handleOrderTypeChange(value)}
                >
                  {t(ORDER_TYPE_LABEL_KEYS[value])}
                </SelectionChip>
              ))}
            </div>
          </div>

          {orderType === "DINE_IN" && (
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <SectionLabel>{t("pos.cart.table")}</SectionLabel>
                <p className="text-body font-semibold text-text-primary truncate">
                  {tableNumber ?? t("pos.cart.tableNotSelected")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                {tableNumber && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => onTableNumberChange(null)}
                  >
                    {t("common.clear")}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsTableDialogOpen(true)}
                >
                  {t("pos.cart.selectTable")}
                </Button>
              </div>
            </div>
          )}

          {orderType === "DELIVERY" && (
            <div className="space-y-5">
              <div>
                <SectionLabel>{t("pos.cart.deliveryPlatform")}</SectionLabel>
                <div className="grid grid-cols-2 gap-3">
                  {deliveryPlatforms.map((platform) => (
                    <SelectionChip
                      key={platform}
                      active={deliveryPlatform === platform}
                      onClick={() => onDeliveryPlatformChange(platform)}
                    >
                      {platform}
                    </SelectionChip>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryOrderNumber">
                  {t("pos.cart.deliveryOrderNumber")}
                </Label>
                {isDeviceKeyboardEnabled ? (
                  <input
                    id="deliveryOrderNumber"
                    ref={deliveryOrderInputRef}
                    value={deliveryOrderNumber}
                    onChange={(event) =>
                      onDeliveryOrderNumberChange(event.target.value.slice(0, 24))
                    }
                    onBlur={() => setIsDeviceKeyboardEnabled(false)}
                    inputMode="text"
                    autoComplete="off"
                    className="mt-1 h-input-height w-full rounded-input border border-input-border bg-input-bg px-input-padding-x font-mono text-input text-text-primary tabular-nums outline-none transition-colors duration-[var(--motion-fast)] placeholder:text-input-placeholder focus:border-input-border-focus focus:ring-2 focus:ring-accent/25"
                    placeholder={t("pos.cart.deliveryOrderNumberPlaceholder")}
                  />
                ) : (
                  <button
                    id="deliveryOrderNumber"
                    type="button"
                    onClick={openCustomKeypad}
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
                <p className="mt-2 text-caption leading-5 text-text-tertiary">
                  {t("pos.cart.deliveryOrderNumberHelp")}
                </p>
                {isDeliveryKeypadOpen && (
                  <div className="mt-3">
                    <AlphanumericKeypad
                      value={deliveryOrderNumber}
                      onChange={onDeliveryOrderNumberChange}
                      onDone={() => setIsDeliveryKeypadOpen(false)}
                      onRequestDeviceKeyboard={openDeviceKeyboard}
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Items */}
         <div className="px-6 pt-5 pb-3">
          {items.length === 0 ? (
            <EmptyState
              icon={<LuShoppingCart size={32} />}
              title={t("pos.cart.emptyTitle")}
              description={t("pos.cart.emptyDescription")}
              className="py-10"
            />
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                  onEditNote={() => setActiveNoteItem(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary + Pay */}
      <div className="space-y-5 border-t border-border bg-card-bg px-6 pb-6 pt-5">
        {items.length > 0 && <CartSummary subtotal={subtotal} />}
        <Button
          onClick={onPay}
          disabled={items.length === 0}
          size="lg"
          data-onboarding-target="pay-button"
          className="w-full text-title tabular-nums"
        >
          {t("pos.cart.pay", { amount: `฿${subtotal.toFixed(2)}` })}
        </Button>
      </div>

      <TablePickerDialog
        open={isTableDialogOpen}
        onClose={() => setIsTableDialogOpen(false)}
        tableNumber={tableNumber}
        onSelect={onTableNumberChange}
      />

      <ItemNoteDialog
        item={activeNoteItem}
        onClose={() => setActiveNoteItem(null)}
        onSave={onUpdateItemNote}
        quickNotes={quickNotes}
      />
    </div>
  );
};

export default CartArea;

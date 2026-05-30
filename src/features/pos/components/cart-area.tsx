import { useEffect, useMemo, useRef, useState } from "react";
import type { ICartItem } from "@/features/pos/types/pos.model";
import type { OrderType } from "@/features/pos/types/pos.model";
import {
  LuBike,
  LuChevronDown,
  LuChevronUp,
  LuKeyboard,
  LuPackage,
  LuShoppingCart,
  LuTableProperties,
  LuUtensilsCrossed,
  LuX,
} from "react-icons/lu";
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

const ORDER_TYPE_ICONS = {
  DINE_IN: LuUtensilsCrossed,
  TOGO: LuPackage,
  DELIVERY: LuBike,
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
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onUpdateItemNote: (cartItemId: string, note: string) => void;
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
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);
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

  const ActiveOrderTypeIcon = ORDER_TYPE_ICONS[orderType];
  const orderTypeLabel = t(ORDER_TYPE_LABEL_KEYS[orderType]);
  const deliveryOrderNumberValue = deliveryOrderNumber.trim();
  const summaryParts = [orderTypeLabel];

  if (orderType === "DINE_IN") {
    summaryParts.push(tableNumber ?? t("pos.cart.tableNotSelected"));
  }

  if (orderType === "DELIVERY") {
    if (deliveryPlatform.trim().length > 0) {
      summaryParts.push(deliveryPlatform.trim());
    }
    if (deliveryOrderNumberValue.length > 0) {
      summaryParts.push(deliveryOrderNumberValue);
    }
  }

  return (
    <div className="flex h-full max-h-full w-full min-h-0 flex-col overflow-hidden border-l border-border bg-card-bg">
      <div className="shrink-0 border-b border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-body font-medium text-text-primary">
            <ActiveOrderTypeIcon className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden="true" />
            <p className="truncate">{summaryParts.join(" • ")}</p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsConfigExpanded((current) => !current)}
            aria-label={t("common.edit")}
            title={t("common.edit")}
            className="shrink-0"
          >
            <span>{t("common.edit")}</span>
            {isConfigExpanded ? <LuChevronUp className="h-4 w-4" aria-hidden="true" /> : <LuChevronDown className="h-4 w-4" aria-hidden="true" />}
          </Button>
        </div>

        {isConfigExpanded && (
          <div className="mt-4 space-y-5">
            <div>
              <SectionLabel>{t("pos.cart.orderType")}</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                {ORDER_TYPE_VALUES.map((value) => {
                  const Icon = ORDER_TYPE_ICONS[value];
                  const label = t(ORDER_TYPE_LABEL_KEYS[value]);

                  return (
                    <SelectionChip
                      key={value}
                      active={orderType === value}
                      onClick={() => handleOrderTypeChange(value)}
                      className="justify-center px-0"
                      aria-label={label}
                      title={label}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="sr-only">{label}</span>
                    </SelectionChip>
                  );
                })}
              </div>
            </div>

            {orderType === "DINE_IN" && (
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex min-w-0 items-center gap-2 text-body font-semibold text-text-primary">
                  <LuTableProperties className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden="true" />
                  <p className="truncate">{tableNumber ?? t("pos.cart.tableNotSelected")}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {tableNumber && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onTableNumberChange(null)}
                      aria-label={t("common.clear")}
                      title={t("common.clear")}
                    >
                      <LuX className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    onClick={() => setIsTableDialogOpen(true)}
                    aria-label={t("pos.cart.selectTable")}
                    title={t("pos.cart.selectTable")}
                  >
                    <LuTableProperties className="h-4 w-4" aria-hidden="true" />
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
                        className="justify-center text-center"
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

            {items.length > 0 && (
              <div className="flex justify-end border-t border-border pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onClearCart}
                  className="text-danger hover:bg-danger-bg hover:text-danger"
                >
                  {t("pos.cart.clearAll")}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto bg-card-bg p-4 pb-28">
        {items.length === 0 ? (
          <EmptyState
            icon={<LuShoppingCart size={32} />}
            title={t("pos.cart.emptyTitle")}
            description={t("pos.cart.emptyDescription")}
            className="py-10"
          />
        ) : (
            <div className="space-y-3">
              {items.map((item) => (
                <CartItem
                  key={item.cartItemId}
                  item={item}
                  expanded={expandedItemId === item.cartItemId}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                  onEditNote={() => setActiveNoteItem(item)}
                  onToggleExpand={(nextItem) =>
                    setExpandedItemId((current) =>
                      current === nextItem.cartItemId ? null : nextItem.cartItemId
                    )
                  }
                />
              ))}
            </div>
        )}
      </div>

      <div className="z-10 shrink-0 space-y-3 border-t border-border bg-card-bg p-4 shadow-[0_-10px_24px_rgba(15,23,42,0.08)] md:fixed md:bottom-0 md:right-0 md:w-[var(--pos-cart-width)] md:max-w-[var(--pos-cart-width)] md:min-w-[var(--pos-cart-width)] md:border-l md:border-border">
        {items.length > 0 && <CartSummary subtotal={subtotal} totalItems={totalItems} />}
        <Button
          onClick={onPay}
          disabled={items.length === 0}
          size="lg"
          data-onboarding-target="pay-button"
          className="w-full whitespace-normal text-center text-title tabular-nums leading-6"
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

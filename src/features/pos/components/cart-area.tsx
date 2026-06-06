import { useEffect, useMemo, useRef, useState } from "react";
import type { ICartItem } from "@/features/pos/types/pos.model";
import type { OrderType } from "@/features/pos/types/pos.model";
import {
  LuBike,
  LuChevronDown,
  LuChevronUp,
  LuPackage,
  LuShoppingCart,
  LuTableProperties,
  LuUtensilsCrossed,
  LuX,
} from "react-icons/lu";
import CartItem from "./cart-item";
import TablePickerDialog from "./table-picker-dialog";
import ItemNoteDialog from "./item-note-dialog";
import { DeliveryDetailsDialog } from "./delivery-details-dialog";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useTranslation } from "@/shared/i18n/use-translation";
import { SelectionChip } from "@/shared/components/ui/selection-chip";
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
  <p className="mb-2 text-label uppercase tracking-[0.08em] text-text-tertiary">
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
  const [isDeliveryDialogOpen, setIsDeliveryDialogOpen] = useState(false);
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
  const firstDeliveryPlatform = deliveryPlatforms[0] ?? "";

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

  useEffect(() => {
    if (!isDeliveryDialogOpen || !isDeviceKeyboardEnabled) return;

    const timeoutId = window.setTimeout(() => {
      deliveryOrderInputRef.current?.focus();
      deliveryOrderInputRef.current?.select();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isDeliveryDialogOpen, isDeviceKeyboardEnabled]);

  const ensureDeliveryPlatformSelected = () => {
    if (deliveryPlatform.trim().length > 0 || firstDeliveryPlatform.trim().length === 0) {
      return;
    }

    onDeliveryPlatformChange(firstDeliveryPlatform);
  };

  const toggleConfigExpanded = () => {
    setIsConfigExpanded((current) => !current);
  };

  const handleOrderTypeChange = (nextType: OrderType) => {
    onOrderTypeChange(nextType);
    if (nextType === "DINE_IN") {
      setIsTableDialogOpen(true);
    }
    if (nextType === "DELIVERY") {
      ensureDeliveryPlatformSelected();
      setIsDeliveryKeypadOpen(true);
      setIsDeviceKeyboardEnabled(false);
      setIsDeliveryDialogOpen(true);
    }
    if (nextType !== "DELIVERY") {
      setIsDeliveryKeypadOpen(false);
      setIsDeviceKeyboardEnabled(false);
    }
  };

  const openDeviceKeyboard = () => {
    setIsDeliveryKeypadOpen(false);
    setIsDeviceKeyboardEnabled(true);
  };

  const openCustomKeypad = () => {
    setIsDeviceKeyboardEnabled(false);
    setIsDeliveryKeypadOpen(true);
  };

  const closeDeliveryKeypad = () => {
    setIsDeliveryKeypadOpen(false);
    setIsDeviceKeyboardEnabled(false);
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

  const requirementMessage =
    orderType === "DINE_IN" && !tableNumber
      ? t("pos.cart.selectTableBeforePay")
      : orderType === "DELIVERY" && deliveryPlatform.trim().length === 0
        ? t("pos.cart.selectDeliveryPlatformBeforePay")
        : null;
  const canPay = items.length > 0 && requirementMessage === null;
  const openRequirementDialog = () => {
    if (orderType === "DINE_IN" && !tableNumber) {
      setIsTableDialogOpen(true);
      return;
    }

    if (orderType === "DELIVERY" && deliveryPlatform.trim().length === 0) {
      setIsDeliveryDialogOpen(true);
    }
  };

  return (
    <div className="flex h-full max-h-full w-full min-h-0 flex-col overflow-hidden border-l border-border bg-card-bg">
      <div
        className="shrink-0 border-b border-border p-card-padding"
        role="button"
        tabIndex={0}
        aria-expanded={isConfigExpanded}
        onClick={toggleConfigExpanded}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          toggleConfigExpanded();
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2 text-body font-medium text-text-primary">
            <ActiveOrderTypeIcon className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden="true" />
            <p className="truncate">{summaryParts.join(" • ")}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {items.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  onClearCart();
                }}
                className="shrink-0 text-danger hover:bg-danger-bg hover:text-danger"
              >
                {t("pos.cart.clearAll")}
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(event) => {
                event.stopPropagation();
                toggleConfigExpanded();
              }}
              aria-label={t("common.edit")}
              title={t("common.edit")}
              className={isConfigExpanded ? "shrink-0 text-accent-text hover:text-accent-text" : "shrink-0"}
            >
              <span>{t("common.edit")}</span>
              {isConfigExpanded ? <LuChevronUp className="h-4 w-4" aria-hidden="true" /> : <LuChevronDown className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </div>
        </div>

        {isConfigExpanded && (
          <div className="page-stack-tight mt-4">
            <div>
              <SectionLabel>{t("pos.cart.orderType")}</SectionLabel>
              <div className="page-grid grid grid-cols-3">
                {ORDER_TYPE_VALUES.map((value) => {
                  const Icon = ORDER_TYPE_ICONS[value];
                  const label = t(ORDER_TYPE_LABEL_KEYS[value]);

                  return (
                    <SelectionChip
                      key={value}
                      active={orderType === value}
                      onClick={() => handleOrderTypeChange(value)}
                      className="h-auto min-h-16 flex-col gap-1 px-2 py-2"
                      aria-label={label}
                      title={label}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span className="text-label leading-4">{label}</span>
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
              <div className="flex items-center justify-between gap-3">
                <div className="inline-flex min-w-0 items-center gap-2 text-body font-semibold text-text-primary">
                  <LuBike className="h-4 w-4 shrink-0 text-text-tertiary" aria-hidden="true" />
                  <p className="truncate">
                    {deliveryPlatform.trim().length > 0
                      ? deliveryOrderNumberValue.length > 0
                        ? `${deliveryPlatform.trim()} • ${deliveryOrderNumberValue}`
                        : deliveryPlatform.trim()
                      : t("pos.payment.selectPlatformFirst")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {(deliveryPlatform.trim().length > 0 || deliveryOrderNumberValue.length > 0) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        onDeliveryPlatformChange("");
                        onDeliveryOrderNumberChange("");
                        closeDeliveryKeypad();
                      }}
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
                    onClick={() => setIsDeliveryDialogOpen(true)}
                    aria-label={t("common.edit")}
                    title={t("common.edit")}
                  >
                    <LuBike className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>

       <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-card-bg p-card-padding [scrollbar-gutter:stable] [-webkit-overflow-scrolling:touch]">
        {items.length === 0 ? (
          <EmptyState
            icon={<LuShoppingCart size={32} />}
            title={t("pos.cart.emptyTitle")}
            description={t("pos.cart.emptyDescription")}
            className="py-10"
          />
        ) : (
            <div className="page-stack-tight">
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

      <div className="page-stack-tight shadow-cart-dock z-10 shrink-0 border-t border-border bg-card-bg p-card-padding">
        {requirementMessage && items.length > 0 && (
          <button
            type="button"
            onClick={openRequirementDialog}
            className="w-full rounded-card bg-warning-bg px-3 py-2 text-left text-label font-medium text-warning transition-colors duration-[var(--motion-fast)] hover:bg-warning-bg/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-warning/30"
          >
            {requirementMessage}
          </button>
        )}
        <Button
          onClick={onPay}
          disabled={!canPay}
          size="lg"
          data-onboarding-target="pay-button"
          className="w-full whitespace-normal text-center text-title tabular-nums leading-6"
        >
          {`${t("pos.cart.pay", { amount: `฿${subtotal.toFixed(2)}` })} • ${totalItems}`}
        </Button>
      </div>

      <TablePickerDialog
        open={isTableDialogOpen}
        onClose={() => setIsTableDialogOpen(false)}
        tableNumber={tableNumber}
        onSelect={onTableNumberChange}
      />

      <DeliveryDetailsDialog
        open={isDeliveryDialogOpen}
        onClose={() => {
          closeDeliveryKeypad();
          setIsDeliveryDialogOpen(false);
        }}
        deliveryPlatforms={deliveryPlatforms}
        deliveryPlatform={deliveryPlatform}
        deliveryOrderNumber={deliveryOrderNumber}
        isDeliveryKeypadOpen={isDeliveryKeypadOpen}
        isDeviceKeyboardEnabled={isDeviceKeyboardEnabled}
        deliveryOrderInputRef={deliveryOrderInputRef}
        onDeliveryPlatformChange={onDeliveryPlatformChange}
        onDeliveryOrderNumberChange={onDeliveryOrderNumberChange}
        onOpenCustomKeypad={openCustomKeypad}
        onOpenDeviceKeyboard={openDeviceKeyboard}
        onCloseKeypad={closeDeliveryKeypad}
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

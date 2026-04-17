import { useEffect, useMemo, useState } from "react";
import type { ICartItem } from "@/features/pos/types/pos.model";
import type { OrderType } from "@/features/pos/types/pos.model";
import { LuShoppingCart } from "react-icons/lu";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";
import TablePickerDialog from "./table-picker-dialog";
import ItemNoteDialog from "./item-note-dialog";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { useTranslation } from "@/shared/i18n/use-translation";
import { SelectionChip } from "@/shared/components/ui/selection-chip";
import { getDefaultDeliveryPlatforms, getDefaultQuickNotes } from "@/shared/i18n/presets";

const ORDER_TYPE_OPTIONS: { value: OrderType; label: string }[] = [
  { value: "DINE_IN", label: "Dine In" },
  { value: "TOGO", label: "To Go" },
  { value: "DELIVERY", label: "Delivery" },
];

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
  onOrderTypeChange: (type: OrderType) => void;
  onTableNumberChange: (tableNumber: string | null) => void;
  onDeliveryPlatformChange: (platform: string) => void;
}

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
  onOrderTypeChange,
  onTableNumberChange,
  onDeliveryPlatformChange,
}: Props) => {
  const { language } = useTranslation();
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
  };

  return (
    <div className="w-full flex flex-col h-full bg-bg">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <h2 className="text-title text-text-primary">
            Cart
          </h2>
          {totalItems > 0 && (
            <span className="min-w-7 h-7 flex items-center justify-center rounded-radius-full bg-success text-text-inverse text-label font-[var(--weight-semibold)] px-1.5">
              {totalItems}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="h-11 px-3 text-label text-danger hover:text-danger-hover"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="pt-5 pb-4 space-y-4 border-b border-border">
          <div>
            <p className="mb-3 text-label uppercase tracking-wide text-text-tertiary">
              Order Type
            </p>
            <div className="grid grid-cols-3 gap-3">
              {ORDER_TYPE_OPTIONS.map((option) => (
                  <SelectionChip
                    key={option.value}
                    active={orderType === option.value}
                    onClick={() => handleOrderTypeChange(option.value)}
                  >
                    {option.label}
                  </SelectionChip>
                ))}
            </div>
          </div>

          {orderType === "DINE_IN" && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-body font-[var(--weight-semibold)] text-text-primary">
                  Table: {tableNumber ?? "Not selected"}
                </p>
                <div className="flex items-center gap-2">
                  {tableNumber && (
                    <button
                      onClick={() => onTableNumberChange(null)}
                      className="h-11 px-3 text-label text-text-secondary hover:text-text-primary transition-all duration-[var(--motion-fast)] "
                    >
                      Clear
                    </button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-11 px-4 text-label"
                    onClick={() => setIsTableDialogOpen(true)}
                  >
                    Select Table
                  </Button>
                </div>
              </div>
            </div>
          )}

          {orderType === "DELIVERY" && (
        <div className="space-y-5">
              <div>
                <p className="mb-3 text-body font-[var(--weight-semibold)] text-text-primary">
                  Delivery Platform
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {deliveryPlatforms.map((platform) => (
                      <SelectionChip
                        key={platform}
                        active={deliveryPlatform === platform}
                        onClick={() => onDeliveryPlatformChange(platform)}
                        className="text-base"
                      >
                        {platform}
                      </SelectionChip>
                    ))}
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="pt-4">
        {items.length === 0 ? (
          <EmptyState
            icon={<LuShoppingCart size={32} />}
            title="Cart is empty"
            description="Tap a product to add it"
            className="py-8"
          />
        ) : (
          items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
              onEditNote={() => setActiveNoteItem(item)}
            />
          ))
        )}
        </div>
      </div>

      {/* Summary + Pay Button */}
      <div className="px-6 pb-6 space-y-4">
        {items.length > 0 && <CartSummary subtotal={subtotal} />}
        <Button
          onClick={onPay}
          disabled={items.length === 0}
          size="lg"
          className="w-full h-14 text-subtitle"
        >
          Pay ฿{subtotal.toFixed(2)}
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

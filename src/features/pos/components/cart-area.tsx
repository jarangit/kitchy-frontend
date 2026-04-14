import { useEffect, useMemo, useState } from "react";
import type { ICartItem } from "@/features/pos/types/pos.model";
import type { OrderType } from "@/features/pos/types/pos.model";
import { LuShoppingCart } from "react-icons/lu";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/use-translation";
import { getDefaultDeliveryPlatforms, getDefaultQuickNotes } from "@/shared/i18n/presets";

const ORDER_TYPE_OPTIONS: { value: OrderType; label: string }[] = [
  { value: "DINE_IN", label: "Dine In" },
  { value: "TOGO", label: "To Go" },
  { value: "DELIVERY", label: "Delivery" },
];

const TABLE_OPTIONS = Array.from({ length: 20 }, (_, index) => `T${index + 1}`);
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
  const { t, language } = useTranslation();
  const defaultDeliveryPlatforms = useMemo(
    () => getDefaultDeliveryPlatforms(language),
    [language]
  );
  const defaultQuickNotes = useMemo(() => getDefaultQuickNotes(language), [language]);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [activeNoteItem, setActiveNoteItem] = useState<ICartItem | null>(null);
  const [draftNote, setDraftNote] = useState("");
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

  const handleOpenNoteDialog = (item: ICartItem) => {
    setActiveNoteItem(item);
    setDraftNote(item.note ?? "");
  };

  const handleCloseNoteDialog = () => {
    setActiveNoteItem(null);
    setDraftNote("");
  };

  const handleSaveNote = () => {
    if (!activeNoteItem) return;
    onUpdateItemNote(activeNoteItem.productId, draftNote);
    handleCloseNoteDialog();
  };

  const handleToggleCommonNote = (note: string) => {
    const parts = draftNote
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.includes(note)) {
      setDraftNote(parts.filter((part) => part !== note).join(", "));
      return;
    }

    setDraftNote([...parts, note].join(", "));
  };

  return (
    <div className="w-full flex flex-col h-full bg-[var(--color-bg)]">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
            Cart
          </h2>
          {totalItems > 0 && (
            <span className="min-w-[24px] h-6 flex items-center justify-center rounded-full bg-[var(--color-success)] text-[var(--color-text-inverse)] text-xs font-bold px-1.5">
              {totalItems}
            </span>
          )}
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearCart}
            className="text-xs text-[var(--color-danger)] hover:text-[var(--color-danger-hover)]"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-5">
        <div className="pt-4 pb-3 space-y-3 border-b border-[var(--color-border)]">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)] mb-2">
              Order Type
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ORDER_TYPE_OPTIONS.map((option) => {
                const active = orderType === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => handleOrderTypeChange(option.value)}
                    className={`h-11 rounded-lg border text-xs font-semibold transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
                      active
                        ? "border-[var(--color-text-primary)] bg-[var(--color-surface)] text-[var(--color-text-primary)]"
                        : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          {orderType === "DINE_IN" && (
            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[var(--color-text-primary)]">
                  Table: {tableNumber ?? "Not selected"}
                </p>
                <div className="flex items-center gap-2">
                  {tableNumber && (
                    <button
                      onClick={() => onTableNumberChange(null)}
                      className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
                    >
                      Clear
                    </button>
                  )}
                  <Button
                    size="sm"
                    variant="secondary"
                    className="h-9"
                    onClick={() => setIsTableDialogOpen(true)}
                  >
                    Select Table
                  </Button>
                </div>
              </div>
            </div>
          )}

          {orderType === "DELIVERY" && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">
                  Delivery Platform
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {deliveryPlatforms.map((platform) => {
                    const active = deliveryPlatform === platform;
                    return (
                      <button
                        key={platform}
                        onClick={() => onDeliveryPlatformChange(platform)}
                        className={`h-11 rounded-lg border text-sm font-semibold transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
                          active
                            ? "border-[var(--color-primary)] bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                            : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                        }`}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="pt-3">
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
              onEditNote={handleOpenNoteDialog}
            />
          ))
        )}
        </div>
      </div>

      {/* Summary + Pay Button */}
      <div className="px-5 pb-5 space-y-3">
        {items.length > 0 && <CartSummary subtotal={subtotal} />}
        <Button
          onClick={onPay}
          disabled={items.length === 0}
          size="lg"
          className="w-full h-14 text-base font-bold"
        >
          Pay ฿{subtotal.toFixed(2)}
        </Button>
      </div>

      <Dialog
        open={isTableDialogOpen}
        onClose={() => setIsTableDialogOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Select Table</DialogTitle>
          <DialogDescription>Tap to select table for dine in order.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-4 gap-2">
          {TABLE_OPTIONS.map((table) => {
            const active = tableNumber === table;
            return (
              <button
                key={table}
                onClick={() => {
                  onTableNumberChange(table);
                  setIsTableDialogOpen(false);
                }}
                className={`h-11 rounded-lg border text-sm font-semibold transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
                  active
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-bg)] text-[var(--color-primary)]"
                    : "border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)]"
                }`}
              >
                {table}
              </button>
            );
          })}
        </div>
      </Dialog>

      <Dialog open={activeNoteItem != null} onClose={handleCloseNoteDialog}>
        <DialogHeader>
          <DialogTitle>
            {activeNoteItem
              ? t("pos.noteDialog.title", { name: activeNoteItem.name })
              : t("pos.noteDialog.fallbackTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("pos.noteDialog.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-text-tertiary)]">
              {t("pos.noteDialog.quickNotes")}
            </p>
            <div className="flex flex-wrap gap-2">
              {quickNotes.map((note) => {
                const isActive = draftNote
                  .split(",")
                  .map((part) => part.trim())
                  .filter(Boolean)
                  .includes(note);

                return (
                  <button
                    key={note}
                    type="button"
                    onClick={() => handleToggleCommonNote(note)}
                    className={`min-h-10 rounded-full border px-3 text-sm font-medium transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
                      isActive
                        ? "border-[var(--button-primary-bg)] bg-[var(--button-primary-bg)] text-[var(--button-primary-text)]"
                        : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]"
                    }`}
                  >
                    {note}
                  </button>
                );
              })}
            </div>
          </div>

          <Input
            value={draftNote}
            onChange={(e) => setDraftNote(e.target.value)}
            placeholder={t("pos.noteDialog.placeholder")}
            maxLength={120}
          />

          <div className="flex gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleCloseNoteDialog}
            >
              {t("common.cancel")}
            </Button>
            <Button
              variant="ghost"
              className="flex-1"
              onClick={() => setDraftNote("")}
            >
              {t("pos.noteDialog.clearNote")}
            </Button>
            <Button className="flex-1" onClick={handleSaveNote}>
              {t("pos.noteDialog.saveNote")}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CartArea;

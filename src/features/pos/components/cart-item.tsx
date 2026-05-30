import type { ICartItem } from "@/features/pos/types/pos.model";
import { LuChevronUp, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface Props {
  item: ICartItem;
  expanded: boolean;
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemove: (cartItemId: string) => void;
  onEditNote: (item: ICartItem) => void;
  onToggleExpand: (item: ICartItem) => void;
}

const CartItem = ({
  item,
  expanded,
  onUpdateQuantity,
  onRemove,
  onEditNote,
  onToggleExpand,
}: Props) => {
  const { t } = useTranslation();
  const noteActionLabel = item.note ? t("pos.cart.editNote") : t("pos.cart.addNote");

  return (
    <div className="rounded-[var(--radius-md)] border border-accent/15 bg-accent/5 px-3 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-2.5">
        <p
          className="min-w-0 flex-1 truncate text-body font-[var(--weight-semibold)] leading-6 text-text-primary"
          title={item.name}
        >
          {item.name}
        </p>
        <span className="shrink-0 text-label font-medium tabular-nums text-text-tertiary">
          x{item.quantity}
        </span>
        <p className="shrink-0 text-body-sm font-[var(--weight-medium)] tabular-nums text-text-secondary">
          ฿{(item.price * item.quantity).toFixed(2)}
        </p>
        <button
          type="button"
          onClick={() => onToggleExpand(item)}
          className={cn(
            "inline-flex w-7 items-center justify-center rounded-full text-text-secondary transition-colors duration-[var(--motion-fast)]",
            "hover:bg-surface hover:text-text-primary",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-1 focus-visible:ring-offset-bg"
          )}
          aria-label={expanded ? t("common.close") : t("common.edit")}
          title={expanded ? t("common.close") : t("common.edit")}
        >
          {expanded ? <LuChevronUp size={16} /> : <LuPencil size={16} />}
        </button>
      </div>

      {expanded && (
        <div className="mt-3 rounded-[var(--radius-sm)] border border-border/70 bg-bg px-3 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-0.5 rounded-full border border-card-border bg-card-bg p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() =>
                  item.quantity <= 1
                    ? onRemove(item.cartItemId)
                    : onUpdateQuantity(item.cartItemId, item.quantity - 1)
                }
                className="h-9 w-9 rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                aria-label={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
              >
                <span className="text-label font-[var(--weight-semibold)] leading-none">-</span>
              </Button>
              <span className="min-w-8 text-center text-label font-[var(--weight-semibold)] tabular-nums text-text-primary">
                {item.quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                className="h-9 w-9 rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary"
                aria-label="Increase quantity"
              >
                <LuPlus size={16} />
              </Button>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onEditNote(item)}
                className="justify-center px-3"
              >
                <LuPencil size={14} />
                <span>{noteActionLabel}</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.cartItemId)}
                className="text-danger hover:bg-danger-bg hover:text-danger"
              >
                <LuTrash2 size={14} />
                <span>{t("common.delete")}</span>
              </Button>
            </div>
          </div>

          {item.note ? (
            <div className="mt-3 rounded-[var(--radius-sm)] border border-border/60 bg-surface px-3 py-2">
              <p className="line-clamp-2 text-label leading-5 text-text-tertiary" title={item.note}>
                {item.note}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default CartItem;

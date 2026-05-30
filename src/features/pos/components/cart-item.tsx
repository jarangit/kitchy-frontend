import type { ICartItem } from "@/features/pos/types/pos.model";
import { LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  item: ICartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onEditNote: (item: ICartItem) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove, onEditNote }: Props) => {
  const { t } = useTranslation();
  const noteActionLabel = item.note ? t("pos.cart.editNote") : t("pos.cart.addNote");

  return (
    <div className="border-b border-border py-4 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <p
          className="min-w-0 flex-1 line-clamp-1 text-subtitle font-[var(--weight-semibold)] text-text-primary"
          title={item.name}
        >
          {item.name}
        </p>
        <p className="shrink-0 text-body-sm font-[var(--weight-medium)] tabular-nums text-text-secondary">
          ฿{(item.price * item.quantity).toFixed(2)}
        </p>
      </div>

      {item.note ? (
        <p
          className="mt-1 line-clamp-1 text-body-sm text-text-tertiary"
          title={item.note}
        >
          {item.note}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-full border border-card-border bg-card-bg p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
              item.quantity <= 1
                ? onRemove(item.productId)
                : onUpdateQuantity(item.productId, item.quantity - 1)
            }
            className="h-[44px] w-[44px] rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            aria-label={item.quantity <= 1 ? "Remove item" : "Decrease quantity"}
          >
            <span className="text-label font-[var(--weight-semibold)] leading-none">-</span>
          </Button>
          <span className="min-w-8 text-center text-body font-[var(--weight-semibold)] tabular-nums text-text-primary">
            {item.quantity}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="h-[44px] w-[44px] rounded-full text-text-secondary hover:bg-surface-hover hover:text-text-primary"
            aria-label="Increase quantity"
          >
            <LuPlus size={18} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(item.productId)}
            className="text-text-secondary hover:bg-danger-bg hover:text-danger"
            aria-label="Remove item"
            title="Remove item"
          >
            <LuTrash2 size={16} />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onEditNote(item)}
            className="text-text-secondary hover:bg-surface hover:text-text-primary"
            aria-label={noteActionLabel}
            title={noteActionLabel}
          >
            <LuPencil size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

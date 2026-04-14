import type { ICartItem } from "@/features/pos/types/pos.model";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  item: ICartItem;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onEditNote: (item: ICartItem) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove, onEditNote }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="border-b border-[var(--color-border)] py-3 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <p
          className="min-w-0 flex-1 line-clamp-1 text-base font-semibold text-[var(--color-text-primary)]"
          title={item.name}
        >
          {item.name}
        </p>
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="h-11 w-11 shrink-0 rounded-lg text-[var(--color-text-tertiary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)] active:scale-[0.98]"
        >
          <LuTrash2 size={18} />
        </button>
      </div>

      <div className="mt-2.5 flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] px-1.5 py-1">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] active:scale-[0.98]"
          >
            <LuMinus size={18} />
          </button>
          <span className="min-w-8 text-center text-base font-semibold tabular-nums text-[var(--color-text-primary)]">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-text-secondary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] active:scale-[0.98]"
          >
            <LuPlus size={18} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEditNote(item)}
            className="inline-flex min-h-10 items-center rounded-full px-3 text-sm font-medium text-[var(--color-text-secondary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] active:scale-[0.98]"
          >
            {item.note ? t("pos.cart.editNote") : t("pos.cart.addNote")}
          </button>
          <p className="text-sm text-[var(--color-text-secondary)] tabular-nums">
            ฿{item.price.toFixed(2)}/ea
          </p>
          <p className="text-base font-semibold tabular-nums text-[var(--color-text-primary)]">
            ฿{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

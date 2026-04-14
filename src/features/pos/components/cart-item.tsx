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
      <div className="flex items-center gap-3">
        {/* Name + unit price */}
        <div className="min-w-0 flex-1">
          <div className="line-clamp-1 text-sm font-medium text-[var(--color-text-primary)]">
            {item.name}
          </div>
          <div className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            ฿{item.price.toFixed(2)} each
          </div>
        </div>

        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
          >
            <LuMinus size={14} />
          </button>
          <span className="text-sm font-semibold w-6 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
          >
            <LuPlus size={14} />
          </button>
        </div>

        {/* Line total */}
        <div className="text-sm font-semibold text-[var(--color-text-primary)] w-20 text-right">
          ฿{(item.price * item.quantity).toFixed(2)}
        </div>

        {/* Delete */}
        <button
          type="button"
          onClick={() => onRemove(item.productId)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
        >
          <LuTrash2 size={16} />
        </button>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onEditNote(item)}
          className="inline-flex min-h-9 items-center rounded-full bg-[var(--color-surface)] px-3 text-xs font-medium text-[var(--color-text-secondary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] active:scale-[0.98]"
        >
          {item.note ? t("pos.cart.editNote") : t("pos.cart.addNote")}
        </button>

        {item.note && (
          <p className="flex-1 rounded-2xl bg-[var(--color-surface)] px-3 py-2 text-xs leading-5 text-[var(--color-text-secondary)]">
            {t("pos.cart.notePrefix", { note: item.note })}
          </p>
        )}
      </div>
    </div>
  );
};

export default CartItem;

import type { ICartItem } from "@/features/pos/types/pos.model";
import { LuMinus, LuPlus, LuTrash2 } from "react-icons/lu";

interface Props {
  item: ICartItem;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemove: (productId: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: Props) => {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-[var(--color-border)] last:border-0">
      {/* Name + unit price */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--color-text-primary)] line-clamp-1">
          {item.name}
        </div>
        <div className="text-xs text-[var(--color-text-secondary)] mt-0.5">
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
        onClick={() => onRemove(item.productId)}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-bg)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
      >
        <LuTrash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;

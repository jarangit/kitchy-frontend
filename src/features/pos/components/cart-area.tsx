import type { ICartItem } from "@/features/pos/types/pos.model";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";
import { Button } from "@/shared/components/ui/button";

interface Props {
  items: ICartItem[];
  subtotal: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onPay: () => void;
}

const CartArea = ({
  items,
  subtotal,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onPay,
}: Props) => {
  return (
    <div className="flex flex-col h-full bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
        <h2 className="font-bold text-[var(--color-text-primary)]">Cart</h2>
        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-[var(--color-danger)] hover:text-[var(--color-danger-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-[var(--color-text-tertiary)] text-sm">
            No items in cart
          </div>
        ) : (
          items.map((item) => (
            <CartItem
              key={item.productId}
              item={item}
              onUpdateQuantity={onUpdateQuantity}
              onRemove={onRemoveItem}
            />
          ))
        )}
      </div>

      {/* Summary + Pay Button */}
      <div className="px-4 pb-4 space-y-3">
        {items.length > 0 && <CartSummary subtotal={subtotal} />}
        <Button
          onClick={onPay}
          disabled={items.length === 0}
          className="w-full h-12 text-base font-bold bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-bg-hover)] disabled:bg-[var(--color-border)] disabled:cursor-not-allowed"
        >
          Pay ฿{subtotal.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default CartArea;

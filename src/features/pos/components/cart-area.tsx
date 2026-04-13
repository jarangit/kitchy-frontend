import type { ICartItem } from "@/features/pos/types/pos.model";
import { LuShoppingCart } from "react-icons/lu";
import CartItem from "./cart-item";
import CartSummary from "./cart-summary";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";

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
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col h-full bg-[var(--color-bg)]">
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
            />
          ))
        )}
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
    </div>
  );
};

export default CartArea;

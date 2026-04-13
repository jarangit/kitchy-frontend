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
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-bold text-gray-800">Cart</h2>
        {items.length > 0 && (
          <button
            onClick={onClearCart}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-4">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
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
          className="w-full h-12 text-base font-bold bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Pay ฿{subtotal.toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default CartArea;

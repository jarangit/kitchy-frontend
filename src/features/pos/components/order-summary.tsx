import type { ICartItem } from "@/features/pos/types/pos.model";

interface Props {
  items: ICartItem[];
  subtotal: number;
}

const OrderSummary = ({ items, subtotal }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="font-bold text-gray-800 mb-4">Order Summary</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between text-sm text-gray-600"
          >
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>฿{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

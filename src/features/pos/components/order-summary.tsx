import type { ICartItem } from "@/features/pos/types/pos.model";

interface Props {
  items: ICartItem[];
  subtotal: number;
}

const OrderSummary = ({ items, subtotal }: Props) => {
  return (
    <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6">
      <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Order Summary</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between text-sm text-[var(--color-text-secondary)]"
          >
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>฿{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[var(--color-border)] mt-4 pt-4 flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

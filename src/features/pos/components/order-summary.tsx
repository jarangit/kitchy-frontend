import type { ICartItem } from "@/features/pos/types/pos.model";

interface Props {
  items: ICartItem[];
  subtotal: number;
}

const OrderSummary = ({ items, subtotal }: Props) => {
  return (
    <div className="bg-surface rounded-md border border-border p-6">
      <h3 className="mb-4 text-title text-text-primary">Order Summary</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between gap-3 text-base text-text-secondary"
          >
            <div>
              <span>
                {item.name} x{item.quantity}
              </span>
              {item.note && (
                <p className="mt-1 text-label leading-5 text-text-tertiary">
                  Note: {item.note}
                </p>
              )}
            </div>
            <span>฿{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t border-border pt-4 text-title">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

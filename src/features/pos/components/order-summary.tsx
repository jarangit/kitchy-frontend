import type { ICartItem } from "@/features/pos/types/pos.model";

interface Props {
  items: ICartItem[];
  subtotal: number;
}

const OrderSummary = ({ items, subtotal }: Props) => {
  return (
    <div className="bg-[var(--color-surface)] rounded-radius-md border border-[var(--color-border)] p-6">
      <h3 className="mb-4 text-title font-[var(--weight-semibold)] text-[var(--color-text-primary)]">Order Summary</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between gap-3 text-base text-[var(--color-text-secondary)]"
          >
            <div>
              <span>
                {item.name} x{item.quantity}
              </span>
              {item.note && (
                <p className="mt-1 text-label leading-5 text-[var(--color-text-tertiary)]">
                  Note: {item.note}
                </p>
              )}
            </div>
            <span>฿{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t border-[var(--color-border)] pt-4 text-title font-[var(--weight-semibold)]">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;

interface Props {
  subtotal: number;
  totalItems: number;
}

const CartSummary = ({ subtotal, totalItems }: Props) => {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-title text-text-primary">
        <span className="text-body font-medium text-text-secondary">Total</span>
        <div className="flex items-center gap-1.5 tabular-nums">
          {totalItems > 0 && (
            <span className="text-label text-text-tertiary">({totalItems})</span>
          )}
          <span>฿{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

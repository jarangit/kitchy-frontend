interface Props {
  subtotal: number;
  totalItems: number;
}

const CartSummary = ({ subtotal, totalItems }: Props) => {
  return (
    <div className="border-t border-border pt-5">
      <div className="flex items-center justify-between gap-3 text-title text-text-primary">
        <span>Total</span>
        <div className="flex items-center gap-2 tabular-nums">
          {totalItems > 0 && (
            <span className="text-body text-text-tertiary">({totalItems})</span>
          )}
          <span>฿{subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;

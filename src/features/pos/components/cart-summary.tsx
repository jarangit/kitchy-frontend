interface Props {
  subtotal: number;
}

const CartSummary = ({ subtotal }: Props) => {
  return (
    <div className="border-t border-[var(--color-border)] pt-3 space-y-2">
      <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
        <span>Subtotal</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold text-[var(--color-text-primary)]">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;

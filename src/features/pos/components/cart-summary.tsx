interface Props {
  subtotal: number;
}

const CartSummary = ({ subtotal }: Props) => {
  return (
    <div className="space-y-2 border-t border-[var(--color-border)] pt-3">
      <div className="flex justify-between text-base text-[var(--color-text-secondary)]">
        <span>Subtotal</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-xl font-semibold text-[var(--color-text-primary)]">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;

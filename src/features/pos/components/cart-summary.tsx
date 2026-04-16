interface Props {
  subtotal: number;
}

const CartSummary = ({ subtotal }: Props) => {
  return (
    <div className="space-y-3 border-t border-[var(--color-border)] pt-4">
      <div className="flex justify-between text-base text-[var(--color-text-secondary)]">
        <span>Subtotal</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-title font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;

interface Props {
  subtotal: number;
}

const CartSummary = ({ subtotal }: Props) => {
  return (
    <div className="space-y-3 border-t border-border pt-4">
      <div className="flex justify-between text-base text-text-secondary">
        <span>Subtotal</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-title text-text-primary">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;

interface Props {
  subtotal: number;
}

const CartSummary = ({ subtotal }: Props) => {
  return (
    <div className="border-t border-gray-200 pt-3 space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Subtotal</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-lg font-bold text-gray-800">
        <span>Total</span>
        <span>฿{subtotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default CartSummary;

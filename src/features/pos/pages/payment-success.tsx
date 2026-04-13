import { useLocation, useNavigate, useParams } from "react-router-dom";
import type { ICartItem, PaymentMethod } from "@/features/pos/types/pos.model";
import { Button } from "@/shared/components/ui/button";
import { LuCircleCheck } from "react-icons/lu";

interface PaymentSuccessState {
  receiptId: string;
  items: ICartItem[];
  subtotal: number;
  paymentMethod: PaymentMethod;
  receivedAmount: number;
  change: number;
}

const PaymentSuccessPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as PaymentSuccessState | null;

  if (!state) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-[var(--color-text-secondary)] mb-4">No payment data found.</p>
          <Button onClick={() => navigate(`/store/${id}/pos`)}>
            Back to POS
          </Button>
        </div>
      </div>
    );
  }

  const { receiptId, items, subtotal, paymentMethod, receivedAmount, change } =
    state;

  const methodLabel: Record<PaymentMethod, string> = {
    CASH: "Cash",
    QR: "QR Code",
    TRANSFER: "Bank Transfer",
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]">
      <div className="text-[var(--color-success)] mb-4">
        <LuCircleCheck size={80} />
      </div>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
        Payment Successful!
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-6">Your order has been placed</p>

      <div className="w-full bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6 space-y-4">
        <div className="text-center border-b border-[var(--color-border)] pb-4">
          <div className="text-xs text-[var(--color-text-secondary)] uppercase">Receipt ID</div>
          <div className="text-lg font-bold text-[var(--color-text-primary)]">{receiptId}</div>
        </div>

        {/* Order Items */}
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

        <div className="border-t border-[var(--color-border)] pt-3 space-y-2">
          <div className="flex justify-between font-bold text-[var(--color-text-primary)]">
            <span>Total</span>
            <span>฿{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
            <span>Payment Method</span>
            <span>{methodLabel[paymentMethod]}</span>
          </div>
          {paymentMethod === "CASH" && (
            <>
              <div className="flex justify-between text-sm text-[var(--color-text-secondary)]">
                <span>Received</span>
                <span>฿{receivedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[var(--color-success)]">
                <span>Change</span>
                <span>฿{change.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <Button
        onClick={() => navigate(`/store/${id}/pos`, { replace: true })}
        className="w-full h-12 mt-6 text-base font-bold bg-[var(--color-text-primary)] text-[var(--color-text-inverse)] hover:opacity-90"
      >
        New Order
      </Button>
    </div>
  );
};

export default PaymentSuccessPage;

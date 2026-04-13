import { useNavigate, useParams } from "react-router-dom";
import { LuCircleCheck, LuPrinter, LuArrowRight } from "react-icons/lu";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import { useCartContext } from "@/features/pos/context/cartContext";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";

const PaymentSuccessPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { paymentResult, clearPaymentResult } = useCartContext();

  if (!paymentResult) {
    return (
      <div className="flex items-center justify-center flex-1">
        <EmptyState
          title="No payment data found"
          description="It looks like you navigated here directly. Please start a new order."
          action={
            <Button onClick={() => navigate(`/store/${id}/pos`)}>
              Back to POS
            </Button>
          }
        />
      </div>
    );
  }

  const { receiptId, items, subtotal, paymentMethod, receivedAmount, change } =
    paymentResult;

  const methodLabel: Record<PaymentMethod, string> = {
    CASH: "Cash",
    QR: "QR Code",
    TRANSFER: "Bank Transfer",
  };

  const formattedDate = new Date().toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleNewOrder = () => {
    clearPaymentResult();
    navigate(`/store/${id}/pos`, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto p-6 flex flex-col items-center justify-center min-h-[80vh]">
      {/* Success icon */}
      <div className="text-[var(--color-success)] mb-4 animate-check">
        <LuCircleCheck size={72} />
      </div>

      <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
        Payment Successful!
      </h1>
      <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
        ฿{subtotal.toFixed(2)}
      </p>

      {/* Receipt card */}
      <div className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
        {/* Receipt header */}
        <div className="text-center pb-4">
          <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">
            Receipt
          </p>
          <p className="font-mono font-bold text-[var(--color-text-primary)]">
            #{receiptId}
          </p>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">
            {formattedDate}
          </p>
        </div>

        {/* Items list */}
        <div className="border-t border-[var(--color-border)] pt-4 pb-4 space-y-2">
          {items.map((item) => (
            <div
              key={item.productId}
              className="grid grid-cols-[1fr_auto_auto] gap-2 text-sm text-[var(--color-text-secondary)]"
            >
              <span>{item.name}</span>
              <span className="text-right">x{item.quantity}</span>
              <span className="text-right w-20">
                ฿{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="border-t border-[var(--color-border)] pt-3 pb-3">
          <div className="flex justify-between font-bold text-[var(--color-text-primary)]">
            <span>Total</span>
            <span>฿{subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Payment details */}
        <div className="border-t border-[var(--color-border)] pt-3 space-y-2 text-sm">
          <div className="flex justify-between text-[var(--color-text-secondary)]">
            <span>Payment Method</span>
            <span>{methodLabel[paymentMethod]}</span>
          </div>
          {paymentMethod === "CASH" && (
            <>
              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <span>Cash Received</span>
                <span>฿{receivedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-semibold text-[var(--color-success)]">
                <span>Change</span>
                <span>฿{change.toFixed(2)}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 w-full mt-6 no-print">
        <Button
          variant="secondary"
          className="flex-1 h-12"
          onClick={() => window.print()}
        >
          <LuPrinter size={18} />
          Print Receipt
        </Button>
        <Button
          className="flex-1 h-12"
          onClick={handleNewOrder}
        >
          New Order
          <LuArrowRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

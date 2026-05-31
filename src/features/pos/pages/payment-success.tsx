import { useNavigate, useParams } from "react-router-dom";
import { LuCircleCheck, LuPrinter, LuArrowRight } from "react-icons/lu";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import PaymentReceipt from "@/features/pos/components/payment-receipt";

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

  const { subtotal } = paymentResult;

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
      <div className="text-success mb-4 animate-check">
        <LuCircleCheck size={72} />
      </div>

      <h1 className="mb-1 text-heading font-semibold text-text-primary">
        Payment Successful!
      </h1>
      <p className="text-display text-text-primary mb-6">
        ฿{subtotal.toFixed(2)}
      </p>

      <PaymentReceipt
        paymentResult={paymentResult}
        dateLabel={formattedDate}
        className="w-full bg-bg p-6"
      />

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

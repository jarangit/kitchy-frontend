import { LuCircleCheck, LuPrinter } from "react-icons/lu";
import type { PaymentResult } from "@/features/pos/context/cart-context-value";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import PaymentReceipt from "@/features/pos/components/payment-receipt";

interface Props {
  open: boolean;
  onClose: () => void;
  paymentResult: PaymentResult | null;
}

const PaymentSuccessDialog = ({ open, onClose, paymentResult }: Props) => {
  return (
    <Dialog open={open} onClose={onClose} className="max-w-md">
      {paymentResult ? (
        <div className="w-full flex flex-col items-center">
          <div className="text-success mb-4 animate-check">
            <LuCircleCheck size={72} />
          </div>

          <h2 className="mb-1 text-heading text-text-primary">
            Payment Successful!
          </h2>
          <p className="mb-6 text-display font-[var(--weight-semibold)] text-text-primary">
            ฿{paymentResult.subtotal.toFixed(2)}
          </p>

          <PaymentReceipt
            paymentResult={paymentResult}
            showOrderDetails
            className="w-full p-6"
          />

          <div className="flex gap-3 w-full mt-6">
            <Button
              variant="secondary"
              className="h-12 flex-1 text-base"
              onClick={() => window.print()}
            >
              <LuPrinter size={18} />
              Print Receipt
            </Button>
            <Button className="h-12 flex-1 text-base" onClick={onClose}>
              New Order
            </Button>
          </div>
        </div>
      ) : (
        <EmptyState
          title="No payment data found"
          description="Please start a new order."
          action={<Button onClick={onClose}>Back to POS</Button>}
        />
      )}
    </Dialog>
  );
};

export default PaymentSuccessDialog;

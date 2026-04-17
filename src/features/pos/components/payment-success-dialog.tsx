import { LuCircleCheck, LuPrinter, LuQrCode } from "react-icons/lu";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import type { PaymentResult } from "@/features/pos/context/cartContext";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";

interface Props {
  open: boolean;
  onClose: () => void;
  paymentResult: PaymentResult | null;
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: "Cash",
  QR: "QR Code",
};

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

          <div className="w-full bg-surface border border-border rounded-radius-lg p-6">
            <div className="text-center pb-4">
              <p className="mb-1 text-label uppercase tracking-widest text-text-secondary">
                Receipt
              </p>
              <p className="font-mono font-[var(--weight-semibold)] text-text-primary">
                #{paymentResult.receiptId}
              </p>
            </div>

            <div className="border-t border-border pt-4 pb-4 space-y-2">
              {paymentResult.items.map((item) => (
                <div
                  key={item.productId}
                  className="grid grid-cols-[1fr_auto_auto] gap-2 text-base text-text-secondary"
                >
                  <div>
                    <span>{item.name}</span>
                    {item.note && (
                      <p className="mt-1 text-label leading-5 text-text-tertiary">
                        Note: {item.note}
                      </p>
                    )}
                  </div>
                  <span className="text-right">x{item.quantity}</span>
                  <span className="text-right w-20">
                    ฿{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 pb-3">
              <div className="flex justify-between font-[var(--weight-semibold)] text-text-primary">
                <span>Total</span>
                <span>฿{paymentResult.subtotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-border pt-3 text-base">
              <div className="flex justify-between text-text-secondary">
                <span>Order Type</span>
                <span>{paymentResult.orderType}</span>
              </div>
              {paymentResult.orderType === "DINE_IN" && paymentResult.tableNumber && (
                <div className="flex justify-between text-text-secondary">
                  <span>Table</span>
                  <span>{paymentResult.tableNumber}</span>
                </div>
              )}
              {paymentResult.orderType === "DELIVERY" && paymentResult.customerName && (
                <div className="flex justify-between text-text-secondary">
                  <span>Customer</span>
                  <span>{paymentResult.customerName}</span>
                </div>
              )}
              {paymentResult.orderType === "DELIVERY" && paymentResult.deliveryPlatform && (
                <div className="flex justify-between text-text-secondary">
                  <span>Platform</span>
                  <span>{paymentResult.deliveryPlatform}</span>
                </div>
              )}
              <div className="flex justify-between text-text-secondary">
                <span>Payment Method</span>
                <span>{METHOD_LABEL[paymentResult.paymentMethod]}</span>
              </div>
              {paymentResult.paymentMethod === "CASH" && (
                <>
                  <div className="flex justify-between text-text-secondary">
                    <span>Cash Received</span>
                    <span>฿{paymentResult.receivedAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-[var(--weight-semibold)] text-success">
                    <span>Change</span>
                    <span>฿{paymentResult.change.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <p className="mb-2 text-center text-body font-[var(--weight-semibold)] text-text-primary">
                Scan to get digital receipt
              </p>
              <div className="w-40 h-40 mx-auto border border-border rounded-radius-lg bg-bg flex flex-col items-center justify-center gap-2 text-text-tertiary">
                <LuQrCode size={44} />
                <span className="text-label">Receipt QR</span>
              </div>
              <p className="mt-2 text-center text-label text-text-tertiary">
                Ref: #{paymentResult.receiptId}
              </p>
            </div>
          </div>

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

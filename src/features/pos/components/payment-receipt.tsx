import { LuQrCode } from "react-icons/lu";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import type { PaymentResult } from "@/features/pos/context/cartContext";
import { Card } from "@/shared/components/ui/card";

interface Props {
  paymentResult: PaymentResult;
  dateLabel?: string;
  showOrderDetails?: boolean;
  className?: string;
}

const METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: "Cash",
  QR: "QR Code",
};

const PaymentReceipt = ({
  paymentResult,
  dateLabel,
  showOrderDetails = false,
  className,
}: Props) => {
  const {
    receiptId,
    items,
    subtotal,
    paymentMethod,
    receivedAmount,
    change,
    orderType,
    tableNumber,
    customerName,
    deliveryPlatform,
  } = paymentResult;

  return (
    <Card className={className}>
      <div className="pb-4 text-center">
        <p className="mb-1 text-caption uppercase tracking-widest text-text-secondary">
          Receipt
        </p>
        <p className="font-mono font-[var(--weight-semibold)] text-text-primary">
          #{receiptId}
        </p>
        {dateLabel && (
          <p className="mt-1 text-label text-text-secondary">
            {dateLabel}
          </p>
        )}
      </div>

      <div className="space-y-2 border-t border-border pb-4 pt-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="grid grid-cols-[1fr_auto_auto] gap-2 text-label text-text-secondary"
          >
            <div>
              <span>{item.name}</span>
              {item.note && (
                <p className="mt-1 text-caption leading-5 text-text-tertiary">
                  Note: {item.note}
                </p>
              )}
            </div>
            <span className="text-right">x{item.quantity}</span>
            <span className="w-20 text-right">
              ฿{(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pb-3 pt-3">
        <div className="flex justify-between font-[var(--weight-semibold)] text-text-primary">
          <span>Total</span>
          <span>฿{subtotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="space-y-2 border-t border-border pt-3 text-label">
        {showOrderDetails && (
          <>
            <div className="flex justify-between text-text-secondary">
              <span>Order Type</span>
              <span>{orderType}</span>
            </div>
            {orderType === "DINE_IN" && tableNumber && (
              <div className="flex justify-between text-text-secondary">
                <span>Table</span>
                <span>{tableNumber}</span>
              </div>
            )}
            {orderType === "DELIVERY" && customerName && (
              <div className="flex justify-between text-text-secondary">
                <span>Customer</span>
                <span>{customerName}</span>
              </div>
            )}
            {orderType === "DELIVERY" && deliveryPlatform && (
              <div className="flex justify-between text-text-secondary">
                <span>Platform</span>
                <span>{deliveryPlatform}</span>
              </div>
            )}
          </>
        )}
        <div className="flex justify-between text-text-secondary">
          <span>Payment Method</span>
          <span>{METHOD_LABEL[paymentMethod]}</span>
        </div>
        {paymentMethod === "CASH" && (
          <>
            <div className="flex justify-between text-text-secondary">
              <span>Cash Received</span>
              <span>฿{receivedAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-[var(--weight-semibold)] text-success">
              <span>Change</span>
              <span>฿{change.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="mb-2 text-center text-label font-[var(--weight-semibold)] text-text-primary">
          Scan to get digital receipt
        </p>
        <div className="mx-auto flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-surface text-text-tertiary">
          <LuQrCode size={44} />
          <span className="text-caption">Receipt QR</span>
        </div>
        <p className="mt-2 text-center text-caption text-text-tertiary">
          Ref: #{receiptId}
        </p>
      </div>
    </Card>
  );
};

export default PaymentReceipt;

import { useMemo, useState } from "react";
import { LuX } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useCartContext } from "@/features/pos/context/cartContext";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import CashPaymentSection from "@/features/pos/components/cash-payment-section";
import QrPaymentSection from "@/features/pos/components/qr-payment-section";
import PaymentSuccessDialog from "@/features/pos/components/payment-success-dialog";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { getNextQueueNumber } from "@/features/pos/utils/get-next-queue-number";

interface Props {
  open: boolean;
  onClose: () => void;
}

const PosPaymentOverlay = ({ open, onClose }: Props) => {
  const {
    items,
    subtotal,
    clearCart,
    setPaymentResult,
    paymentResult,
    clearPaymentResult,
    orderType,
    tableNumber,
    customerName,
    deliveryPlatform,
  } = useCartContext();
  const { createMutation, ordersQuery } = useOrderService({});

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const change = useMemo(
    () =>
      paymentMethod === "CASH" && receivedAmount
        ? Math.max(0, Number(receivedAmount) - subtotal)
        : 0,
    [paymentMethod, receivedAmount, subtotal]
  );

  const canConfirm =
    items.length > 0 &&
    (paymentMethod !== "CASH" || Number(receivedAmount) >= subtotal) &&
    (orderType !== "DINE_IN" || !!tableNumber) &&
    (orderType !== "DELIVERY" || deliveryPlatform.trim().length > 0);

  const handleClosePayment = () => {
    if (isProcessing) return;
    setErrorMessage(null);
    onClose();
  };

  const handleConfirmPayment = async () => {
    if (!canConfirm || isProcessing) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const orderNumber = getNextQueueNumber(ordersQuery);

      await createMutation.mutateAsync({
        orderNumber,
        orderType,
        tableNumber: orderType === "DINE_IN" ? tableNumber ?? undefined : undefined,
        customerName:
          orderType === "DELIVERY" ? customerName.trim() : undefined,
        deliveryPlatform:
          orderType === "DELIVERY" ? deliveryPlatform.trim() : undefined,
        products: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          note: item.note?.trim() || undefined,
        })),
      });

      setPaymentResult({
        receiptId: orderNumber,
        items: [...items],
        subtotal,
        paymentMethod,
        receivedAmount: Number(receivedAmount) || subtotal,
        change,
        orderType,
        tableNumber,
        customerName,
        deliveryPlatform,
      });

      clearCart();
      onClose();
      setIsSuccessOpen(true);
    } catch (error) {
      console.error("Payment failed:", error);
      setErrorMessage("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseSuccess = () => {
    setIsSuccessOpen(false);
    clearPaymentResult();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClosePayment}
        className="!max-w-5xl w-[min(96vw,72rem)] max-h-[92vh] p-0 overflow-hidden"
      >
        <div className="bg-surface border-b border-border px-6 py-4 flex items-center justify-between">
          <h2 className="text-heading text-text-primary">Payment</h2>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={handleClosePayment}
            className="h-12 w-12 bg-bg"
            aria-label="Close payment"
          >
            <LuX size={18} />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 bg-bg">
            <EmptyState
              title="No items to pay for"
              description="Your cart is empty. Add products first."
              action={<Button onClick={handleClosePayment}>Back to POS</Button>}
            />
          </div>
        ) : (
          <div className="bg-bg p-6 overflow-y-auto max-h-[calc(92vh-72px)]">
            <div className="lg:grid lg:grid-cols-[1fr_320px] gap-6 space-y-6 lg:space-y-0">
              <OrderSummary items={items} subtotal={subtotal} />

              <div className="bg-surface rounded-radius-md border border-border p-6">
                <h3 className="mb-3 text-title text-text-primary">
                  Order Info
                </h3>
                <div className="mb-4 space-y-1 text-base text-text-secondary">
                  <p>
                    Type: <span className="font-[var(--weight-semibold)] text-text-primary">{orderType}</span>
                  </p>
                  {orderType === "DINE_IN" && (
                    <p>
                      Table: <span className="font-[var(--weight-semibold)] text-text-primary">{tableNumber ?? "-"}</span>
                    </p>
                  )}
                  {orderType === "DELIVERY" && (
                    <p>
                      Platform: <span className="font-[var(--weight-semibold)] text-text-primary">{deliveryPlatform || "-"}</span>
                    </p>
                  )}
                </div>

                <h3 className="mb-4 text-title text-text-primary">
                  Payment Method
                </h3>
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </div>
            </div>

            {paymentMethod === "CASH" && (
              <CashPaymentSection
                subtotal={subtotal}
                receivedAmount={receivedAmount}
                onReceivedAmountChange={setReceivedAmount}
                change={change}
              />
            )}

            {paymentMethod === "QR" && (
              <QrPaymentSection subtotal={subtotal} />
            )}

            {errorMessage && (
              <p className="mt-4 text-base text-danger">{errorMessage}</p>
            )}

            {orderType === "DINE_IN" && !tableNumber && (
              <p className="mt-4 text-base text-danger">
                Please select a table before payment.
              </p>
            )}

            {orderType === "DELIVERY" && deliveryPlatform.trim().length === 0 && (
              <p className="mt-4 text-base text-danger">
                Please select delivery platform before payment.
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={handleClosePayment}
                className="h-12 flex-1 text-base"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={!canConfirm || isProcessing}
                className="h-12 flex-1 text-subtitle"
              >
                {isProcessing ? "Processing..." : `Pay ฿${subtotal.toFixed(2)}`}
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <PaymentSuccessDialog
        open={isSuccessOpen}
        onClose={handleCloseSuccess}
        paymentResult={paymentResult}
      />
    </>
  );
};

export default PosPaymentOverlay;

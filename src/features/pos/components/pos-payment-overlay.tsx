import { useMemo, useState } from "react";
import { LuQrCode, LuCircleCheck, LuPrinter, LuX } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useCartContext } from "@/features/pos/context/cartContext";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import { Button } from "@/shared/components/ui/button";
import { Dialog } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
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

  const quickAmounts = [
    { label: `Exact ฿${subtotal.toLocaleString()}`, value: subtotal },
    { label: "฿500", value: 500 },
    { label: "฿1,000", value: 1000 },
  ];

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

  const methodLabel: Record<PaymentMethod, string> = {
    CASH: "Cash",
    QR: "QR Code",
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClosePayment}
        className="!max-w-5xl w-[min(96vw,72rem)] max-h-[92vh] p-0 overflow-hidden"
      >
        <div className="bg-[var(--color-surface)] border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">Payment</h2>
          <button
            onClick={handleClosePayment}
            className="w-11 h-11 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98] flex items-center justify-center"
            aria-label="Close payment"
          >
            <LuX size={18} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="p-8 bg-[var(--color-bg)]">
            <EmptyState
              title="No items to pay for"
              description="Your cart is empty. Add products first."
              action={<Button onClick={handleClosePayment}>Back to POS</Button>}
            />
          </div>
        ) : (
          <div className="bg-[var(--color-bg)] p-6 overflow-y-auto max-h-[calc(92vh-72px)]">
            <div className="lg:grid lg:grid-cols-[1fr_320px] gap-6 space-y-6 lg:space-y-0">
              <OrderSummary items={items} subtotal={subtotal} />

              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                  Order Info
                </h3>
                <div className="space-y-1 text-sm text-[var(--color-text-secondary)] mb-4">
                  <p>
                    Type: <span className="font-semibold text-[var(--color-text-primary)]">{orderType}</span>
                  </p>
                  {orderType === "DINE_IN" && (
                    <p>
                      Table: <span className="font-semibold text-[var(--color-text-primary)]">{tableNumber ?? "-"}</span>
                    </p>
                  )}
                  {orderType === "DELIVERY" && (
                    <p>
                      Platform: <span className="font-semibold text-[var(--color-text-primary)]">{deliveryPlatform || "-"}</span>
                    </p>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Payment Method
                </h3>
                <PaymentMethodSelector
                  selected={paymentMethod}
                  onSelect={setPaymentMethod}
                />
              </div>
            </div>

            {paymentMethod === "CASH" && (
              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-6">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                  Cash Payment
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Received Amount"
                    type="number"
                    value={receivedAmount}
                    onChange={(e) => setReceivedAmount(e.target.value)}
                    placeholder="0.00"
                    className="text-lg font-semibold"
                  />

                  <div>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">
                      Quick amounts:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickAmounts.map((amt) => (
                        <Button
                          key={amt.value}
                          variant="secondary"
                          size="sm"
                          onClick={() => setReceivedAmount(String(amt.value))}
                        >
                          {amt.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {Number(receivedAmount) > 0 && (
                    <p className="text-xl font-bold text-[var(--color-success)]">
                      Change: ฿{change.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === "QR" && (
              <div className="bg-[var(--color-surface)] rounded-xl border border-[var(--color-border)] p-6 mt-6 text-center">
                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
                  QR Code Payment
                </h3>
                <div className="w-52 h-52 mx-auto border border-[var(--color-border)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center gap-3 text-[var(--color-text-tertiary)]">
                  <LuQrCode size={48} />
                  <span className="text-sm">QR Code Placeholder</span>
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] mt-4">
                  Scan to pay ฿{subtotal.toFixed(2)}
                </p>
              </div>
            )}

            {errorMessage && (
              <p className="text-sm text-[var(--color-danger)] mt-4">{errorMessage}</p>
            )}

            {orderType === "DINE_IN" && !tableNumber && (
              <p className="text-sm text-[var(--color-danger)] mt-4">
                Please select a table before payment.
              </p>
            )}

            {orderType === "DELIVERY" && deliveryPlatform.trim().length === 0 && (
              <p className="text-sm text-[var(--color-danger)] mt-4">
                Please select delivery platform before payment.
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={handleClosePayment}
                className="flex-1 h-12"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmPayment}
                disabled={!canConfirm || isProcessing}
                className="flex-1 h-12 text-base font-bold"
              >
                {isProcessing ? "Processing..." : `Pay ฿${subtotal.toFixed(2)}`}
              </Button>
            </div>
          </div>
        )}
      </Dialog>

      <Dialog open={isSuccessOpen} onClose={handleCloseSuccess} className="max-w-md">
        {paymentResult ? (
          <div className="w-full flex flex-col items-center">
            <div className="text-[var(--color-success)] mb-4 animate-check">
              <LuCircleCheck size={72} />
            </div>

            <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
              Payment Successful!
            </h2>
            <p className="text-3xl font-bold text-[var(--color-text-primary)] mb-6">
              ฿{paymentResult.subtotal.toFixed(2)}
            </p>

            <div className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6">
              <div className="text-center pb-4">
                <p className="text-xs uppercase tracking-widest text-[var(--color-text-secondary)] mb-1">
                  Receipt
                </p>
                <p className="font-mono font-bold text-[var(--color-text-primary)]">
                  #{paymentResult.receiptId}
                </p>
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 pb-4 space-y-2">
                {paymentResult.items.map((item) => (
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

              <div className="border-t border-[var(--color-border)] pt-3 pb-3">
                <div className="flex justify-between font-bold text-[var(--color-text-primary)]">
                  <span>Total</span>
                  <span>฿{paymentResult.subtotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-[var(--color-border)] pt-3 space-y-2 text-sm">
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Order Type</span>
                  <span>{paymentResult.orderType}</span>
                </div>
                {paymentResult.orderType === "DINE_IN" && paymentResult.tableNumber && (
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Table</span>
                    <span>{paymentResult.tableNumber}</span>
                  </div>
                )}
                {paymentResult.orderType === "DELIVERY" && paymentResult.customerName && (
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Customer</span>
                    <span>{paymentResult.customerName}</span>
                  </div>
                )}
                {paymentResult.orderType === "DELIVERY" && paymentResult.deliveryPlatform && (
                  <div className="flex justify-between text-[var(--color-text-secondary)]">
                    <span>Platform</span>
                    <span>{paymentResult.deliveryPlatform}</span>
                  </div>
                )}
                <div className="flex justify-between text-[var(--color-text-secondary)]">
                  <span>Payment Method</span>
                  <span>{methodLabel[paymentResult.paymentMethod]}</span>
                </div>
                {paymentResult.paymentMethod === "CASH" && (
                  <>
                    <div className="flex justify-between text-[var(--color-text-secondary)]">
                      <span>Cash Received</span>
                      <span>฿{paymentResult.receivedAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-[var(--color-success)]">
                      <span>Change</span>
                      <span>฿{paymentResult.change.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-[var(--color-border)] pt-4 mt-4">
                <p className="text-sm font-semibold text-[var(--color-text-primary)] text-center mb-2">
                  Scan to get digital receipt
                </p>
                <div className="w-40 h-40 mx-auto border border-[var(--color-border)] rounded-[var(--radius-lg)] bg-[var(--color-bg)] flex flex-col items-center justify-center gap-2 text-[var(--color-text-tertiary)]">
                  <LuQrCode size={44} />
                  <span className="text-xs">Receipt QR</span>
                </div>
                <p className="text-xs text-[var(--color-text-tertiary)] text-center mt-2">
                  Ref: #{paymentResult.receiptId}
                </p>
              </div>
            </div>

            <div className="flex gap-3 w-full mt-6">
              <Button
                variant="secondary"
                className="flex-1 h-12"
                onClick={() => window.print()}
              >
                <LuPrinter size={18} />
                Print Receipt
              </Button>
              <Button className="flex-1 h-12" onClick={handleCloseSuccess}>
                New Order
              </Button>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No payment data found"
            description="Please start a new order."
            action={<Button onClick={handleCloseSuccess}>Back to POS</Button>}
          />
        )}
      </Dialog>
    </>
  );
};

export default PosPaymentOverlay;

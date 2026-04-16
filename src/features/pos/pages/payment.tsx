import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft, LuQrCode } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useCartContext } from "@/features/pos/context/cartContext";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { getNextQueueNumber } from "@/features/pos/utils/get-next-queue-number";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { items, subtotal, clearCart, setPaymentResult } = useCartContext();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { createMutation, ordersQuery } = useOrderService({});

  const change =
    paymentMethod === "CASH" && receivedAmount
      ? Math.max(0, Number(receivedAmount) - subtotal)
      : 0;

  const canConfirm =
    items.length > 0 &&
    (paymentMethod !== "CASH" || Number(receivedAmount) >= subtotal);

  const handleConfirmPayment = async () => {
    if (!canConfirm) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const orderNumber = getNextQueueNumber(ordersQuery);
      await createMutation.mutateAsync({
        orderNumber,
        orderType: "TOGO",
        products: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          note: item.note?.trim() || undefined,
        })),
      });

      // Store payment result in context before navigating
      setPaymentResult({
        receiptId: orderNumber,
        items: [...items],
        subtotal,
        paymentMethod,
        receivedAmount: Number(receivedAmount) || subtotal,
        change,
        orderType: "TOGO",
        tableNumber: null,
        customerName: "",
        deliveryPlatform: "",
      });

      // Clear the cart after successful payment
      clearCart();

      navigate(`/store/${id}/pos/payment/success`, { replace: true });
    } catch (error) {
      console.error("Payment failed:", error);
      setErrorMessage("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate(`/store/${id}/pos`);
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center flex-1">
        <EmptyState
          title="No items to pay for"
          description="Your cart is empty. Go back to POS to add items."
          action={
            <Button onClick={handleCancel}>Back to POS</Button>
          }
        />
      </div>
    );
  }

  const quickAmounts = [
    { label: `Exact ฿${subtotal.toLocaleString()}`, value: subtotal },
    { label: "฿500", value: 500 },
    { label: "฿1,000", value: 1000 },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="gap-1.5"
        >
          <LuArrowLeft size={18} />
          Back
        </Button>
        <h1 className="text-heading font-[var(--weight-bold)] text-[var(--color-text-primary)]">
          Payment
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-[1fr_320px] gap-6 space-y-6 lg:space-y-0">
        {/* Left column — Order Summary */}
        <OrderSummary items={items} subtotal={subtotal} />

        {/* Right column — Payment Method */}
        <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6">
          <h3 className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-primary)] mb-4">
            Payment Method
          </h3>
          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </div>
      </div>

      {/* Conditional payment details */}
      {paymentMethod === "CASH" && (
        <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6 mt-6">
          <h3 className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-primary)] mb-4">
            Cash Payment
          </h3>
          <div className="space-y-4">
            <Input
              label="Received Amount"
              type="number"
              value={receivedAmount}
              onChange={(e) => setReceivedAmount(e.target.value)}
              placeholder="0.00"
              className="text-subtitle font-[var(--weight-semibold)]"
            />

            <div>
              <p className="text-label text-[var(--color-text-secondary)] mb-2">
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
              <p className="text-title font-[var(--weight-bold)] text-[var(--color-success)]">
                Change: ฿{change.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      )}

      {paymentMethod === "QR" && (
        <div className="bg-[var(--color-bg)] rounded-xl border border-[var(--color-border)] p-6 mt-6 text-center">
          <h3 className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-primary)] mb-6">
            QR Code Payment
          </h3>
          <div className="w-52 h-52 mx-auto border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-lg)] flex flex-col items-center justify-center gap-3 text-[var(--color-text-tertiary)]">
            <LuQrCode size={48} />
            <span className="text-label">QR Code Placeholder</span>
          </div>
          <p className="text-label text-[var(--color-text-secondary)] mt-4">
            Scan to pay ฿{subtotal.toFixed(2)}
          </p>
        </div>
      )}

      {/* Error message */}
      {errorMessage && (
        <p className="text-label text-[var(--color-danger)] mt-4">
          {errorMessage}
        </p>
      )}

      {/* Bottom action bar */}
      <div className="flex gap-3 mt-6">
        <Button
          variant="secondary"
          onClick={handleCancel}
          className="flex-1 h-12"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmPayment}
          disabled={!canConfirm || isProcessing}
          className="flex-1 h-12 text-body font-[var(--weight-bold)]"
        >
          {isProcessing ? "Processing..." : `Pay ฿${subtotal.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;

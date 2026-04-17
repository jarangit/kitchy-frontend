import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useCartContext } from "@/features/pos/context/cartContext";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import CashPaymentSection from "@/features/pos/components/cash-payment-section";
import QrPaymentSection from "@/features/pos/components/qr-payment-section";
import { Button } from "@/shared/components/ui/button";
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
        <h1 className="text-heading text-text-primary">
          Payment
        </h1>
      </div>

      {/* Two-column layout */}
      <div className="lg:grid lg:grid-cols-[1fr_320px] gap-6 space-y-6 lg:space-y-0">
        <OrderSummary items={items} subtotal={subtotal} />

        <div className="bg-bg rounded-md border border-border p-6">
          <h3 className="text-subtitle text-text-primary mb-4">
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
        <p className="text-label text-danger mt-4">
          {errorMessage}
        </p>
      )}

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
          className="flex-1 h-12 text-subtitle"
        >
          {isProcessing ? "Processing..." : `Pay ฿${subtotal.toFixed(2)}`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;

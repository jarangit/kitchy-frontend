import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import type { PaymentMethod } from "@/features/pos/types/pos.model";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import CashPaymentSection from "@/features/pos/components/cash-payment-section";
import QrPaymentSection from "@/features/pos/components/qr-payment-section";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { getNextQueueNumber } from "@/features/pos/utils/get-next-queue-number";
import { getPaymentStrategy } from "@/features/pos/strategies/payment-strategy";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { items, subtotal, clearCart, setPaymentResult } = useCartContext();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { createMutation, ordersQuery } = useOrderService({});

  const strategy = getPaymentStrategy(paymentMethod);
  const paymentCtx = {
    total: subtotal,
    received: receivedAmount ? Number(receivedAmount) : undefined,
  };
  const change = strategy.calcChange(paymentCtx);
  const canConfirm = items.length > 0 && strategy.canConfirm(paymentCtx);

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
        deliveryOrderNumber: "",
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
    <div className="mx-auto max-w-5xl px-6 py-8">
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
      <div className="gap-6 space-y-6 lg:grid lg:grid-cols-[1fr_320px] lg:space-y-0">
        <OrderSummary items={items} subtotal={subtotal} />

        <Card>
          <h3 className="mb-4 text-subtitle text-text-primary">
            Payment Method
          </h3>
          <PaymentMethodSelector
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />
        </Card>
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

import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOrderService } from "@/features/order/hooks/useOrder";
import type { ICartItem, PaymentMethod } from "@/features/pos/types/pos.model";
import OrderSummary from "@/features/pos/components/order-summary";
import PaymentMethodSelector from "@/features/pos/components/payment-method";
import { Button } from "@/shared/components/ui/button";

const PaymentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const storeId = Number(id);

  const { items, subtotal } = (location.state as {
    items: ICartItem[];
    subtotal: number;
  }) || { items: [], subtotal: 0 };

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [receivedAmount, setReceivedAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const { createMutation } = useOrderService({ storeId });

  const change = paymentMethod === "CASH" && receivedAmount
    ? Math.max(0, Number(receivedAmount) - subtotal)
    : 0;

  const canConfirm =
    items.length > 0 &&
    (paymentMethod !== "CASH" || Number(receivedAmount) >= subtotal);

  const handleConfirmPayment = async () => {
    if (!canConfirm) return;
    setIsProcessing(true);

    try {
      // Create order via existing order service
      const orderNumber = `POS-${Date.now()}`;
      await createMutation.mutateAsync({
        storeId,
        orderNumber,
        products: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // Navigate to success page
      navigate(`/store/${id}/pos/payment/success`, {
        state: {
          receiptId: orderNumber,
          items,
          subtotal,
          paymentMethod,
          receivedAmount: Number(receivedAmount) || subtotal,
          change,
        },
        replace: true,
      });
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    navigate(`/store/${id}/pos`);
  };

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-4">No items to pay for.</p>
          <Button onClick={handleCancel}>Back to POS</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Payment</h1>

      <OrderSummary items={items} subtotal={subtotal} />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-800 mb-4">Payment Method</h3>
        <PaymentMethodSelector
          selected={paymentMethod}
          onSelect={setPaymentMethod}
        />
      </div>

      {paymentMethod === "CASH" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Cash Payment</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Received Amount
              </label>
              <input
                type="number"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                placeholder="0.00"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-lg font-semibold focus:outline-none focus:border-black"
              />
            </div>
            {Number(receivedAmount) > 0 && (
              <div className="flex justify-between text-lg font-bold">
                <span>Change</span>
                <span className="text-green-600">฿{change.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {paymentMethod === "QR" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
          <h3 className="font-bold text-gray-800 mb-4">QR Code Payment</h3>
          <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto flex items-center justify-center text-gray-400">
            QR Code Placeholder
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Scan to pay ฿{subtotal.toFixed(2)}
          </p>
        </div>
      )}

      {paymentMethod === "TRANSFER" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-800 mb-4">Bank Transfer</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Bank</span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Account</span>
              <span className="font-medium">-</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Amount</span>
              <span className="font-bold">฿{subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="flex-1 h-12"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmPayment}
          disabled={!canConfirm || isProcessing}
          className="flex-1 h-12 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-base font-bold"
        >
          {isProcessing ? "Processing..." : `Confirm Payment`}
        </Button>
      </div>
    </div>
  );
};

export default PaymentPage;

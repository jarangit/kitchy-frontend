import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LuX } from "react-icons/lu";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { orderApiService } from "@/features/order/services/order";
import { getOrderTypeStrategy } from "@/features/order/strategies/order-type-strategy";
import { PosCoachOverlay } from "@/features/onboarding/components/pos-coach-overlay";
import CartArea, { type CartMode } from "@/features/pos/components/cart-area";
import CategoryTabs from "@/features/pos/components/category-tabs";
import PosPaymentView from "@/features/pos/components/pos-payment-view";
import PosSuccessView from "@/features/pos/components/pos-success-view";
import ProductGrid from "@/features/pos/components/product-grid";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import { getPaymentStrategy } from "@/features/pos/strategies/payment-strategy";
import type { OrderType, PaymentMethod } from "@/features/pos/types/pos.model";
import { getNextDeliveryOrderNumber } from "@/features/pos/utils/get-next-delivery-order-number";
import { getNextQueueNumber } from "@/features/pos/utils/get-next-queue-number";
import { useProductService } from "@/features/product/hooks/useProductService";
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";
import { Button } from "@/shared/components/ui/button";
import { InlineAlert } from "@/shared/components/ui/inline-alert";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/i18n/use-translation";
import { toast } from "@/shared/services/toast-service";

type PosView = "BROWSE" | "PAYMENT_SUMMARY" | "PAYMENT_METHOD" | "SUCCESS";

const PosHomePage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isCartPanelOpen, setIsCartPanelOpen] = useState(false);
  const [activeView, setActiveView] = useState<PosView>("BROWSE");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("QR");
  const [receivedAmount, setReceivedAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    productsQuery,
    productsQueryLoading,
    productsByCategoryQuery,
    productsByCategoryLoading,
  } = useProductService(selectedCategory);
  const { categoriesQuery } = useCategoryService();
  const cart = useCartContext();
  const { createMutation, ordersQuery } = useOrderService({});
  const { settings } = useStoreSettings();

  const suggestedDeliveryOrderNumber = useMemo(
    () => getNextDeliveryOrderNumber(ordersQuery, cart.deliveryPlatform),
    [ordersQuery, cart.deliveryPlatform],
  );

  const categories = useMemo(
    () =>
      categoriesQuery.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    [categoriesQuery],
  );

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "ALL") return productsQuery;
    return productsByCategoryQuery;
  }, [productsByCategoryQuery, productsQuery, selectedCategory]);

  const quantityByProductId = useMemo(
    () =>
      cart.items.reduce<Record<string, number>>((acc, item) => {
        acc[item.productId] = item.quantity;
        return acc;
      }, {}),
    [cart.items],
  );

  const isProductsLoading =
    selectedCategory === "ALL"
      ? productsQueryLoading
      : productsByCategoryLoading;
  const isDelivery = cart.orderType === "DELIVERY";
  const paymentStrategy = getPaymentStrategy(paymentMethod);
  const orderTypeStrategy = cart.orderType
    ? getOrderTypeStrategy(cart.orderType)
    : null;

  const canConfirmOrder =
    cart.items.length > 0 &&
    cart.orderType != null &&
    (orderTypeStrategy
      ? orderTypeStrategy.isValid({
          tableNumber: cart.tableNumber,
          customerName: cart.customerName,
          deliveryPlatform: cart.deliveryPlatform,
          deliveryOrderNumber: cart.deliveryOrderNumber,
        })
      : false);

  const canConfirm =
    cart.items.length > 0 &&
    cart.orderType != null &&
    paymentStrategy.canConfirm({
      total: cart.subtotal,
      received: receivedAmount ? Number(receivedAmount) : undefined,
    }) &&
    (orderTypeStrategy
      ? orderTypeStrategy.isValid({
          tableNumber: cart.tableNumber,
          customerName: cart.customerName,
          deliveryPlatform: cart.deliveryPlatform,
          deliveryOrderNumber: cart.deliveryOrderNumber,
        })
      : false);

  const validationMessage =
    activeView === "SUCCESS"
      ? null
      : cart.orderType == null
        ? t("pos.cart.chooseOrderTypeBeforePay")
        : cart.orderType === "DINE_IN" && !cart.tableNumber
          ? t("pos.payment.selectTableFirst")
          : cart.orderType === "DELIVERY" &&
              cart.deliveryPlatform.trim().length === 0
            ? t("pos.payment.selectPlatformFirst")
            : paymentMethod === "CASH" &&
                receivedAmount.trim().length > 0 &&
                Number(receivedAmount) < cart.subtotal
              ? t("pos.payment.insufficientCash")
              : null;

  const hintText =
    activeView === "PAYMENT_METHOD"
      ? paymentMethod === "CASH"
        ? t("pos.payment.nextStepCash")
        : t("pos.payment.nextStepQr")
      : null;

  const mobileRequirementMessage =
    cart.orderType == null
      ? null
      : cart.orderType === "DINE_IN" && !cart.tableNumber
        ? t("pos.cart.selectTableBeforePay")
        : cart.orderType === "DELIVERY" &&
            cart.deliveryPlatform.trim().length === 0
          ? t("pos.cart.selectDeliveryPlatformBeforePay")
          : null;

  const handleDecreaseQuantity = (productId: string) => {
    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );
    if (!existingItem) return;

    if (existingItem.quantity <= 1) {
      cart.removeItem(existingItem.cartItemId);
      return;
    }

    cart.updateQuantity(existingItem.cartItemId, existingItem.quantity - 1);
  };

  const handlePay = () => {
    if (settings.paused) {
      toast.warning({ title: t("pos.cart.paused") });
      return;
    }

    setErrorMessage(null);
    setIsCartPanelOpen(false);
    setActiveView("PAYMENT_SUMMARY");
  };

  const handleBackToBrowse = () => {
    setErrorMessage(null);
    setActiveView("BROWSE");
  };

  const handleBackToSummary = () => {
    setErrorMessage(null);
    setActiveView("PAYMENT_SUMMARY");
  };

  const handleContinueFromSummary = async () => {
    if (isDelivery) {
      await handleConfirmPayment("DELIVERY_PLATFORM");
      return;
    }

    setActiveView("PAYMENT_METHOD");
  };

  const handleNewOrder = () => {
    cart.clearPaymentResult();
    setPaymentMethod("QR");
    setReceivedAmount("");
    setErrorMessage(null);
    setActiveView("BROWSE");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmPayment = async (method: PaymentMethod) => {
    const canProceed =
      method === "DELIVERY_PLATFORM" ? canConfirmOrder : canConfirm;
    if (!canProceed || isProcessing) return;

    setIsProcessing(true);
    setErrorMessage(null);

    const methodChange = getPaymentStrategy(method).calcChange({
      total: cart.subtotal,
      received: receivedAmount ? Number(receivedAmount) : undefined,
    });

    try {
      const orderNumber = getNextQueueNumber(ordersQuery);

      const createdResponse = await createMutation.mutateAsync({
        orderNumber,
        orderType: cart.orderType as OrderType,
        tableNumber:
          cart.orderType === "DINE_IN"
            ? (cart.tableNumber ?? undefined)
            : undefined,
        customerName:
          cart.orderType === "DELIVERY" ? cart.customerName.trim() : undefined,
        deliveryPlatform:
          cart.orderType === "DELIVERY"
            ? cart.deliveryPlatform.trim()
            : undefined,
        deliveryOrderNumber:
          cart.orderType === "DELIVERY"
            ? cart.deliveryOrderNumber.trim()
            : undefined,
        products: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          note: item.note?.trim() || undefined,
        })),
      });

      const createdOrder =
        "data" in createdResponse
          ? ((createdResponse.data as { data?: { id?: string }; id?: string })
              ?.data ?? createdResponse.data)
          : createdResponse;

      const orderId =
        createdOrder && typeof createdOrder === "object" && "id" in createdOrder
          ? (createdOrder as { id: string }).id
          : undefined;

      let receiptId = orderNumber;
      if (orderId) {
        const payResponse = await orderApiService.pay(orderId, {
          method,
          amount: cart.subtotal,
          receivedAmount: receivedAmount ? Number(receivedAmount) : undefined,
        });
        const payData =
          (payResponse as { data?: { data?: unknown } })?.data?.data ??
          (payResponse as { data?: unknown })?.data ??
          payResponse;
        const payment =
          (payData as { payment?: { receiptId?: string } })?.payment ?? payData;
        receiptId =
          (payment as { receiptId?: string })?.receiptId ?? orderNumber;
      }

      cart.setPaymentResult({
        receiptId,
        items: [...cart.items],
        subtotal: cart.subtotal,
        paymentMethod: method,
        receivedAmount: Number(receivedAmount) || cart.subtotal,
        change: methodChange,
        orderType: cart.orderType as OrderType,
        tableNumber: cart.tableNumber,
        customerName: cart.customerName,
        deliveryPlatform: cart.deliveryPlatform,
        deliveryOrderNumber: cart.deliveryOrderNumber,
      });

      cart.clearCart();
      setReceivedAmount("");
      setActiveView("SUCCESS");
    } catch (error) {
      console.error("Payment failed:", error);
      setErrorMessage(t("pos.payment.failed"));
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const view = searchParams.get("view");

    if (view === "payment" && activeView === "BROWSE") {
      if (cart.items.length > 0 && cart.orderType) {
        setActiveView("PAYMENT_SUMMARY");
      }

      const next = new URLSearchParams(searchParams);
      next.delete("view");
      setSearchParams(next, { replace: true });
    }

    if (view === "success" && activeView === "BROWSE") {
      if (cart.paymentResult) {
        setActiveView("SUCCESS");
      }

      const next = new URLSearchParams(searchParams);
      next.delete("view");
      setSearchParams(next, { replace: true });
    }
  }, [
    activeView,
    cart.items.length,
    cart.orderType,
    cart.paymentResult,
    searchParams,
    setSearchParams,
  ]);

  useEffect(() => {
    if (!cart.paymentResult && activeView === "SUCCESS") {
      setActiveView("BROWSE");
    }
  }, [activeView, cart.paymentResult]);

  useEffect(() => {
    if (activeView !== "BROWSE") {
      setIsCartPanelOpen(false);
    }
  }, [activeView]);

  const cartMode: CartMode =
    activeView === "PAYMENT_SUMMARY"
      ? "PAYMENT_SUMMARY"
      : activeView === "PAYMENT_METHOD"
        ? "PAYMENT_METHOD"
        : activeView === "SUCCESS"
          ? "SUCCESS"
          : "BROWSE";

  return (
    <div className="flex h-full min-h-0 flex-col">
      {settings.paused && (
        <div className="shrink-0 p-card-padding pb-3">
          <InlineAlert tone="warning">{t("pos.cart.paused")}</InlineAlert>
        </div>
      )}

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <div className="flex min-w-0 flex-1 overflow-hidden bg-bg">
          {activeView === "BROWSE" && (
            <div className="page-stack-tight flex min-w-0 flex-1 overflow-hidden p-card-padding">
              <CategoryTabs
                categories={categories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
              />

              <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {isProductsLoading ? (
                  <div className="page-grid grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                    {Array.from({ length: 10 }).map((_, i) => (
                      <SkeletonCard key={i} className="min-h-[140px]" />
                    ))}
                  </div>
                ) : (
                  <ProductGrid
                    products={
                      filteredProducts?.map(
                        (p: {
                          id: string;
                          name: string;
                          price?: number;
                          imageUrl?: string | null;
                        }) => ({
                          id: String(p.id),
                          name: p.name,
                          price: p.price ?? 0,
                          imageUrl: p.imageUrl,
                        }),
                      ) || []
                    }
                    onAddToCart={cart.addItem}
                    onDecreaseQuantity={handleDecreaseQuantity}
                    quantityByProductId={quantityByProductId}
                  />
                )}
              </div>
            </div>
          )}

          {activeView === "PAYMENT_SUMMARY" && (
            <div className="flex min-w-0 flex-1 overflow-hidden">
              <PosPaymentView
                step="SUMMARY"
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                receivedAmount={receivedAmount}
                onReceivedAmountChange={setReceivedAmount}
              />
            </div>
          )}

          {activeView === "PAYMENT_METHOD" && (
            <div className="flex min-w-0 flex-1 overflow-hidden">
              <PosPaymentView
                step="METHOD"
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
                receivedAmount={receivedAmount}
                onReceivedAmountChange={setReceivedAmount}
              />
            </div>
          )}

          {activeView === "SUCCESS" && (
            <div className="flex min-w-0 flex-1 overflow-hidden">
              <PosSuccessView onBackToBrowse={handleBackToBrowse} />
            </div>
          )}
        </div>

        <div className="hidden min-h-0 w-pos-cart-width shrink-0 border-l border-card-border lg:flex">
          <CartArea
            items={cart.items}
            subtotal={cart.subtotal}
            onUpdateQuantity={cart.updateQuantity}
            onRemoveItem={cart.removeItem}
            onUpdateItemNote={cart.setItemNote}
            onClearCart={cart.clearCart}
            onPay={handlePay}
            orderType={cart.orderType}
            tableNumber={cart.tableNumber}
            customerName={cart.customerName}
            deliveryPlatform={cart.deliveryPlatform}
            deliveryOrderNumber={cart.deliveryOrderNumber}
            suggestedDeliveryOrderNumber={suggestedDeliveryOrderNumber}
            onOrderTypeChange={cart.setOrderType}
            onTableNumberChange={cart.setTableNumber}
            onCustomerNameChange={cart.setCustomerName}
            onDeliveryPlatformChange={cart.setDeliveryPlatform}
            onDeliveryOrderNumberChange={cart.setDeliveryOrderNumber}
            mode={cartMode}
            readOnly={
              activeView === "PAYMENT_SUMMARY" ||
              activeView === "PAYMENT_METHOD"
            }
            onBack={
              activeView === "PAYMENT_SUMMARY"
                ? handleBackToBrowse
                : activeView === "PAYMENT_METHOD"
                  ? handleBackToSummary
                  : undefined
            }
            onContinue={
              activeView === "PAYMENT_SUMMARY"
                ? handleContinueFromSummary
                : undefined
            }
            onConfirm={
              activeView === "PAYMENT_METHOD"
                ? () => handleConfirmPayment(paymentMethod)
                : undefined
            }
            onNewOrder={activeView === "SUCCESS" ? handleNewOrder : undefined}
            onPrint={activeView === "SUCCESS" ? handlePrint : undefined}
            isProcessing={isProcessing}
            errorMessage={errorMessage}
            validationMessage={validationMessage}
            hintText={hintText}
            canContinue={isDelivery ? canConfirmOrder : cart.items.length > 0}
            canConfirm={canConfirm}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card-bg p-4 shadow-cart-dock lg:hidden">
        {activeView === "BROWSE" && (
          <>
            {cart.totalItems > 0 && (
              <div className="mb-3 flex items-center justify-between gap-3 text-body-sm text-text-secondary">
                <span>
                  {t("pos.cart.itemCount", { count: String(cart.totalItems) })}
                </span>
                <span className="font-semibold tabular-nums text-text-primary">
                  ฿{cart.subtotal.toFixed(2)}
                </span>
              </div>
            )}
            {mobileRequirementMessage && cart.totalItems > 0 && (
              <p className="mb-3 rounded-card bg-warning-bg px-3 py-2 text-label font-medium text-warning">
                {mobileRequirementMessage}
              </p>
            )}
            <Button
              size="lg"
              className="w-full whitespace-normal text-center text-title tabular-nums leading-6"
              disabled={cart.totalItems === 0}
              onClick={() => setIsCartPanelOpen(true)}
            >
              {cart.totalItems > 0
                ? t("pos.cart.mobileOpen")
                : t("pos.cart.pay", { amount: `฿${cart.subtotal.toFixed(2)}` })}
            </Button>
          </>
        )}

        {activeView === "PAYMENT_SUMMARY" && (
          <div className="space-y-3">
            {(errorMessage || validationMessage) && (
              <InlineAlert tone={errorMessage ? "danger" : "warning"}>
                {errorMessage ?? validationMessage}
              </InlineAlert>
            )}
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={handleBackToBrowse}
              disabled={isProcessing}
            >
              {t("pos.payment.backToPos")}
            </Button>
            <Button
              size="lg"
              className="w-full whitespace-normal text-center text-title leading-6"
              onClick={handleContinueFromSummary}
              disabled={isDelivery ? !canConfirmOrder : cart.items.length === 0}
              loading={isProcessing}
              loadingText={t("pos.payment.processing")}
            >
              {isDelivery
                ? t("pos.payment.confirmOrder")
                : t("pos.payment.continueToPayment")}
            </Button>
          </div>
        )}

        {activeView === "PAYMENT_METHOD" && (
          <div className="space-y-3">
            {hintText && (
              <p className="rounded-card bg-bg px-3 py-2 text-caption leading-5 text-text-secondary">
                {hintText}
              </p>
            )}
            {(errorMessage || validationMessage) && (
              <InlineAlert tone={errorMessage ? "danger" : "warning"}>
                {errorMessage ?? validationMessage}
              </InlineAlert>
            )}
            <Button
              variant="ghost"
              size="lg"
              className="w-full"
              onClick={handleBackToSummary}
              disabled={isProcessing}
            >
              {t("pos.payment.backToSummary")}
            </Button>
            <Button
              size="lg"
              className="w-full whitespace-normal text-center text-title leading-6"
              onClick={() => handleConfirmPayment(paymentMethod)}
              disabled={!canConfirm || isProcessing}
              loading={isProcessing}
              loadingText={t("pos.payment.processing")}
            >
              {paymentMethod === "QR"
                ? t("pos.payment.confirmQr")
                : t("pos.payment.confirm")}
            </Button>
          </div>
        )}

        {activeView === "SUCCESS" && cart.paymentResult && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-label text-text-secondary">
                {t("pos.receipt.total")}
              </span>
              <span className="text-title tabular-nums text-text-primary">
                ฿{cart.paymentResult.subtotal.toFixed(2)}
              </span>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={handlePrint}
            >
              {t("pos.success.printReceipt")}
            </Button>
            <Button size="lg" className="w-full" onClick={handleNewOrder}>
              {t("pos.success.newOrder")}
            </Button>
          </div>
        )}
      </div>

      {activeView === "BROWSE" && isCartPanelOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={t("pos.cart.title")}
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card-bg px-4 py-3">
            <div>
              <p className="text-label text-text-tertiary">
                {t("pos.cart.title")}
              </p>
              <p className="text-body font-semibold text-text-primary">
                {t("pos.cart.itemCount", { count: String(cart.totalItems) })}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setIsCartPanelOpen(false)}
              aria-label={t("common.close")}
            >
              <LuX className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
          <div className="min-h-0 flex-1">
            <CartArea
              items={cart.items}
              subtotal={cart.subtotal}
              onUpdateQuantity={cart.updateQuantity}
              onRemoveItem={cart.removeItem}
              onUpdateItemNote={cart.setItemNote}
              onClearCart={cart.clearCart}
              onPay={handlePay}
              orderType={cart.orderType}
              tableNumber={cart.tableNumber}
              customerName={cart.customerName}
              deliveryPlatform={cart.deliveryPlatform}
              deliveryOrderNumber={cart.deliveryOrderNumber}
              suggestedDeliveryOrderNumber={suggestedDeliveryOrderNumber}
              onOrderTypeChange={cart.setOrderType}
              onTableNumberChange={cart.setTableNumber}
              onCustomerNameChange={cart.setCustomerName}
              onDeliveryPlatformChange={cart.setDeliveryPlatform}
              onDeliveryOrderNumberChange={cart.setDeliveryOrderNumber}
            />
          </div>
        </div>
      )}

      {activeView === "BROWSE" && (
        <PosCoachOverlay
          cartItemCount={cart.totalItems}
          subtotal={cart.subtotal}
        />
      )}
    </div>
  );
};

export default PosHomePage;

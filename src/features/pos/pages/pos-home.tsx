import { useMemo, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuX } from "react-icons/lu";
import { useProductService } from "@/features/product/hooks/useProductService";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import CategoryTabs from "@/features/pos/components/category-tabs";
import ProductGrid from "@/features/pos/components/product-grid";
import CartArea from "@/features/pos/components/cart-area";
import { PosCoachOverlay } from "@/features/onboarding/components/pos-coach-overlay";
import { Button } from "@/shared/components/ui/button";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/i18n/use-translation";

const PosHomePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const cartRailStyle = {
    "--pos-cart-width": "460px",
  } as CSSProperties;
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isCartPanelOpen, setIsCartPanelOpen] = useState(false);

  const {
    productsQuery,
    productsQueryLoading,
    productsByCategoryQuery,
    productsByCategoryLoading,
  } = useProductService(selectedCategory);
  const { categoriesQuery } = useCategoryService();
  const cart = useCartContext();

  const categories = useMemo(
    () =>
      categoriesQuery.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    [categoriesQuery]
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
    [cart.items]
  );

  const isProductsLoading =
    selectedCategory === "ALL" ? productsQueryLoading : productsByCategoryLoading;
  const mobileRequirementMessage =
    cart.orderType === "DINE_IN" && !cart.tableNumber
      ? t("pos.cart.selectTableBeforePay")
      : cart.orderType === "DELIVERY" && cart.deliveryPlatform.trim().length === 0
        ? t("pos.cart.selectDeliveryPlatformBeforePay")
        : null;

  const handlePay = () => {
    setIsCartPanelOpen(false);
    navigate(`/store/${id}/pos/payment`);
  };

  const handleDecreaseQuantity = (productId: string) => {
    const existingItem = cart.items.find((item) => item.productId === productId);
    if (!existingItem) return;

    if (existingItem.quantity <= 1) {
      cart.removeItem(existingItem.cartItemId);
      return;
    }

    cart.updateQuantity(existingItem.cartItemId, existingItem.quantity - 1);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Main content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Product area */}
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
                    (p: { id: string; name: string; price?: number }) => ({
                      id: String(p.id),
                      name: p.name,
                      price: p.price ?? 0,
                    })
                  ) || []
                }
                onAddToCart={cart.addItem}
                onDecreaseQuantity={handleDecreaseQuantity}
                quantityByProductId={quantityByProductId}
              />
            )}
          </div>
        </div>

        {/* Desktop cart rail */}
        <div
          className="hidden min-h-0 w-[var(--pos-cart-width)] shrink-0 border-l border-card-border lg:flex"
          style={cartRailStyle}
        >
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
            deliveryPlatform={cart.deliveryPlatform}
            deliveryOrderNumber={cart.deliveryOrderNumber}
            onOrderTypeChange={cart.setOrderType}
            onTableNumberChange={cart.setTableNumber}
            onDeliveryPlatformChange={cart.setDeliveryPlatform}
            onDeliveryOrderNumberChange={cart.setDeliveryOrderNumber}
          />
        </div>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card-bg p-4 shadow-cart-dock lg:hidden">
        {cart.totalItems > 0 && (
          <div className="mb-3 flex items-center justify-between gap-3 text-body-sm text-text-secondary">
            <span>{t("pos.cart.itemCount", { count: String(cart.totalItems) })}</span>
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
      </div>

      {isCartPanelOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-bg lg:hidden" role="dialog" aria-modal="true" aria-label={t("pos.cart.title")}>
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card-bg px-4 py-3">
            <div>
              <p className="text-label text-text-tertiary">{t("pos.cart.title")}</p>
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
              deliveryPlatform={cart.deliveryPlatform}
              deliveryOrderNumber={cart.deliveryOrderNumber}
              onOrderTypeChange={cart.setOrderType}
              onTableNumberChange={cart.setTableNumber}
              onDeliveryPlatformChange={cart.setDeliveryPlatform}
              onDeliveryOrderNumberChange={cart.setDeliveryOrderNumber}
            />
          </div>
        </div>
      )}
      <PosCoachOverlay
        cartItemCount={cart.totalItems}
        subtotal={cart.subtotal}
      />
    </div>
  );
};

export default PosHomePage;

import { useNavigate, useParams } from "react-router-dom";
import { useMemo, useState, useCallback } from "react";
import { useProductService } from "@/features/product/hooks/useProductService";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useCartContext } from "@/features/pos/context/cartContext";
import PosHeader from "@/features/pos/components/header";
import CategoryTabs from "@/features/pos/components/category-tabs";
import ProductGrid from "@/features/pos/components/product-grid";
import CartArea from "@/features/pos/components/cart-area";
import PosPaymentOverlay from "@/features/pos/components/pos-payment-overlay";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { LuX } from "react-icons/lu";

const PosHomePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const { storeFinOneQuery } = useStoreService({});
  const {
    productsQuery,
    productsQueryLoading,
    productsByCategoryQuery,
    productsByCategoryLoading,
  } = useProductService(selectedCategory);
  const { categoriesQuery } = useCategoryService();
  const cart = useCartContext();

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

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

  const isProductsLoading =
    selectedCategory === "ALL" ? productsQueryLoading : productsByCategoryLoading;

  const handlePay = () => {
    setIsCartOpen(false);
    setIsPaymentOpen(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PosHeader
        shopName={storeFinOneQuery?.name || "Store"}
        onCartClick={toggleCart}
        cartItemCount={cart.totalItems}
        onExit={() => navigate(`/store/${id}`)}
      />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Product area */}
        <div className="flex-1 flex flex-col min-w-0 p-4 overflow-hidden">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <div className="flex-1 overflow-y-auto mt-3">
            {isProductsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {Array.from({ length: 10 }).map((_, i) => (
                  <SkeletonCard key={i} className="min-h-[120px]" />
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
              />
            )}
          </div>
        </div>

        {/* Desktop cart — always visible on lg+ */}
        <div className="hidden lg:flex w-[380px] shrink-0 border-l border-[var(--color-border)]">
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
            onOrderTypeChange={cart.setOrderType}
            onTableNumberChange={cart.setTableNumber}
            onDeliveryPlatformChange={cart.setDeliveryPlatform}
          />
        </div>
      </div>

      {/* Tablet / mobile cart overlay */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-[var(--color-overlay)] transition-opacity duration-[var(--motion-normal)]"
            onClick={closeCart}
          />

          {/* Slide-in panel */}
          <div className="absolute top-0 right-0 bottom-0 w-full max-w-[400px] bg-[var(--color-bg)] border-l border-[var(--color-border)] shadow-sm animate-slide-in-right">
            {/* Close button */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--color-border)]">
              <span className="text-lg font-bold text-[var(--color-text-primary)]">
                Cart
              </span>
              <button
                onClick={closeCart}
                className="w-11 h-11 flex items-center justify-center rounded-xl bg-[var(--color-surface)] hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
              >
                <LuX size={20} />
              </button>
            </div>

            {/* Cart content */}
            <div className="h-[calc(100%-60px)]">
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
                onOrderTypeChange={cart.setOrderType}
                onTableNumberChange={cart.setTableNumber}
                onDeliveryPlatformChange={cart.setDeliveryPlatform}
              />
            </div>
          </div>
        </div>
      )}

      <PosPaymentOverlay
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />
    </div>
  );
};

export default PosHomePage;

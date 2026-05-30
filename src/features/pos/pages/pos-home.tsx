import { useMemo, useState, type CSSProperties } from "react";
import { useProductService } from "@/features/product/hooks/useProductService";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { useCartContext } from "@/features/pos/context/cart-hooks";
import CategoryTabs from "@/features/pos/components/category-tabs";
import ProductGrid from "@/features/pos/components/product-grid";
import CartArea from "@/features/pos/components/cart-area";
import PosPaymentOverlay from "@/features/pos/components/pos-payment-overlay";
import { PosCoachOverlay } from "@/features/onboarding/components/pos-coach-overlay";
import { SkeletonCard } from "@/shared/components/ui/skeleton";

const PosHomePage = () => {
  const cartRailStyle = {
    "--pos-cart-width": "460px",
  } as CSSProperties;
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const {
    productsQuery,
    productsQueryLoading,
    productsByCategoryQuery,
    productsByCategoryLoading,
  } = useProductService(selectedCategory);
  const { categoriesQuery } = useCategoryService();
  const cart = useCartContext();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

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

  const handlePay = () => {
    setIsPaymentOpen(true);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Main content */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Product area */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden px-6 py-6">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          <div className="mt-5 flex-1 overflow-y-auto">
            {isProductsLoading ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
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
                quantityByProductId={quantityByProductId}
              />
            )}
          </div>
        </div>

        {/* iPad-first cart rail */}
        <div
          className="hidden min-h-0 w-[var(--pos-cart-width)] shrink-0 border-l border-card-border md:flex"
          style={cartRailStyle}
        >
          <CartArea
            items={cart.items}
            subtotal={cart.subtotal}
            onUpdateQuantity={cart.updateQuantity}
            onRemoveItem={cart.removeItem}
            onUpdateItemNote={cart.setItemNote}
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

      <PosPaymentOverlay
        open={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
      />

      <PosCoachOverlay
        cartItemCount={cart.totalItems}
        subtotal={cart.subtotal}
      />
    </div>
  );
};

export default PosHomePage;

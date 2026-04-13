import { useParams, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { useProductService } from "@/features/product/hooks/useProductService";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useCart } from "@/features/pos/hooks/useCart";
import PosHeader from "@/features/pos/components/header";
import CategoryTabs from "@/features/pos/components/category-tabs";
import ProductGrid from "@/features/pos/components/product-grid";
import CartArea from "@/features/pos/components/cart-area";

const PosHomePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storeId = Number(id);

  const { storeFinOneQuery } = useStoreService({ storeId });
  const { productsQuery, productsQueryLoading } = useProductService(storeId);
  const cart = useCart();

  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // Extract unique category names from products (using station as category proxy)
  const categories = useMemo(() => {
    if (!productsQuery) return [];
    const unique = new Set<string>();
    productsQuery.forEach((p: { stationName?: string }) => {
      if (p.stationName) unique.add(p.stationName);
    });
    return Array.from(unique);
  }, [productsQuery]);

  // Filter products by selected category
  const filteredProducts = useMemo(() => {
    if (!productsQuery) return [];
    if (selectedCategory === "ALL") return productsQuery;
    return productsQuery.filter(
      (p: { stationName?: string }) => p.stationName === selectedCategory
    );
  }, [productsQuery, selectedCategory]);

  const handlePay = () => {
    // Navigate to payment page with cart data via state
    navigate(`/store/${id}/pos/payment`, {
      state: {
        items: cart.items,
        subtotal: cart.subtotal,
      },
    });
  };

  if (productsQueryLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen -m-4">
      <PosHeader shopName={storeFinOneQuery?.name || "Store"} />

      <div className="flex flex-1 overflow-hidden">
        {/* Product Area */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
          <CategoryTabs
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <div className="flex-1 overflow-y-auto mt-3">
            <ProductGrid
              products={
                filteredProducts?.map(
                  (p: { id: number; name: string; price?: number }) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price ?? 0,
                  })
                ) || []
              }
              onAddToCart={cart.addItem}
            />
          </div>
        </div>

        {/* Cart Area */}
        <div className="w-[350px] border-l border-gray-200 p-4">
          <CartArea
            items={cart.items}
            subtotal={cart.subtotal}
            onUpdateQuantity={cart.updateQuantity}
            onRemoveItem={cart.removeItem}
            onClearCart={cart.clearCart}
            onPay={handlePay}
          />
        </div>
      </div>
    </div>
  );
};

export default PosHomePage;

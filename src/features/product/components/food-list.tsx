/* eslint-disable @typescript-eslint/no-explicit-any */
import { useProductService } from "@/features/product/hooks/useProductService";
import AddUpProductForm from "@/features/product/components/add-up-product";
import { ProductCard } from "@/features/product/components/product-card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { LuPackage } from "react-icons/lu";
import { SettingsSectionCard } from "@/features/store/components/settings-shell";

const ProductListTemplate = () => {
  const {
    productsQuery,
    createMenuMutation: createProductMutation,
    deleteMenuMutation: deleteProductMutation,
  } = useProductService();

  return (
    <div className="space-y-6">
      <SettingsSectionCard
        title="Product List"
        description="Browse current products and add new items for your store menu."
      >
        {productsQuery && productsQuery.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsQuery.map((menu: any) => (
              <ProductCard
                key={menu.id}
                id={menu.id}
                name={menu.name}
                isActive={menu.isActive}
                onDelete={(itemId: string) => {
                  deleteProductMutation.mutate(itemId);
                }}
                showAddButton={menu.showAddButton}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<LuPackage size={32} />}
            title="No products found"
            description="Add your first product to get started"
          />
        )}
      </SettingsSectionCard>

      <AddUpProductForm
        _onSubmit={(data) => {
          createProductMutation.mutate({
            ...data,
          });
        }}
      />
    </div>
  );
};

export default ProductListTemplate;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useProductService } from "@/features/product/hooks/useProductService";
import AddUpProductForm from "@/features/product/components/add-up-product";
import { ProductCard } from "@/features/product/components/product-card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { LuPackage } from "react-icons/lu";

const ProductListTemplate = () => {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const {
    productsQuery,
    createMenuMutation: createProductMutation,
    deleteMenuMutation: deleteProductMutation,
  } = useProductService(id as string);

  return (
    <div className="relative">
      <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Product List</h2>
      {productsQuery && productsQuery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

      <AddUpProductForm
        _onSubmit={(data) => {
          createProductMutation.mutate({
            ...data,
            storeId: id,
          });
        }}
      />
    </div>
  );
};

export default ProductListTemplate;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useProductService } from "@/features/product/hooks/useProductService";
import AddUpProductForm from "@/features/product/components/add-up-product";
import { ProductCard } from "@/features/product/components/product-card";

const ProductListTemplate = () => {
  const params = useParams<{ id: string }>();
  const id = params.id ? Number(params.id) : undefined;
  const {
    productsQuery,
    createMenuMutation: createProductMutation,
    deleteMenuMutation: deleteProductMutation,
  } = useProductService(id as number);

  return (
    <div className="relative">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <div className="grid grid-cols-4">
        {productsQuery && productsQuery && productsQuery.length > 0 ? (
          productsQuery.map((menu: any) => (
            <ProductCard
              id={menu.id}
              name={menu.name}
              isActive={menu.isActive}
              onDelete={(itemId: string) => {
                deleteProductMutation.mutate(+itemId);
              }}
              showAddButton={menu.showAddButton}
            />
          ))
        ) : (
          <li>No menus found.</li>
        )}
      </div>

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

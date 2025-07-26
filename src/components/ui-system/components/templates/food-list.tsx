/* eslint-disable @typescript-eslint/no-explicit-any */
import { useParams } from "react-router-dom";
import { useProductService } from "@/hooks/services/useProductService";
import AddUpProductForm from "../ORG/form/add-up-product";
import { ProductCard } from "../ORG/card/product-card";

type Props = {
  data: {
    id: number;
    name: string;
    isActive: boolean;
  }[];
};

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
            restaurantId: id,
          });
        }}
      />
    </div>
  );
};

export default ProductListTemplate;

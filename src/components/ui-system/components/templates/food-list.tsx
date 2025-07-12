/* eslint-disable @typescript-eslint/no-explicit-any */
import AddUpMenuForm from "../ORG/form/add-up-menu";
import { useParams } from "react-router-dom";
import { useProductService } from "@/hooks/services/useProductService";

type Props = {
  data: {
    id: number;
    name: string;
    isActive: boolean;
  }[];
};

const FoodListTemplate = () => {
  const params = useParams<{ id: string }>();
  const id = params.id ? Number(params.id) : undefined;
  const { productsQuery, createMenuMutation: createProductMutation, deleteMenuMutation: deleteProductMutation } =
    useProductService(id as number);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Food List</h2>
      <ul className="list-disc pl-5">
        {productsQuery &&
        productsQuery.data &&
        productsQuery.data.length > 0 ? (
          productsQuery.data.map((menu: any) => (
            <li key={menu.id}>
              {menu.name}
              <div>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteProductMutation.mutate(menu.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))
        ) : (
          <li>No menus found.</li>
        )}
      </ul>

      <AddUpMenuForm
        _onSubmit={(data) => {
          createProductMutation.mutate({
            name: data.name,
            restaurantId: id,
          });
        }}
      />
    </div>
  );
};

export default FoodListTemplate;

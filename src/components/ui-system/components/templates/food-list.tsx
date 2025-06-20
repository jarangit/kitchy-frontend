import AddUpMenuForm from "../ORG/form/add-up-menu";
import { useParams } from "react-router-dom";
import { useMenuService } from "@/hooks/useMenuService";

type Props = {
  data: {
    id: number;
    name: string;
    isActive: boolean;
  }[];
};

const FoodListTemplate = ({  }: Props) => {
  const params = useParams<{ id: string }>();
  const id = params.id ? Number(params.id) : undefined;
  const {
    menusQuery,
    createMenuMutation,
    deleteMenuMutation,
  } = useMenuService(id as number);
  console.log("🚀 ~ FoodListTemplate ~ menusQuery:", menusQuery);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Food List</h2>
      <ul className="list-disc pl-5">
        {menusQuery && menusQuery.data && menusQuery.data.length > 0 ? (
          menusQuery.data.map((menu: any) => (
            <li key={menu.id}>
              {menu.name}
              <div>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => deleteMenuMutation.mutate(menu.id)}
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
          createMenuMutation.mutate({
            name: data.name,
            restaurantId: id,
          });
        }}
      />
    </div>
  );
};

export default FoodListTemplate;

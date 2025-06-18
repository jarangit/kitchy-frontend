import AddUpRestaurantForm from "@/components/ui-system/components/ORG/form/add-up-restaurant";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRestaurantService } from "@/hooks/useRestaurantService";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {};

const SettingRestaurantPage = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const auth = useAuth();
  const { user } = auth || {};
  const userId = auth?.user?.id;

  const { restaurantFinOneQuery, updateRestaurant, deleteRestaurant } =
    useRestaurantService({
      userId,
      restaurantId: id ? +id : undefined,
    });

  return (
    <div className="my-container flex flex-col gap-4 divide-x">
      <Button onClick={() => navigate(`/restaurant-dashboard/${id}`)}>
        Back
      </Button>
      <div className="text-xl">Setting</div>
      <div className="text-lg">Restaurant Setting</div>

      {/* form */}
      <div>
        {restaurantFinOneQuery ? (
          <AddUpRestaurantForm
            defaultValues={{
              name: restaurantFinOneQuery.name,
            }}
            _onSubmit={(data) =>
              updateRestaurant({
                restaurantId: restaurantFinOneQuery.id,
                restaurantData: { name: data.name },
              })
            }
          />
        ) : (
          ""
        )}
      </div>

      {/* delete */}
      <div>
        <Button
          variant="destructive"
          onClick={() => {
            if (restaurantFinOneQuery) {
              if (
                window.confirm(
                  "Are you sure you want to delete this restaurant?"
                )
              ) {
                if (id !== undefined) {
                  deleteRestaurant(+id);
                  navigate(`/user-dashboard`);
                }
              }
            }
          }}
        >
          Delete Restaurant
        </Button>
      </div>
    </div>
  );
};

export default SettingRestaurantPage;

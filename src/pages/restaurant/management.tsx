import FoodListTemplate from "@/components/ui-system/components/templates/food-list";
import StattionListTemplate from "@/components/ui-system/components/templates/stattion-list";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useFoodService } from "@/hooks/useFoodService";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type Props = {};

const RestaurantManagementPage = (props: Props) => {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const { user } = auth || {};
  const userId = auth?.user?.id;
  const restaurantId = id ? +id : undefined;
  const { data: foodList, isLoading } = useFoodService(restaurantId as number);
  const navigate = useNavigate();
  const [menuSelected, setMenuSelected] = useState("food");

  const onSelectMenu = (menu: string) => {
    setMenuSelected(menu);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-container">
      <Button onClick={() => navigate(`/restaurant-dashboard/${restaurantId}`)}>
        Back
      </Button>
      <div>Restaurant Management</div>
      <div>
        <div
          className="text-blue-500 cursor-pointer"
          onClick={() => onSelectMenu("food")}
        >
          Menu management
        </div>
        <div
          className="text-blue-500 cursor-pointer"
          onClick={() => onSelectMenu("station")}
        >
          Station management
        </div>
      </div>

      {/* template */}
      {menuSelected === "food" ? (
        <div>
          <FoodListTemplate data={foodList?.data} />
        </div>
      ) : (
        <div>
          <StattionListTemplate />
        </div>
      )}
    </div>
  );
};

export default RestaurantManagementPage;

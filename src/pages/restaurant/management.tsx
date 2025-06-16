import FoodListTemplate from "@/components/ui-system/components/templates/food-list";
import StattionListTemplate from "@/components/ui-system/components/templates/stattion-list";
import { Button } from "@/components/ui/button";
import { useFoodService } from "@/hooks/useFoodService";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type Props = {};

const RestaurantManagementPage = (props: Props) => {
  const { data: foodList, isLoading } = useFoodService(1);
  console.log("🚀 ~ RestaurantManagementPage ~ foodList:", foodList);
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
      <Button onClick={() => navigate("/restaurant-dashboard/1")}>Back</Button>
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

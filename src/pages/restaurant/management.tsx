import FoodListTemplate from "@/components/ui-system/components/templates/food-list";
import StattionListTemplate from "@/components/ui-system/components/templates/stattion-list";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";


const RestaurantManagementPage = () => {
  const { id } = useParams<{ id: string }>();
  const restaurantId = id ? +id : undefined;

  const navigate = useNavigate();
  const [menuSelected, setMenuSelected] = useState("food");

  const onSelectMenu = (menu: string) => {
    setMenuSelected(menu);
  };

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
          <FoodListTemplate data={[]} />
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

import ProductListTemplate from "@/features/product/components/food-list";
import StationListTemplate from "@/features/station/components/stattion-list";
import { Button } from "@/shared/components/ui/button";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const StoreManagementPage = () => {
  const { id } = useParams<{ id: string }>();
  const storeId = id ? +id : undefined;

  const navigate = useNavigate();
  const [menuSelected, setMenuSelected] = useState("food");

  const onSelectMenu = (menu: string) => {
    setMenuSelected(menu);
  };

  return (
    <div className="my-container">
      <Button onClick={() => navigate(`/store/${storeId}`)}>
        Back
      </Button>
      <div>Store Management</div>

      <div className="grid grid-cols-4">
        <div className="col-span-1">
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
        </div>
        <div className="col-span-3">
          {" "}
          {/* template */}
          {menuSelected === "food" ? (
            <div>
              <ProductListTemplate />
            </div>
          ) : (
            <div>
              <StationListTemplate />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreManagementPage;

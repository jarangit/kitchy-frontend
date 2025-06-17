// src/pages/UserDashboard.tsx
import AddUpRestaurantForm from "@/components/ui-system/components/ORG/form/add-up-restaurant";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRestaurantService } from "@/hooks/useRestaurantService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: number;
  name: string;
  stationCount: number;
  todayOrderCount: number;
}

export default function UserDashboard() {
  const auth = useAuth();
  const { user } = auth || {};
  const userId = auth?.user?.id;

  const { restaurants, restaurantsLoading, createRestaurant } =
    useRestaurantService({userId});
  const navigate = useNavigate();

  const [isCreate, setIsCreate] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    console.log("User ID:", user?.id);
  }, [user?.id]);

  if (restaurantsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-container">
      <div className="flex justify-end gap-3 border p-4">
        <div>Hello: {user?.email}</div>
        <button onClick={handleLogout}>logout</button>
      </div>
      <div className="flex justify-between items-end mb-6">
        <h1 className="text-2xl font-bold">Your Restaurants</h1>
        <Button onClick={() => setIsCreate(!isCreate)}>
          {!isCreate ? "Build new restaurants" : "Cancel"}
        </Button>
      </div>

      {!isCreate ? (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {restaurants && restaurants?.length
              ? restaurants.map((item: any) => (
                  <div
                    className="bg-blue-300 rounded-lg p-4 cursor-pointer hover:bg-blue-400"
                    onClick={() => navigate(`/restaurant-dashboard/${item.id}`)}
                    key={item.id}
                  >
                    <strong className="">{item.name}</strong>
                  </div>
                ))
              : "No restaurants found"}
          </div>
        </div>
      ) : (
        <AddUpRestaurantForm
          _onSubmit={(data) =>
            createRestaurant({ userId: userId, name: data?.name })
          }
        />
      )}
    </div>
  );
}

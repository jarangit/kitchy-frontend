// src/pages/UserDashboard.tsx
import { restaurantServiceApi } from "@/service/restaurant";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Restaurant {
  id: number;
  name: string;
  stationCount: number;
  todayOrderCount: number;
}

export default function UserDashboard() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [user, setUser] = useState<{ name: string; email: string }>({
    name: "",
    email: "",
  });
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const onGetRestaurants = async (userId: number = 1) => {
    try {
      const res = await restaurantServiceApi.getByUserId(userId);
      setRestaurants(res);
    } catch (error) {
      console.log("🚀 ~ onGetRestaurants ~ error:", error);
    }
  };

  useEffect(() => {
    onGetRestaurants();
  }, []);

  return (
    <div className="my-container">
      <div className="flex justify-end gap-3 border p-4">
        <div>Hello: {user.email}</div>
        <button onClick={handleLogout}>logout</button>
      </div>

      {/* restaurant */}
      <div>
        <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants?.length
            ? restaurants.map((item) => (
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
    </div>
  );
}

import { stationServiceApi } from "@/service/station";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Props = {};

const menuList = [
  { name: "Order view", path: "/restaurant-dashboard/orders" },
  { name: "Stations", path: "/restaurant-dashboard/stations" },
  { name: "Management", path: "/restaurant-dashboard/management" },
  { name: "Live Station Monitor", path: "/restaurant-dashboard/management" },
  { name: "setting", path: "/restaurant-dashboard/management" },
];

const RestaurantDashboardPage = (props: Props) => {
  const [stations, setStations] = useState<any>();
  const onGetStations = async (restaurantId: number) => {
    try {
      // Call the API to get stations by restaurant ID
      const response = await stationServiceApi.getByRestaurantId(restaurantId);
      if (response && response.length > 0) {
        setStations(response);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  useEffect(() => {
    onGetStations(1);
  }, []);
  return (
    <div className="my-container">
      
      <Link to={"/login"}>Back to Home</Link>

      <h1 className="text-2xl font-bold mb-4">Restaurant Dashboard</h1>
      <p>Welcome to the restaurant dashboard!</p>
      {/* Add more content here as needed */}
      {/* list ment */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <ul className="col-span-1 border">
          {menuList.map((item) => (
            <li key={item.name} className="mb-2">
              <Link to={item.path} className="text-blue-500 hover:underline">
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {stations?.length &&
              stations.map((station: any) => (
                <div
                  key={station.id}
                  className="bg-blue-300 rounded-lg p-4 mb-4"
                >
                  <h2 className="text-xl font-semibold">{station.name}</h2>
                  <p>Station ID: {station.id}</p>
                  <p>
                    Created At:{" "}
                    {new Date(station.createdAt).toLocaleDateString()}
                  </p>
                  {/* Add more station details as needed */}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboardPage;

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/shared/components/ui/button";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useRestaurantService } from "@/features/restaurant/hooks/useRestaurantService";
import { stationServiceApi } from "@/features/station/services/station";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const menuList = [
  { name: "Order view", path: "/restaurant-dashboard/orders" },
  { name: "Management", path: "management" },
  { name: "Live Station Monitor", path: "/restaurant-dashboard/management" },
  { name: "setting", path: "setting" },
];

const RestaurantDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    restaurantFinOneQuery,
    restaurantFinOneLoading,
    restaurantFinOneQueryError,
  } = useRestaurantService({
    restaurantId: id ? +id : undefined,
  });
  const { deleteMutation, ordersQuery } = useOrderService({
    restaurantId: id ? +id : undefined,
  });
  const navigate = useNavigate();
  const [stations, setStations] = useState<any>();
  const onGetStations = async (restaurantId: number) => {
    try {
      // Call the API to get stations by restaurant ID
      const response = await stationServiceApi.getByRestaurantId(restaurantId);
      if (response && response.data.length > 0) {
        setStations(response.data);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  // const onGetOrders = async (restaurantId: number) => {
  //   try {
  //     const res = await orderApiService.getOrdersByRestaurantId(restaurantId);
  //     if (res && res.data) {
  //       setOrders(res.data);
  //     }
  //   } catch (error) {
  //     /* empty */
  //   }
  // };

  useEffect(() => {
    if (id) {
      onGetStations(+id);
      // onGetOrders(+id);
    }
  }, [id]);

  if (restaurantFinOneLoading) {
    return <div>Loading...</div>;
  }
  if (restaurantFinOneQueryError) {
    return <div>Error: {restaurantFinOneQueryError}</div>;
  }
  return (
    <div className="my-container">
      <div className="mb-6">
        <Link to={"/login"}>Back to Home</Link>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-4">
            {restaurantFinOneQuery?.name}
          </h1>
          <p>Welcome to the restaurant dashboard!</p>
        </div>
        <Button
          onClick={() => {
            navigate(`/restaurant/${restaurantFinOneQuery.id}/create-order`);
          }}
        >
          New Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <ul className="col-span-1 border">
          {menuList.map((item) => (
            <li key={item.name} className="mb-2">
              <Link
                to={`/restaurant/${restaurantFinOneQuery.id}/${item.path}`}
                className="text-blue-500 hover:underline"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="col-span-3">
          {/* order list  */}
          <div className="bg-gray-200 p-4 rounded-lg">
            <div>Order {ordersQuery?.length}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
              {ordersQuery?.length &&
                ordersQuery.map((order: any) => (
                  <div key={order.id} className="bg-green-300 rounded-lg p-4">
                    <h2 className="text-xl font-semibold">
                      Order ID: {order.orderNumber}
                    </h2>
                    <p>Order Status: {order.status}</p>
                    <p>
                      Created At:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex gap-2">
                      <Button className="bg-blue-800">Edit</Button>
                      <Button
                        className="bg-red-800"
                        onClick={() => {
                          deleteMutation.mutate(order.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {stations?.length &&
              stations.map((station: any) => (
                <Link
                  to={`/restaurant/station/${station.id}`}
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
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDashboardPage;

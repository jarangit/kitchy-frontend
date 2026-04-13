/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/shared/components/ui/button";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { stationServiceApi } from "@/features/station/services/station";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const menuList = [
  { name: "Management", path: "management" },
  { name: "Setting", path: "setting" },
];

const StoreDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const {
    storeFinOneQuery,
    storeFinOneLoading,
    storeFinOneQueryError,
  } = useStoreService({
    storeId: id ? +id : undefined,
  });
  const { deleteMutation, ordersQuery } = useOrderService({
    storeId: id ? +id : undefined,
  });
  const navigate = useNavigate();
  const [stations, setStations] = useState<any>();
  const onGetStations = async (storeId: number) => {
    try {
      const response = await stationServiceApi.getByStoreId(storeId);
      if (response && response.data.length > 0) {
        setStations(response.data);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  useEffect(() => {
    if (id) {
      onGetStations(+id);
    }
  }, [id]);

  if (storeFinOneLoading) {
    return <div>Loading...</div>;
  }
  if (storeFinOneQueryError) {
    return <div>Error: {storeFinOneQueryError}</div>;
  }
  return (
    <div className="my-container">
      <div className="mb-6">
        <Link to={"/dashboard"}>Back to Dashboard</Link>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-4">
            {storeFinOneQuery?.name}
          </h1>
          <p>Welcome to the store dashboard!</p>
        </div>
        <Button
          onClick={() => {
            navigate(`/store/${storeFinOneQuery.id}/create-order`);
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
                to={`/store/${storeFinOneQuery.id}/${item.path}`}
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
                  to={`/store/${id}/station/${station.id}`}
                  key={station.id}
                  className="bg-blue-300 rounded-lg p-4 mb-4"
                >
                  <h2 className="text-xl font-semibold">{station.name}</h2>
                  <p>Station ID: {station.id}</p>
                  <p>
                    Created At:{" "}
                    {new Date(station.createdAt).toLocaleDateString()}
                  </p>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreDashboardPage;

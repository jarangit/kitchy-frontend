/* eslint-disable @typescript-eslint/no-explicit-any */
import { useOrderService } from "@/hooks/useOrder";
import { useStationService } from "@/hooks/useStation";
import React from "react";
import { useParams } from "react-router-dom";

const StationPage = () => {
  const { id } = useParams<{ id: string }>();
  const { stationFinOneQuery } = useStationService({
    stationId: id ? +id : undefined,
  });
  const { orderByStation, orderFindByStationIdQuery }: any = useOrderService({
    stationId: id ? +id : undefined,
  });
  console.log(
    "🚀 ~ StationPage ~ orderByStation, orderFindByStationIdQuery:",
    orderByStation
  );

  if (
    (stationFinOneQuery.isLoading || orderByStation,
    orderFindByStationIdQuery.isLoading)
  ) {
    return <div className="my-container">Loading...</div>;
  }

  return (
    <div className="my-container">
      <h1 className="text-2xl font-bold mb-4">
        Station: {stationFinOneQuery.data?.name}
      </h1>
      <p>Station ID: {stationFinOneQuery.data?.id}</p>
      <p>Restaurant ID: {stationFinOneQuery.data?.restaurantId}</p>
      {/* Add more station details as needed */}
      <hr />

      {/* current order item */}
      <h2 className="text-xl font-semibold mt-6 mb-4">Current Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orderByStation?.length ? (
          orderByStation?.map((order: any) => (
            <div key={order.id} className="bg-green-300 rounded-lg p-4 mb-4">
              <h2 className="text-xl font-semibold">
                Order ID: {order.orderNumber}
              </h2>
              <p>Order Status: {order.status}</p>
              <p>
                Created At: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>Items:</p>
              <ul className="list-disc pl-5">
                {order.items.map((item: any) => (
                  <li key={item.id}>
                    {item.product.name}  {item.quantity}x
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p>No current orders for this station.</p>
        )}
      </div>
    </div>
  );
};

export default StationPage;

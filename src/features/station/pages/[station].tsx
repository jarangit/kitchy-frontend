import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStationService } from "@/features/station/hooks/useStation";
import { useParams } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

interface StationOrder {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const StationPage = () => {
  const { id } = useParams<{ id: string; storeId: string }>();
  const { stationFinOneQuery } = useStationService({
    stationId: id,
  });
  const { orderByStation, orderFindByStationIdQuery } = useOrderService({
    stationId: id,
  });

  if (stationFinOneQuery.isLoading || orderFindByStationIdQuery.isLoading) {
    return <div className="max-w-4xl mx-auto space-y-6">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-heading font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
        Station: {stationFinOneQuery.data?.name}
      </h1>
      <p className="text-[var(--color-text-secondary)]">Station ID: {stationFinOneQuery.data?.id}</p>
      <p className="text-[var(--color-text-secondary)]">Store ID: {stationFinOneQuery.data?.storeId}</p>
      <hr className="border-[var(--color-border)]" />

      {/* current order item */}
      <h2 className="text-subtitle">Current Orders</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orderByStation?.length ? (
          orderByStation?.map((order: StationOrder) => (
            <div key={order.id} className="bg-[var(--color-success-bg)] rounded-radius-sm p-4 mb-4">
              <h3 className="text-subtitle">
                Order ID: {order.orderNumber}
              </h3>
              <p>Order Status: {order.status}</p>
              <p>
                Created At: {new Date(order.createdAt).toLocaleDateString()}
              </p>
              <p>Items:</p>
              <ul className="list-disc pl-5">
                {order.items.map((item: OrderItem) => (
                  <li key={item.id}>
                    {item.name}  {item.quantity}x
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

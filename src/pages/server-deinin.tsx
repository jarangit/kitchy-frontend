/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createOrder, fetchOrders } from "../service/order-service";
import { OrderForm } from "../components/ui-system/components/order-form";
import HeaderSection from "../components/ui-system/components/header-section";

function ServerDineInPage() {
  const [orderType] = useState<"TOGO" | "DINEIN">("DINEIN");
  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmit = async ({ orderNumber, orderType }: any) => {
    if (!orderNumber) return alert("กรุณากรอกหมายเลขออเดอร์");

    const newOrder = await createOrder({ orderNumber: orderNumber, orderType });
    setOrders([newOrder, ...orders]);
  };

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <div>
      <HeaderSection title="Server (Dine-in)" />
      <h3>Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            #{order.orderNumber} - {order.type} - {order.status}
          </li>
        ))}
      </ul>

      <OrderForm
        orderType={orderType}
        label="Order Number"
        buttonColor="bg-blue-500"
        _onSubmit={(e: any) => handleSubmit(e)}
      />
    </div>
  );
}

export default ServerDineInPage;

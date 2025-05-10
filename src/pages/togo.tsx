/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createOrder } from "../service/order-service";
import { OrderForm } from "../components/ui-system/components/order-form";
import HeaderSection from "../components/ui-system/components/header-section";

function TogoPage() {
  const [orderType, setOrderType] = useState<"TOGO" | "DINEIN">("TOGO");
  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmit = async ({ orderType, orderNumber }: any) => {
    if (!orderNumber) return alert("กรุณากรอกหมายเลขออเดอร์");

    const newOrder = await createOrder({ orderNumber: orderNumber, orderType });
    setOrders([newOrder, ...orders]);
  };

  useEffect(() => {
    // fetchOrders().then(setOrders);
    setOrderType("TOGO");
  }, []);

  return (
    <div>
      <HeaderSection title="Front-desk(To-Go)" />
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

export default TogoPage;

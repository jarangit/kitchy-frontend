/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createOrder, fetchOrders } from "../service/order-service";
import { OrderForm } from "../components/ui-system/components/order-form";

function CreateOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [type] = useState<"TOGO" | "DINEIN">("TOGO");
  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmit = async (number: string) => {
    if (!number) return alert("กรุณากรอกหมายเลขออเดอร์");

    const newOrder = await createOrder({
      orderNumber: number,
      orderType: type,
    });
    setOrders([newOrder, ...orders]);
    setOrderNumber("");
    console.log(orderNumber);
  };

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <div>
      <h3>Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            #{order.orderNumber} - {order.type} - {order.status}
          </li>
        ))}
      </ul>

      <OrderForm
        orderType={type}
        label="Order Number"
        buttonColor="bg-blue-500"
        _onSubmit={(e: any) => handleSubmit(e)}
      />
    </div>
  );
}

export default CreateOrder;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createOrder, fetchOrders } from "../service/order-service";
import { OrderForm } from "../components/ui-system/components/order-form";

function CreateOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [type, setType] = useState<"TOGO" | "DINEIN">("TOGO");
  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmit = async (number:string) => {
    if (!number) return alert("กรุณากรอกหมายเลขออเดอร์");

    const newOrder = await createOrder({ orderNumber: number, type });
    setOrders([newOrder, ...orders]);
    setOrderNumber("");
  };

  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>📝 Create New Order</h2>
      <form >
        <input
          type="text"
          placeholder="Order Number (e.g. T001)"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          required
          style={{ marginRight: 10 }}
        />
        <select value={type} onChange={(e) => setType(e.target.value as any)}>
          <option value="TOGO">To-Go</option>
          <option value="DINEIN">Dine-in</option>
        </select>
        <button type="submit" style={{ marginLeft: 10 }}>
          ✅ Create
        </button>
      </form>

      <hr />

      <h3>📦 Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            #{order.orderNumber} - {order.type} - {order.status}
          </li>
        ))}
      </ul>

      <OrderForm
        type={type}
        label="Order Number"
        buttonColor="bg-blue-500"
        _onSubmit={(e) => handleSubmit(e)}
      />
    </div>
  );
}

export default CreateOrder;

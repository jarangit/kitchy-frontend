/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createOrder, fetchOrders } from "../service/order-service";
import { OrderForm } from "../components/ui-system/components/order-form";
import HeaderSection from "../components/ui-system/components/header-section";
import { ListOrders } from "../components/ui-system/components/list-orders";
import { socket } from "../socket";

function TogoPage() {
  const [orderType, setOrderType] = useState<"TOGO" | "DINEIN">("TOGO");
  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmit = async ({ orderType, orderNumber }: any) => {
    if (!orderNumber) return alert("กรุณากรอกหมายเลขออเดอร์");

    const newOrder = await createOrder({ orderNumber: orderNumber, orderType });
    setOrders([newOrder, ...orders]);
  };
  const onGetOrders = async () => {
    try {
      const res: any = await fetchOrders();
      if (res) {
        const filterData = res.filter((i: any) => i.type == orderType);
        setOrders(filterData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });
    socket.on("order-deleted", ({ id }) => {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    });
  }, []);

  useEffect(() => {
    onGetOrders();
    setOrderType("TOGO");
  }, []);

  return (
    <div>
      <HeaderSection title="Front-desk(To-Go)" />
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full">
          <ListOrders orders={orders} />
        </div>
        <OrderForm
          orderType={orderType}
          label="Order Number"
          buttonColor="bg-blue-500"
          _onSubmit={(e: any) => handleSubmit(e)}
        />
      </div>
    </div>
  );
}

export default TogoPage;

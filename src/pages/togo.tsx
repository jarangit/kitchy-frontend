/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createOrder, fetchOrders } from "../service/order-service";
import { OrderForm } from "../components/ui-system/components/order-form";
import HeaderSection from "../components/ui-system/components/header-section";
import { ListOrders } from "../components/ui-system/components/list-orders";
import { socket } from "../socket";
import { toast } from "sonner";

function TogoPage() {
  const [orderType, setOrderType] = useState<"TOGO" | "DINEIN">("TOGO");
  const [orders, setOrders] = useState<any[]>([]);

  const handleSubmit = async ({ orderType, orderNumber }: any) => {
    if (!orderNumber) return alert("กรุณากรอกหมายเลขออเดอร์");

    const newOrder = await createOrder({ orderNumber: orderNumber, orderType });
    setOrders([newOrder, ...orders]);
    toast.success("Order sent to kitchen!");
  };
  const onGetOrders = async () => {
    try {
      const res: any = await fetchOrders();
      if (res) {
        setOrders(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleOrderDeleted = ({ id }: { id: number }) => {
      const found = orders.find((i) => i.id === id);
      toast.warning("Order deleted", {
        description: `Order #${found?.orderNumber} has been removed from the list.`,
      });
      setOrders((prev) => prev.filter((order) => order.id !== id));
    };

    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });
    socket.on("order-deleted", handleOrderDeleted);

    return () => {
      socket.off("order-deleted", handleOrderDeleted);
    };
  }, [orders]);

  useEffect(() => {
    onGetOrders();
    setOrderType("TOGO");
  }, []);

  return (
    <div className="flex flex-col gap-6">
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

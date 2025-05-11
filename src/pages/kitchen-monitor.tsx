import { useState, useEffect } from "react";
import { fetchOrders } from "../service/order-service";
import { socket } from "../socket";
import HeaderSection from "../components/ui-system/components/header-section";
import { ListOrders } from "../components/ui-system/components/list-orders";
import { toast } from "sonner";

interface Order {
  id: number;
  orderNumber: string;
  type: "TOGO" | "DINEIN";
  status: string;
  createdAt: string;
}
const notifySound = new Audio("/sound/ring.mp3"); // ✅ ชี้ไปที่ public/notify.mp3

function KitchenMonitor() {
  const [orders, setOrders] = useState<Order[]>([]);
  // ✅ ขอสิทธิ์แจ้งเตือนระบบ (browser notification)
  // useEffect(() => {
  //   if (Notification.permission !== "granted") {
  //     Notification.requestPermission();
  //   }
  // }, []);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });
    socket.on("order-deleted", ({ id }) => {
      const found = orders.find((i) => i.id == id);
      setOrders((prev) => prev.filter((order) => order.id !== id));
      toast.warning("Order deleted", {
        description: `Order #${found?.orderNumber} has been removed from the list.`,
      });
    });
    socket.on("new-order", (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      // 🔔 System Notification
      toast.info(`New orders ${order?.type} #${order?.orderNumber}`);
      // ✅ เล่นเสียง
      notifySound.currentTime = 0;
      notifySound.play().catch((err) => {
        console.warn("Unable to play sound:", err);
      });
    });

    socket.on("order-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    return () => {
      socket.off("new-order");
    };
  }, [orders]);

  // Removed duplicate state declaration
  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <div id="content-page" className="flex-1 flex flex-col gap-6">
      <HeaderSection title="Kitchen monitor" />
      <ListOrders orders={orders} />
    </div>
  );
}

export default KitchenMonitor;

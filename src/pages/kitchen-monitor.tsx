import { useState, useEffect } from "react";
import { fetchOrders } from "../service/order-service";
import { socket } from "../socket";
import HeaderSection from "../components/ui-system/components/header-section";
import { ListOrders } from "../components/ui-system/components/list-orders";
import { toast } from "sonner";
import { useLoading } from "../hooks/useLoading";

interface Order {
  id: number;
  orderNumber: string;
  type: "TOGO" | "DINEIN";
  status: string;
  createdAt: string;
}
const notifySound = new Audio("/sound/ring.mp3"); // ✅ ชี้ไปที่ public/notify.mp3

function KitchenMonitor() {
  const { startLoading, stopLoading } = useLoading(); // ✅ เรียก Hook มาใช้
  const [orders, setOrders] = useState<Order[]>([]);

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
      socket.off("order-deleted", handleOrderDeleted);
    };
  }, [orders]);

  useEffect(() => {
    const loadOrders = async () => {
      startLoading();
      try {
        const data = await fetchOrders();
        setOrders(data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        stopLoading();
      }
    };

    loadOrders();
  }, []);

  return (
    <div id="content-page" className="flex-1 flex flex-col gap-6">
      <HeaderSection title="Kitchen monitor" />
      <ListOrders orders={orders} />
    </div>
  );
}

export default KitchenMonitor;

import { useEffect, useState } from "react";
import RoleCard from "../components/ui-system/components/section-card";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { fetchOrders } from "../service/order-service";
import { LuMonitor, LuShoppingBag } from "react-icons/lu";
import { RiRestaurant2Fill } from "react-icons/ri";
import { toast } from "sonner";
import { useLoading } from "../hooks/useLoading";
import { useAppSelector } from "../hooks/hooks";
interface Order {
  id: number;
  orderNumber: string;
  type: "TOGO" | "DINEIN";
  status: string;
  createdAt: string;
}
const notifySound = new Audio("/sound/ring.mp3"); // ✅ ชี้ไปที่ public/notify.mp3

const Home = () => {
  const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);
  const { startLoading, stopLoading } = useLoading(); // ✅ เรียก Hook มาใช้
  const [orders, setOrders] = useState<Order[]>([]);

  const cardData = [
    {
      icon: <LuMonitor />,
      title: "Kitchen monitor",
      orderCount: orders?.length,
      colorClass: "text-blue-500 bg-black",
      onClick: () => changePage("/kitchen-monitor"),
    },
    {
      icon: <LuShoppingBag color="#FF6B6B" />,
      title: "Front-desk(To-Go)",
      orderCount: orders?.filter((i) => i.type == "TOGO").length,
      colorClass: "text-[#FF6B6B] bg-[#FF6B6B]",
      onClick: () => changePage("/front-desk"),
    },
    {
      icon: <RiRestaurant2Fill color="#34C759" />,
      title: "Server (Dine-in)",
      orderCount: orders?.filter((i) => i.type == "DINEIN").length,
      colorClass: "text-[#34C759] bg-[#34C759]",
      onClick: () => changePage("/server"),
    },
  ];

  const navigate = useNavigate();

  const changePage = (path: string) => {
    navigate(path);
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

    socket.on("new-order", (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      toast.info(`New orders ${order?.type} #${order?.orderNumber}`);
      if (isSoundOn) {
        notifySound.currentTime = 0;
        notifySound.play().catch((err) => {
          console.warn("Unable to play sound:", err);
        });
      }
    });

    socket.on("order-updated", (updatedOrder: Order) => {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        )
      );
    });

    socket.on("order-deleted", handleOrderDeleted);

    return () => {
      socket.off("new-order");
      socket.off("order-deleted", handleOrderDeleted);
    };
  }, [orders]);

  // Removed duplicate state declaration
  useEffect(() => {
    const loadOrders = async () => {
      try {
        startLoading();
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
    <div className="flex-1 flex flex-col justify-center items-center w-full gap-6 py-6">
      <h1 className="text-2xl">Select your role to continue</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {cardData.map((item, key) => (
          <div key={key} className="w-full flex justify-center">
            <RoleCard
              icon={item.icon}
              title={item.title}
              orderCount={item.orderCount}
              colorClass={item.colorClass}
              onClick={item.onClick}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

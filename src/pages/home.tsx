import { useEffect, useState } from "react";
import RoleCard from "../components/ui-system/components/section-card";
import { FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";
import { fetchOrders } from "../service/order-service";
interface Order {
  id: number;
  orderNumber: string;
  type: "TOGO" | "DINEIN";
  status: string;
  createdAt: string;
}
const notifySound = new Audio("/sound/ring.mp3"); // ✅ ชี้ไปที่ public/notify.mp3

const Home = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const cardData = [
    {
      icon: <FaBox />,
      title: "Front-desk(To-Go)",
      orderCount: orders?.length,
      colorClass: "text-orange-500 bg-orange-500",
      onClick: () => changePage("/"),
    },
    {
      icon: <FaBox />,
      title: "Server (Dine-in)",
      orderCount: orders?.length,
      colorClass: "text-red-500 bg-red-500",
      onClick: () => changePage("/"),
    },
    {
      icon: <FaBox />,
      title: "Kitchen monitor",
      orderCount: orders?.length,
      colorClass: "text-blue-500 bg-blue-500",
      onClick: () => changePage("/kitchen-monitor"),
    },
  ];

  const navigate = useNavigate();

  const changePage = (path: string) => {
    navigate(path);
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket");
    });
    socket.on("order-deleted", ({ id }) => {
      setOrders((prev) => prev.filter((order) => order.id !== id));
    });
    socket.on("new-order", (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      // 🔔 System Notification
      console.log("alert");
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
  }, []);

  // Removed duplicate state declaration
  useEffect(() => {
    fetchOrders().then(setOrders);
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-center items-center w-full gap-6">
      <h1 className="text-2xl text-gray-600">Select your role to continue</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
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

import { useEffect } from "react";
import RoleCard from "../components/ui-system/components/section-card";
import { FaBox } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { socket } from "../socket";

const Home = () => {
  const cardData = [
    {
      icon: <FaBox />,
      title: "Front-desk(To-Go)",
      orderCount: 0,
      colorClass: "text-orange-500 bg-orange-500",
      onClick: () => changePage("/"),
    },
    {
      icon: <FaBox />,
      title: "Server (Dine-in)",
      orderCount: 0,
      colorClass: "text-red-500 bg-red-500",
      onClick: () => changePage("/"),
    },
    {
      icon: <FaBox />,
      title: "Kitchen monitor",
      orderCount: 0,
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
  }, []);

  return (
    <div className="my-container">
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

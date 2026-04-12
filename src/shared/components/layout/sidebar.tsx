import { MdHomeFilled } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { LuMonitor, LuShoppingBag } from "react-icons/lu";
import { RiRestaurant2Fill } from "react-icons/ri";
import { IoIosSettings } from "react-icons/io";
const listMenu = [
  {
    name: "Home",
    path: "/",
    icon: <MdHomeFilled size={30} />,
  },
  {
    name: "Kitchen",
    path: "/kitchen-monitor",
    icon: <LuMonitor size={30} />,
  },
  {
    name: "Front",
    path: "/front-desk",
    icon: <LuShoppingBag size={30} />,
  },
  {
    name: "Server",
    path: "/server",
    icon: <RiRestaurant2Fill size={30} />,
  },
];
const Sidebar = () => {
  const location = useLocation();

  const itemClass =
    "p-3 flex flex-col justify-center items-center text-xs gap-1";
  const activeClass = "bg-gray-300 ";
  return (
    <div className="bg-[#EBEBEB] h-screen w-[60px] fixed border-r border-gray-200 pb-12">
      <div className="h-full flex justify-between flex-col">
        <div className="flex flex-col">
          {listMenu.map((i, key) => (
            <Link
              to={i.path}
              key={key}
              className={`${itemClass} ${
                location.pathname === i.path ? activeClass : ""
              }`}
            >
              <div>{i.icon}</div>
              <div>{i.name}</div>
            </Link>
          ))}
        </div>
        <Link
          to={"/setting"}
          className={`${itemClass} ${
            location.pathname === "/setting" ? activeClass : ""
          }`}
        >
          <IoIosSettings size={30} />
          <div>{"Setting"}</div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

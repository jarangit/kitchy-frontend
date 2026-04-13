import { Link, useLocation, useParams } from "react-router-dom";
import { LuLayoutDashboard, LuShoppingCart, LuHistory, LuSettings } from "react-icons/lu";

const Sidebar = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  const storeMenuList = id
    ? [
        {
          name: "Dashboard",
          path: `/store/${id}`,
          icon: <LuLayoutDashboard size={24} />,
        },
        {
          name: "POS",
          path: `/store/${id}/pos`,
          icon: <LuShoppingCart size={24} />,
        },
        {
          name: "History",
          path: `/store/${id}/transactions`,
          icon: <LuHistory size={24} />,
        },
      ]
    : [];

  const isActive = (path: string) => {
    if (path.endsWith("/pos")) {
      return location.pathname.startsWith(path);
    }
    return location.pathname === path;
  };

  const itemClass =
    "p-3 flex flex-col justify-center items-center text-xs gap-1 transition-colors";
  const activeClass = "bg-gray-300 text-black";
  const inactiveClass = "text-gray-600 hover:bg-gray-200";

  return (
    <div className="bg-[#EBEBEB] h-screen w-[60px] fixed border-r border-gray-200 pb-12 z-50">
      <div className="h-full flex justify-between flex-col">
        <div className="flex flex-col">
          {storeMenuList.map((item) => (
            <Link
              to={item.path}
              key={item.name}
              className={`${itemClass} ${
                isActive(item.path) ? activeClass : inactiveClass
              }`}
            >
              <div>{item.icon}</div>
              <div>{item.name}</div>
            </Link>
          ))}
        </div>
        {id && (
          <Link
            to={`/store/${id}/settings`}
            className={`${itemClass} ${
              location.pathname.startsWith(`/store/${id}/settings`)
                ? activeClass
                : inactiveClass
            }`}
          >
            <LuSettings size={24} />
            <div>Settings</div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Sidebar;

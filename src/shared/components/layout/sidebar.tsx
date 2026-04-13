import { Link, useLocation, useParams } from "react-router-dom";
import { LuLayoutDashboard, LuShoppingCart, LuHistory, LuSettings, LuChefHat } from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";

const Sidebar = () => {
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const currentStoreId = useAppSelector((state) => state.currentStore.storeId);

  const resolvedStoreId = id ?? (currentStoreId ? String(currentStoreId) : undefined);

  const storeMenuList = resolvedStoreId
    ? [
        {
          name: "Dashboard",
          path: `/store/${resolvedStoreId}`,
          icon: <LuLayoutDashboard size={24} />,
        },
        {
          name: "POS",
          path: `/store/${resolvedStoreId}/pos`,
          icon: <LuShoppingCart size={24} />,
        },
        {
          name: "History",
          path: `/store/${resolvedStoreId}/transactions`,
          icon: <LuHistory size={24} />,
        },
        {
          name: "KDS",
          path: `/store/${resolvedStoreId}/kds`,
          icon: <LuChefHat size={24} />,
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
  const activeClass = "bg-[var(--sidebar-active-bg)] text-[var(--color-text-primary)]";
  const inactiveClass = "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover-bg)]";

  return (
    <div className="bg-[var(--sidebar-bg)] h-screen w-[60px] fixed border-r border-[var(--color-border)] pb-12 z-50">
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
        {resolvedStoreId && (
          <Link
            to={`/store/${resolvedStoreId}/settings`}
            className={`${itemClass} ${
              location.pathname.startsWith(`/store/${resolvedStoreId}/settings`)
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

import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuShoppingCart,
  LuHistory,
  LuSettings,
  LuChefHat,
  LuChartBar,
} from "react-icons/lu";
import { useAppSelector } from "@/shared/hooks/hooks";
import { cn } from "@/shared/utils/cn";
import { usePendingOrdersCount } from "@/features/kds/hooks/use-pending-orders-count";
import { NavBadge } from "@/shared/components/ui/nav-badge";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";

type NavMatch = "exact" | "prefix";

interface NavItem {
  name: string;
  path: string;
  icon: ReactNode;
  match?: NavMatch;
  badgeCount?: number;
  badgeAriaLabel?: string;
}

const Sidebar = () => {
  const location = useLocation();
  const routeStoreId = useStoreRouteParam();
  const currentStoreId = useAppSelector((state) => state.currentStore.storeId);

  const resolvedStoreId = routeStoreId ?? (currentStoreId ? String(currentStoreId) : undefined);

  const { count: pendingOrdersCount } = usePendingOrdersCount();

  const storeMenuList: NavItem[] = resolvedStoreId
    ? [
        {
          name: "Dashboard",
          path: `/store/${resolvedStoreId}`,
          icon: <LuLayoutDashboard size={22} />,
          match: "exact",
        },
        {
          name: "POS",
          path: `/store/${resolvedStoreId}/pos`,
          icon: <LuShoppingCart size={22} />,
          match: "prefix",
        },
        {
          name: "History",
          path: `/store/${resolvedStoreId}/transactions`,
          icon: <LuHistory size={22} />,
          match: "prefix",
        },
        {
          name: "KDS",
          path: `/store/${resolvedStoreId}/kds`,
          icon: <LuChefHat size={22} />,
          match: "prefix",
          badgeCount: pendingOrdersCount,
          badgeAriaLabel:
            pendingOrdersCount > 0
              ? `${pendingOrdersCount} ออเดอร์ค้างในครัว`
              : undefined,
        },
        {
          name: "Report",
          path: `/store/${resolvedStoreId}/report`,
          icon: <LuChartBar size={22} />,
          match: "prefix",
        },
      ]
    : [];

  const isActive = (path: string, match: NavMatch = "exact") => {
    if (match === "prefix") {
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    }
    return location.pathname === path;
  };

  const itemClass =
    "group relative mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-transparent transition-all duration-[var(--motion-fast)]";
  const activeClass =
    "border-sidebar-border bg-sidebar-active-bg text-sidebar-active-text";
  const inactiveClass =
    "text-sidebar-text hover:bg-sidebar-hover-bg hover:text-text-primary";

  const renderNavItem = (item: NavItem) => {
    const active = isActive(item.path, item.match);
    const badgeCount = item.badgeCount ?? 0;
    const itemTitle =
      badgeCount > 0 ? `${item.name} (${badgeCount})` : item.name;

    return (
      <Link
        to={item.path}
        key={item.name}
        aria-label={itemTitle}
        title={itemTitle}
        className={cn(itemClass, active ? activeClass : inactiveClass)}
      >
        {active && (
          <span
            aria-hidden="true"
            className="absolute left-0 top-1/2 h-6 w-0.5 -translate-x-[calc(0.75rem+1px)] -translate-y-1/2 rounded-full bg-accent"
          />
        )}
        {item.icon}
        {badgeCount > 0 && (
          <NavBadge count={badgeCount} aria-label={item.badgeAriaLabel} />
        )}
        <span className="pointer-events-none absolute left-full top-1/2 z-20 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-surface px-3 py-2 text-caption font-[var(--weight-medium)] text-text-secondary opacity-0 transition-opacity duration-[var(--motion-fast)] group-hover:opacity-100 group-focus-visible:opacity-100">
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-sidebar-width border-r border-sidebar-border bg-sidebar-bg/95 backdrop-blur-xl">
      <div className="flex h-full flex-col justify-between py-6">
        <nav className="flex flex-col gap-3 px-3">{storeMenuList.map(renderNavItem)}</nav>
        {resolvedStoreId && (
          <div className="px-3">
            {renderNavItem({
              name: "Settings",
              path: `/store/${resolvedStoreId}/settings`,
              icon: <LuSettings size={22} />,
              match: "prefix",
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;

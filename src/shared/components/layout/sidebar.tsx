import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuShoppingCart,
  LuHistory,
  LuSettings,
  LuChefHat,
  LuChartBar,
  LuChevronDown,
  LuChevronUp,
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
  const [isDockOpen, setIsDockOpen] = useState(true);
  const [playDockIntro, setPlayDockIntro] = useState(false);
  const location = useLocation();
  const routeStoreId = useStoreRouteParam();
  const currentStoreId = useAppSelector((state) => state.currentStore.storeId);

  const resolvedStoreId =
    routeStoreId ?? (currentStoreId ? String(currentStoreId) : undefined);

  const { count: pendingOrdersCount } = usePendingOrdersCount();

  useEffect(() => {
    if (!isDockOpen) {
      setPlayDockIntro(false);
      return;
    }

    setPlayDockIntro(false);

    const rafId = requestAnimationFrame(() => {
      setPlayDockIntro(true);
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isDockOpen]);

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
      return (
        location.pathname === path || location.pathname.startsWith(`${path}/`)
      );
    }
    return location.pathname === path;
  };

  const itemClass =
    "group relative flex h-10 w-10 shrink-0 origin-bottom items-center justify-center rounded-glass-item text-glass-icon-sm transition-all duration-200 ease-out hover:-translate-y-2.5 hover:scale-115 focus-visible:-translate-y-2.5 focus-visible:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-glass-ring-offset sm:h-14 sm:w-14 sm:rounded-glass-item-lg sm:text-glass-icon";
  const activeClass =
    "border border-accent/25 bg-accent/10 text-accent-text shadow-glass-item-active backdrop-blur-glass-item";
  const inactiveClass =
    "text-text-secondary/75 hover:bg-glass-item-hover-bg hover:text-text-primary hover:shadow-glass-item-hover dark:hover:bg-glass-item-hover-bg";

  const renderNavItem = (item: NavItem, index: number) => {
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
        className={cn(
          itemClass,
          active ? activeClass : inactiveClass,
          "transition-[opacity,transform] duration-500 ease-out",
          playDockIntro
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-2 scale-90 opacity-0",
        )}
        style={
          playDockIntro
            ? ({ transitionDelay: `${80 + index * 42}ms` } as CSSProperties)
            : undefined
        }
      >
        <span className="relative z-10 transition-transform duration-200 ease-out group-hover:scale-110 group-focus-visible:scale-110">
          {item.icon}
        </span>
        {badgeCount > 0 && (
          <NavBadge
            count={badgeCount}
            aria-label={item.badgeAriaLabel}
            className="ring-sidebar-bg"
          />
        )}
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-4 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full border border-glass-tooltip-border bg-surface/95 px-3 py-1.5 text-caption font-medium text-text-primary opacity-0 shadow-glass-tooltip backdrop-blur-glass-tooltip transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          {item.name}
        </span>
      </Link>
    );
  };

  return (
    <aside className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 sm:bottom-5">
      {isDockOpen ? (
        <div
          className={cn(
            "pointer-events-auto relative isolate flex max-w-[calc(100vw-2rem)] items-end gap-1 overflow-visible rounded-glass-dock border border-glass-surface-border bg-glass-surface-bg px-2 pb-2.5 pt-2 shadow-glass-dock backdrop-blur-glass-strong backdrop-saturate-glass transition-[opacity,transform,filter] duration-500 ease-out dark:border-glass-surface-border dark:bg-glass-surface-bg sm:gap-2 sm:rounded-glass-dock-lg sm:px-2.5 sm:pb-3 sm:pt-2",
            playDockIntro
              ? "translate-y-0 scale-100 opacity-100 blur-0"
              : "translate-y-4 scale-95 opacity-0 blur-glass-intro",
          )}
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-5 top-2 h-10 rounded-full bg-glass-surface-border blur-glass-highlight dark:bg-glass-surface-border"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] bg-linear-to-b from-glass-gradient-from via-glass-gradient-via to-glass-gradient-to dark:from-glass-gradient-from dark:via-glass-gradient-via dark:to-glass-gradient-to"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-glass-inner-ring dark:ring-glass-inner-ring"
          />
          <nav
            aria-label="Store navigation"
            className="relative z-10 flex min-w-0 items-end gap-1 px-0.5 pb-0.5 sm:gap-2"
          >
            {storeMenuList.map((item, index) => renderNavItem(item, index))}
            {resolvedStoreId &&
              renderNavItem(
                {
                  name: "Settings",
                  path: `/store/${resolvedStoreId}/settings`,
                  icon: <LuSettings size={22} />,
                  match: "prefix",
                },
                storeMenuList.length,
              )}
          </nav>
          <div
            className="relative z-10 mb-2 hidden h-9 w-px shrink-0 bg-glass-divider dark:bg-glass-divider sm:block"
            aria-hidden="true"
          />
          <button
            type="button"
            aria-label="Hide navigation dock"
            title="Hide navigation dock"
            onClick={() => setIsDockOpen(false)}
            className={cn(
              "relative z-10 mb-1 flex h-10 w-10 shrink-0 origin-bottom items-center justify-center rounded-glass-item bg-glass-button-bg text-text-secondary shadow-glass-button backdrop-blur-glass-item transition-all duration-200 ease-out hover:-translate-y-2 hover:scale-110 hover:bg-glass-button-bg-hover hover:text-text-primary focus-visible:-translate-y-2 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-glass-ring-offset dark:bg-glass-button-bg dark:hover:bg-glass-button-bg-hover sm:h-12 sm:w-12 sm:rounded-glass-item-lg",
              "transition-[opacity,transform] duration-500 ease-out",
              playDockIntro
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-2 scale-90 opacity-0",
            )}
            style={
              playDockIntro
                ? ({
                    transitionDelay: `${80 + (storeMenuList.length + 1) * 42}ms`,
                  } as CSSProperties)
                : undefined
            }
          >
            <LuChevronDown size={22} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          aria-label="Show navigation dock"
          title="Show navigation dock"
          onClick={() => setIsDockOpen(true)}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-glass-fab border border-glass-fab-border bg-glass-fab-bg text-text-secondary shadow-glass-fab backdrop-blur-glass-strong backdrop-saturate-glass transition-all duration-200 ease-out hover:-translate-y-2 hover:scale-110 hover:bg-glass-fab-bg-hover hover:text-text-primary focus-visible:-translate-y-2 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg dark:border-glass-fab-border dark:bg-glass-fab-bg dark:hover:bg-glass-fab-bg-hover"
        >
          <LuChevronUp size={24} />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;

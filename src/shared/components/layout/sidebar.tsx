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

  const resolvedStoreId = routeStoreId ?? (currentStoreId ? String(currentStoreId) : undefined);

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
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    }
    return location.pathname === path;
  };

  const itemClass =
    "group relative flex h-10 w-10 shrink-0 origin-bottom items-center justify-center rounded-[1rem] text-[18px] transition-all duration-200 ease-out hover:-translate-y-2.5 hover:scale-115 focus-visible:-translate-y-2.5 focus-visible:scale-115 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white/30 sm:h-14 sm:w-14 sm:rounded-[1.35rem] sm:text-[22px]";
  const activeClass =
    "border border-accent/25 bg-accent/10 text-accent shadow-[0_16px_36px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.75)] backdrop-blur-2xl";
  const inactiveClass =
    "text-text-secondary/75 hover:bg-white/45 hover:text-text-primary hover:shadow-[0_12px_28px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.55)] dark:hover:bg-white/10";

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
            : "translate-y-2 scale-90 opacity-0"
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
        <span className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-4 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full border border-white/40 bg-surface/95 px-3 py-1.5 text-caption font-medium text-text-primary opacity-0 shadow-[0_10px_28px_rgba(15,23,42,0.18)] backdrop-blur-xl transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
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
            "pointer-events-auto relative isolate flex max-w-[calc(100vw-2rem)] items-end gap-1 overflow-visible rounded-[2.15rem] border border-white/45 bg-white/24 px-2 pb-2.5 pt-2 shadow-[0_28px_90px_rgba(15,23,42,0.26),0_8px_22px_rgba(255,255,255,0.24)_inset,0_-12px_34px_rgba(15,23,42,0.08)_inset] backdrop-blur-[34px] backdrop-saturate-200 transition-[opacity,transform,filter] duration-500 ease-out dark:border-white/12 dark:bg-white/8 sm:gap-2 sm:rounded-[2.5rem] sm:px-2.5 sm:pb-3 sm:pt-2",
            playDockIntro
              ? "translate-y-0 scale-100 opacity-100 blur-0"
              : "translate-y-4 scale-95 opacity-0 blur-[6px]"
          )}
        >
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-5 top-2 h-10 rounded-full bg-white/45 blur-2xl dark:bg-white/12" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] bg-linear-to-b from-white/42 via-white/12 to-white/4 dark:from-white/14 dark:via-white/6 dark:to-transparent" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/55 dark:ring-white/10" />
          <nav aria-label="Store navigation" className="relative z-10 flex min-w-0 items-end gap-1 px-0.5 pb-0.5 sm:gap-2">
            {storeMenuList.map((item, index) => renderNavItem(item, index))}
            {resolvedStoreId &&
              renderNavItem({
                name: "Settings",
                path: `/store/${resolvedStoreId}/settings`,
                icon: <LuSettings size={22} />,
                match: "prefix",
              }, storeMenuList.length)}
          </nav>
          <div className="relative z-10 mb-2 hidden h-9 w-px shrink-0 bg-white/55 dark:bg-white/15 sm:block" aria-hidden="true" />
          <button
            type="button"
            aria-label="Hide navigation dock"
            title="Hide navigation dock"
            onClick={() => setIsDockOpen(false)}
            className={cn(
              "relative z-10 mb-1 flex h-10 w-10 shrink-0 origin-bottom items-center justify-center rounded-[1rem] bg-white/58 text-text-secondary shadow-[0_12px_28px_rgba(15,23,42,0.14),inset_0_1px_0_rgba(255,255,255,0.78)] backdrop-blur-2xl transition-all duration-200 ease-out hover:-translate-y-2 hover:scale-110 hover:bg-white/78 hover:text-text-primary focus-visible:-translate-y-2 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-white/30 dark:bg-white/10 dark:hover:bg-white/15 sm:h-12 sm:w-12 sm:rounded-[1.35rem]",
              "transition-[opacity,transform] duration-500 ease-out",
              playDockIntro
                ? "translate-y-0 scale-100 opacity-100"
                : "translate-y-2 scale-90 opacity-0"
            )}
            style={
              playDockIntro
                ? ({ transitionDelay: `${80 + (storeMenuList.length + 1) * 42}ms` } as CSSProperties)
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
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-[1.45rem] border border-white/45 bg-white/28 text-text-secondary shadow-[0_20px_60px_rgba(15,23,42,0.2),0_8px_22px_rgba(255,255,255,0.24)_inset] backdrop-blur-[34px] backdrop-saturate-200 transition-all duration-200 ease-out hover:-translate-y-2 hover:scale-110 hover:bg-white/58 hover:text-text-primary focus-visible:-translate-y-2 focus-visible:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg dark:border-white/10 dark:bg-white/8 dark:hover:bg-white/14"
        >
          <LuChevronUp size={24} />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;

import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  LuChefHat,
  LuConciergeBell,
  LuHistory,
  LuLayoutGrid,
  LuSettings,
  LuShoppingCart,
  LuX,
} from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { NavBadge } from "@/shared/components/ui/nav-badge";
import { useStoreOverviewCounts } from "@/shared/hooks/use-store-overview-counts";

const NAV_ITEMS = [
  { id: "home", subpath: "", end: true, icon: LuLayoutGrid, label: "nav.home" },
  {
    id: "pos",
    subpath: "/pos",
    end: false,
    icon: LuShoppingCart,
    label: "nav.pos",
  },
  {
    id: "transactions",
    subpath: "/transactions",
    end: false,
    icon: LuHistory,
    label: "nav.transactions",
  },
  { id: "kds", subpath: "/kds", end: false, icon: LuChefHat, label: "nav.kds" },
] as const;

const READY_TO_SERVE_ITEM = {
  id: "readyToServe",
  subpath: "/ready-to-serve",
  end: false,
  icon: LuConciergeBell,
  label: "nav.readyToServe",
} as const;

const SETTINGS_ITEM = {
  id: "settings",
  subpath: "/settings",
  end: false,
  icon: LuSettings,
  label: "nav.settings",
} as const;

type NavItemId =
  | (typeof NAV_ITEMS)[number]["id"]
  | typeof SETTINGS_ITEM.id
  | typeof READY_TO_SERVE_ITEM.id;

type NavItem = {
  id: NavItemId;
  subpath: string;
  end: boolean;
  icon: typeof LuLayoutGrid;
  label: MessageKey;
};

type StoreSideNavProps = {
  /** Desktop icon rail (default) or full-screen mobile drawer. */
  variant?: "desktop" | "mobile";
  /** Mobile drawer visibility. Only used when variant is "mobile". */
  open?: boolean;
  /** Called when the mobile drawer should close. */
  onClose?: () => void;
};

/**
 * Slim icon rail that anchors the store app shell.
 *
 * Shown on every global `Layout` page (dashboard, transactions, station).
 * POS / KDS / Settings stay full-screen modes but are reachable from here.
 *
 * On mobile the rail is hidden and replaced by a full-screen drawer
 * (`variant="mobile"`) with icon + text labels for easy touch use.
 *
 * Uses design tokens only:
 *   - rail:   bg-sidebar-bg  /  w-sidebar-width
 *   - active: accent treatment (bg-accent-bg), matching the theme's
 *             "accent = selections" rule (same as the original nav dock)
 */
export function StoreSideNav({
  variant = "desktop",
  open = false,
  onClose,
}: StoreSideNavProps) {
  const { t } = useTranslation();
  const routeStoreId = useStoreRouteParam();
  const reduxStoreId = useAppSelector((state) => state.currentStore.storeId);
  const storeId =
    routeStoreId ?? (reduxStoreId != null ? String(reduxStoreId) : undefined);
  const { openOrdersCount, kitchenPendingCount, readyToServeCount } =
    useStoreOverviewCounts();

  const isMobile = variant === "mobile";

  useEffect(() => {
    if (!isMobile || !open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobile, open, onClose]);

  if (!storeId) return null;
  if (isMobile && !open) return null;

  const badgeCounts: Partial<Record<NavItemId, number>> = {
    kds: kitchenPendingCount,
    transactions: openOrdersCount,
    readyToServe: readyToServeCount,
  };

  const renderRailItem = ({ id, subpath, end, icon: Icon, label }: NavItem) => (
    <NavLink
      key={id}
      to={`/store/${storeId}${subpath}`}
      end={end}
      title={t(label)}
      aria-label={t(label)}
      className={({ isActive }) =>
        cn(
          "relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar-bg",
          isActive
            ? "border-transparent bg-accent text-on-accent"
            : "border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary",
        )
      }
    >
      <Icon size={18} aria-hidden="true" />
      {badgeCounts[id] != null && badgeCounts[id] > 0 && (
        <NavBadge
          count={badgeCounts[id]}
          aria-label={t("nav.badge") + ` ${badgeCounts[id]}`}
        />
      )}
    </NavLink>
  );

  const renderDrawerItem = ({
    id,
    subpath,
    end,
    icon: Icon,
    label,
  }: NavItem) => (
    <NavLink
      key={id}
      to={`/store/${storeId}${subpath}`}
      end={end}
      aria-label={t(label)}
      onClick={onClose}
      className={({ isActive }) =>
        cn(
          "flex min-h-14 w-full items-center gap-4 rounded-card border px-4 py-3 text-body transition-colors duration-fast focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
          isActive
            ? "border-transparent bg-accent text-on-accent"
            : "border-transparent text-text-primary hover:bg-surface-hover",
        )
      }
    >
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
        <Icon size={20} aria-hidden="true" />
        {badgeCounts[id] != null && badgeCounts[id] > 0 && (
          <NavBadge
            count={badgeCounts[id]}
            aria-label={t("nav.badge") + ` ${badgeCounts[id]}`}
          />
        )}
      </span>
      <span className="min-w-0 flex-1 truncate">{t(label)}</span>
    </NavLink>
  );

  if (isMobile) {
    return (
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.openMenu")}
        className="fixed inset-0 z-50 flex flex-col bg-sidebar-bg text-text-primary md:hidden"
      >
        <div className="flex min-h-14 items-center justify-end border-b border-border px-4">
          <button
            type="button"
            onClick={onClose}
            aria-label={t("nav.closeMenu")}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-primary transition-colors duration-fast hover:bg-surface-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
          >
            <LuX size={20} aria-hidden="true" />
          </button>
        </div>
        <nav
          aria-label="Store navigation"
          className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto px-4 py-4"
        >
          {NAV_ITEMS.map(renderDrawerItem)}
          {renderDrawerItem(READY_TO_SERVE_ITEM)}
          <div className="mt-auto border-t border-border pt-4">
            {renderDrawerItem(SETTINGS_ITEM)}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <aside className="sticky top-0 z-30 hidden h-dvh w-sidebar-width shrink-0 border-r border-border bg-sidebar-bg md:block">
      <nav
        className="flex h-full flex-col items-center gap-3 py-4"
        aria-label="Store navigation"
      >
        {NAV_ITEMS.map(renderRailItem)}
        {renderRailItem(READY_TO_SERVE_ITEM)}
        <div className="mt-auto">{renderRailItem(SETTINGS_ITEM)}</div>
      </nav>
    </aside>
  );
}

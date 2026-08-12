import { NavLink } from "react-router-dom";
import {
  LuChefHat,
  LuHistory,
  LuLayoutGrid,
  LuSettings,
  LuShoppingCart,
} from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { useAppSelector } from "@/shared/hooks/hooks";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { NavBadge } from "@/shared/components/ui/nav-badge";
import { usePendingOrdersCount } from "@/features/kds/hooks/use-pending-orders-count";
import { useInProgressTransactionsCount } from "@/features/transaction/hooks/use-in-progress-transactions-count";

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

const SETTINGS_ITEM = {
  id: "settings",
  subpath: "/settings",
  end: false,
  icon: LuSettings,
  label: "nav.settings",
} as const;

/**
 * Slim icon rail that anchors the store app shell.
 *
 * Shown on every global `Layout` page (dashboard, transactions, station).
 * POS / KDS / Settings stay full-screen modes but are reachable from here.
 *
 * Uses design tokens only:
 *   - rail:   bg-sidebar-bg  /  w-sidebar-width
 *   - active: accent treatment (bg-accent-bg), matching the theme's
 *             "accent = selections" rule (same as the original nav dock)
 */
export function StoreSideNav() {
  const { t } = useTranslation();
  const routeStoreId = useStoreRouteParam();
  const reduxStoreId = useAppSelector((state) => state.currentStore.storeId);
  const storeId =
    routeStoreId ?? (reduxStoreId != null ? String(reduxStoreId) : undefined);
  const { count: pendingOrdersCount } = usePendingOrdersCount();
  const { count: inProgressTransactionsCount } =
    useInProgressTransactionsCount();

  const badgeCounts: Partial<
    Record<(typeof NAV_ITEMS)[number]["id"] | typeof SETTINGS_ITEM.id, number>
  > = {
    kds: pendingOrdersCount,
    transactions: inProgressTransactionsCount,
  };

  if (!storeId) return null;

  const renderItem = ({
    id,
    subpath,
    end,
    icon: Icon,
    label,
  }: {
    id: (typeof NAV_ITEMS)[number]["id"] | "settings";
    subpath: string;
    end: boolean;
    icon: typeof LuLayoutGrid;
    label: MessageKey;
  }) => (
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

  return (
    <aside className="sticky top-0 z-30 h-dvh w-sidebar-width shrink-0 border-r border-border bg-sidebar-bg">
      <nav
        className="flex h-full flex-col items-center gap-3 py-4"
        aria-label="Store navigation"
      >
        {NAV_ITEMS.map(renderItem)}
        <div className="mt-auto">{renderItem(SETTINGS_ITEM)}</div>
      </nav>
    </aside>
  );
}

import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { usePendingOrdersCount } from "@/features/kds/hooks/use-pending-orders-count";
import { useTranslation } from "@/shared/i18n/use-translation";
import { type ReactNode, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LuArrowRight,
  LuChefHat,
  LuHistory,
  LuShoppingCart,
} from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import { Button } from "@/shared/components/ui/button";

/* ── Types ─────────────────────────────────────────────── */

interface DashboardOrder {
  createdAt?: string;
  totalAmount?: number;
}

/* ── Helpers ───────────────────────────────────────────── */

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const isSameCalendarDay = (
  dateValue: string | undefined,
  targetDate: Date,
): boolean => {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  return (
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getDate() === targetDate.getDate()
  );
};

/* ── Sub-components ────────────────────────────────────── */

const MetricLine = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="rounded-card bg-surface-muted px-4 py-3">
    <p className="text-label text-text-tertiary">{label}</p>
    <p
      className={cn(
        "mt-1 text-title font-semibold tabular-nums text-text-primary",
        highlight && "text-accent-text",
      )}
    >
      {value}
    </p>
  </div>
);

const DashboardCard = ({
  icon,
  title,
  to,
  footerLabel,
  children,
}: {
  icon: ReactNode;
  title: string;
  to: string;
  footerLabel: string;
  children?: ReactNode;
}) => (
  <Link
    to={to}
    className="group flex h-full flex-col rounded-card border border-card-border bg-surface px-4 py-4 shadow-xs transition-all duration-[var(--motion-fast)] hover:border-border-hover hover:bg-card-bg-hover hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:px-5 sm:py-5"
  >
    <div className="flex items-start justify-between gap-4">
      <span className="rounded-full bg-surface-muted p-2 text-text-secondary transition-colors duration-[var(--motion-fast)] group-hover:text-text-primary">
        {icon}
      </span>
      <LuArrowRight
        className="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-text-secondary"
        aria-hidden="true"
      />
    </div>
    <h2 className="mt-3 text-body font-medium text-text-primary sm:text-subtitle">
      {title}
    </h2>
    <div className="mt-3 flex-1">{children}</div>
    <p className="mt-4 text-label text-text-secondary">{footerLabel}</p>
  </Link>
);

/* ── Page ──────────────────────────────────────────────── */

const StoreDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { storeFinOneQuery, storeFinOneLoading, storeFinOneQueryError } =
    useStoreService({});
  const { ordersQuery } = useOrderService({});
  const { count: pendingOrdersCount } = usePendingOrdersCount();

  const todayOrders = useMemo(() => {
    const today = new Date();
    return (ordersQuery as DashboardOrder[]).filter((order) =>
      isSameCalendarDay(order.createdAt, today),
    );
  }, [ordersQuery]);

  const todayOrderCount = todayOrders.length;
  const todayRevenue = todayOrders.reduce(
    (sum, order) =>
      sum + (typeof order.totalAmount === "number" ? order.totalAmount : 0),
    0,
  );

  /* Loading state */
  if (storeFinOneLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 py-6">
        <SkeletonCard className="h-16 w-full max-w-sm" />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <SkeletonCard className="h-56" />
          <SkeletonCard className="h-56" />
          <SkeletonCard className="h-56" />
        </div>
      </div>
    );
  }

  /* Error state */
  if (storeFinOneQueryError) {
    return (
      <ErrorState
        title={t("common.error.title")}
        description={t("common.error.description")}
        className="min-h-[60vh]"
      />
    );
  }

  const storeName = storeFinOneQuery?.name ?? "";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:gap-6">
      <header className="flex w-full items-start justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="text-label uppercase tracking-[0.08em] text-text-tertiary">
            {t("dashboard.storeOverview")}
          </p>
          <h1 className="truncate text-heading font-semibold tracking-tight text-text-primary">
            {storeName}
          </h1>
          <p className="text-body-sm text-text-secondary">
            {t("dashboard.todayOrders")} · {t("dashboard.pendingInKitchen")} ·{" "}
            {t("dashboard.summaryHistory")}
          </p>
        </div>

        <Button
          size="lg"
          onClick={() => navigate(`/store/${id}/pos`)}
          className="shrink-0"
        >
          <LuShoppingCart size={20} aria-hidden="true" />
          {t("dashboard.openPos")}
        </Button>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          icon={<LuShoppingCart size={22} />}
          title={t("dashboard.orders")}
          to={`/store/${id}/pos`}
          footerLabel={t("dashboard.openPos")}
        >
          <MetricLine
            label={t("dashboard.todayOrders")}
            value={String(todayOrderCount)}
          />
        </DashboardCard>

        <DashboardCard
          icon={<LuChefHat size={22} />}
          title={t("dashboard.kitchen")}
          to={`/store/${id}/kds`}
          footerLabel={t("dashboard.openKds")}
        >
          <MetricLine
            label={t("dashboard.pendingInKitchen")}
            value={String(pendingOrdersCount)}
            highlight={pendingOrdersCount > 0}
          />
        </DashboardCard>

        <DashboardCard
          icon={<LuHistory size={22} />}
          title={t("dashboard.summaryHistory")}
          to={`/store/${id}/transactions`}
          footerLabel={t("dashboard.viewHistory")}
        >
          <div className="flex flex-col gap-3">
            <MetricLine
              label={t("dashboard.todayRevenue")}
              value={`฿ ${formatCurrency(todayRevenue)}`}
            />
            <MetricLine
              label={t("dashboard.todayOrders")}
              value={String(todayOrderCount)}
            />
          </div>
        </DashboardCard>
      </div>
    </div>
  );
};

export default StoreDashboardPage;

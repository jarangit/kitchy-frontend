import { Card, CardContent } from "@/shared/components/ui/card";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { StatCard } from "@/shared/components/ui/stat-card";
import { IconTile } from "@/shared/components/ui/icon-tile";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useTranslation } from "@/shared/i18n/use-translation";
import { type ReactNode, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuArrowRight,
  LuChefHat,
  LuClipboardCheck,
  LuShoppingCart,
  LuSettings,
} from "react-icons/lu";

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

const isSameCalendarDay = (dateValue: string | undefined, targetDate: Date): boolean => {
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

const DashboardHeader = ({
  overviewLabel,
  storeName,
}: {
  overviewLabel: string;
  storeName: string;
}) => (
  <header className="flex w-full flex-col gap-1 py-2">
    <p className="text-label uppercase tracking-[0.08em] text-text-tertiary">{overviewLabel}</p>
    <h1 className="text-title font-semibold tracking-tight text-text-primary sm:text-heading">
      {storeName}
    </h1>
  </header>
);

const TodayActionCard = ({
  storeId,
  todayLabel,
  posLabel,
  posSubtitle,
}: {
  storeId: string;
  todayLabel: string;
  posLabel: string;
  posSubtitle: string;
}) => (
  <Card>
    <CardContent className="flex flex-col gap-5 p-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-4">
        <IconTile size="lg" tone="primary" shape="square">
          <LuShoppingCart size={28} />
        </IconTile>
        <div className="min-w-0">
          <p className="text-label uppercase tracking-[0.08em] text-text-tertiary">{todayLabel}</p>
          <h2 className="mt-1 text-heading font-semibold tracking-tight text-text-primary">
            {posLabel}
          </h2>
          <p className="mt-2 max-w-xl text-body leading-6 text-text-secondary">
            {posSubtitle}
          </p>
        </div>
      </div>
      <Link
        to={`/store/${storeId}/pos`}
        className="inline-flex h-button-height-lg shrink-0 items-center justify-center gap-2 rounded-button bg-button-primary-bg px-8 text-button-lg font-button text-button-primary-text transition-colors duration-[var(--motion-fast)] hover:bg-button-primary-bg-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      >
        {posLabel}
        <LuArrowRight size={18} aria-hidden="true" />
      </Link>
    </CardContent>
  </Card>
);

const ShortcutCard = ({
  icon,
  label,
  to,
}: {
  icon: ReactNode;
  label: string;
  to: string;
}) => (
  <Link
    to={to}
    className="group block rounded-card focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
  >
    <Card className="transition-colors duration-[var(--motion-fast)] group-hover:bg-card-bg-hover">
      <CardContent className="flex items-center justify-between gap-4 py-5">
        <div className="flex min-w-0 items-center gap-3">
          <IconTile size="lg" tone="neutral" shape="square">
            {icon}
          </IconTile>
          <span className="truncate text-body font-semibold text-text-primary">
            {label}
          </span>
        </div>
        <LuArrowRight
          className="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-text-secondary"
          aria-hidden="true"
        />
      </CardContent>
    </Card>
  </Link>
);

/* ── Page ──────────────────────────────────────────────── */

const StoreDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { storeFinOneQuery, storeFinOneLoading, storeFinOneQueryError } =
    useStoreService({});
  const { ordersQuery } = useOrderService({});

  const todayOrders = useMemo(
    () => {
      const today = new Date();
      return (ordersQuery as DashboardOrder[]).filter((order) =>
        isSameCalendarDay(order.createdAt, today),
      );
    },
    [ordersQuery],
  );

  const todayOrderCount = todayOrders.length;
  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + (typeof order.totalAmount === "number" ? order.totalAmount : 0),
    0,
  );

  /* Loading state */
  if (storeFinOneLoading) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 py-6">
        <SkeletonCard className="h-16 w-full max-w-sm" />
        <SkeletonCard className="h-40 w-full" />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
        </div>
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 py-6 sm:gap-6 sm:py-8">
      <DashboardHeader
        overviewLabel={t("dashboard.storeOverview")}
        storeName={storeName}
      />

      <TodayActionCard
        storeId={id ?? ""}
        todayLabel={t("dashboard.today")}
        posLabel={t("dashboard.openPos")}
        posSubtitle={t("dashboard.startReceivingOrders")}
      />

      <section className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          label={t("dashboard.todayRevenue")}
          value={`฿ ${formatCurrency(todayRevenue)}`}
        />
        <StatCard
          label={t("dashboard.todayOrders")}
          value={todayOrderCount}
          hint={t("dashboard.orders")}
        />
      </section>

      <section className="w-full space-y-3">
        <h2 className="text-subtitle font-semibold text-text-primary">
          {t("dashboard.shortcuts")}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ShortcutCard
            icon={<LuClipboardCheck size={28} />}
            label={t("dashboard.orders")}
            to={`/store/${id}/transactions`}
          />
          <ShortcutCard
            icon={<LuChefHat size={28} />}
            label={t("dashboard.kds")}
            to={`/store/${id}/kds`}
          />
          <ShortcutCard
            icon={<LuSettings size={28} />}
            label={t("dashboard.settings")}
            to={`/store/${id}/settings`}
          />
        </div>
      </section>
    </div>
  );
};

export default StoreDashboardPage;

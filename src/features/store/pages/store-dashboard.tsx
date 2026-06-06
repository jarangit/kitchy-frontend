import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
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
  <header className="flex w-full flex-col gap-1">
    <p className="text-label uppercase tracking-[0.08em] text-text-tertiary">{overviewLabel}</p>
    <h1 className="truncate text-heading font-semibold tracking-tight text-text-primary">
      {storeName}
    </h1>
  </header>
);

const DailySummaryCard = ({
  storeId,
  todayLabel,
  posLabel,
  readyLabel,
  revenueLabel,
  revenueValue,
  ordersLabel,
  ordersValue,
}: {
  storeId: string;
  todayLabel: string;
  posLabel: string;
  readyLabel: string;
  revenueLabel: string;
  revenueValue: string;
  ordersLabel: string;
  ordersValue: number;
}) => (
  <Card>
    <CardContent className="flex flex-col gap-6 p-0">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-label uppercase tracking-[0.08em] text-text-tertiary">{todayLabel}</p>
          <h2 className="mt-2 max-w-2xl text-title font-semibold leading-tight tracking-tight text-text-primary sm:text-heading">
            {readyLabel}
          </h2>
        </div>
        <Link to={`/store/${storeId}/pos`} className="inline-flex">
          <Button variant="primary" size="lg" className="shrink-0">
            {posLabel}
            <LuArrowRight size={18} aria-hidden="true" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MetricLine label={revenueLabel} value={revenueValue} />
        <MetricLine label={ordersLabel} value={String(ordersValue)} />
      </div>
    </CardContent>
  </Card>
);

const MetricLine = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-card border border-border bg-surface px-4 py-3">
    <p className="text-label text-text-tertiary">{label}</p>
    <p className="mt-1 text-title font-semibold tabular-nums text-text-primary">{value}</p>
  </div>
);

const WorkflowLink = ({
  icon,
  label,
  hint,
  to,
}: {
  icon: ReactNode;
  label: string;
  hint: string;
  to: string;
}) => (
  <Link
    to={to}
    className="group block rounded-card border border-card-border bg-card-bg p-4 transition-colors duration-[var(--motion-fast)] hover:border-border-hover hover:bg-card-bg-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
  >
    <div className="flex items-start justify-between gap-4">
      <IconTile size="md" tone="neutral" shape="square">
        {icon}
      </IconTile>
      <LuArrowRight
        className="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-[var(--motion-fast)] group-hover:translate-x-0.5 group-hover:text-text-secondary"
        aria-hidden="true"
      />
    </div>
    <div className="mt-4">
      <p className="text-body font-semibold text-text-primary">{label}</p>
      <p className="mt-1 text-body-sm leading-6 text-text-secondary">{hint}</p>
    </div>
  </Link>
);

const ShortcutPanel = ({
  title,
  storeId,
  ordersLabel,
  ordersHint,
  kdsLabel,
  kdsHint,
  settingsLabel,
  settingsHint,
}: {
  title: string;
  storeId: string;
  ordersLabel: string;
  ordersHint: string;
  kdsLabel: string;
  kdsHint: string;
  settingsLabel: string;
  settingsHint: string;
}) => (
  <section className="space-y-3">
    <h2 className="text-subtitle font-semibold text-text-primary">{title}</h2>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <WorkflowLink
        icon={<LuClipboardCheck size={22} />}
        label={ordersLabel}
        hint={ordersHint}
        to={`/store/${storeId}/transactions`}
      />
      <WorkflowLink
        icon={<LuChefHat size={22} />}
        label={kdsLabel}
        hint={kdsHint}
        to={`/store/${storeId}/kds`}
      />
      <WorkflowLink
        icon={<LuSettings size={22} />}
        label={settingsLabel}
        hint={settingsHint}
        to={`/store/${storeId}/settings`}
      />
    </div>
  </section>
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
        <div className="flex items-end justify-between gap-4">
          <SkeletonCard className="h-16 w-full max-w-sm" />
          <SkeletonCard className="hidden h-12 w-32 sm:block" />
        </div>
        <SkeletonCard className="h-64 w-full" />
        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <SkeletonCard className="h-36" />
          <SkeletonCard className="h-36" />
          <SkeletonCard className="h-36" />
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

      <DailySummaryCard
        storeId={id ?? ""}
        todayLabel={t("dashboard.today")}
        posLabel={t("dashboard.openPos")}
        readyLabel={t("dashboard.readyForService")}
        revenueLabel={t("dashboard.todayRevenue")}
        revenueValue={`฿ ${formatCurrency(todayRevenue)}`}
        ordersLabel={t("dashboard.todayOrders")}
        ordersValue={todayOrderCount}
      />

      <ShortcutPanel
        title={t("dashboard.controlSection")}
        storeId={id ?? ""}
        ordersLabel={t("dashboard.orders")}
        ordersHint={t("dashboard.ordersHint")}
        kdsLabel={t("dashboard.kds")}
        kdsHint={t("dashboard.kdsHint")}
        settingsLabel={t("dashboard.settings")}
        settingsHint={t("dashboard.settingsHint")}
      />
    </div>
  );
};

export default StoreDashboardPage;

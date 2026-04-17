import { Card, CardContent } from "@/shared/components/ui/card";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { StatCard } from "@/shared/components/ui/stat-card";
import { IconTile } from "@/shared/components/ui/icon-tile";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useTranslation } from "@/shared/i18n/use-translation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuChefHat,
  LuClipboardCheck,
  LuRefreshCw,
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

/* ── Hooks ─────────────────────────────────────────────── */

const useLiveClock = () => {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  return now;
};

/* ── Sub-components ────────────────────────────────────── */

const SignalBars = () => (
  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
    <rect x="0" y="10" width="3" height="4" rx="0.75" fill="var(--color-warning)" />
    <rect x="5" y="7" width="3" height="7" rx="0.75" fill="var(--color-warning)" />
    <rect x="10" y="3" width="3" height="11" rx="0.75" fill="var(--color-warning)" />
    <rect x="15" y="0" width="3" height="14" rx="0.75" fill="var(--color-warning)" />
  </svg>
);

const DashboardChrome = ({
  overviewLabel,
  storeName,
  time,
  date,
}: {
  overviewLabel: string;
  storeName: string;
  time: string;
  date: string;
}) => (
  <header className="flex w-full items-center justify-between gap-4 py-2">
    <div>
      <p className="text-label text-text-tertiary">{overviewLabel}</p>
      <span className="text-subtitle font-semibold text-text-primary">{storeName}</span>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 text-body-sm text-text-tertiary tabular-nums">
        <span>{time}</span>
        <LuRefreshCw size={12} />
      </div>
      <div className="flex items-center gap-2 rounded-chip border border-border bg-chip-inactive-bg px-3 py-1.5">
        <span className="text-body-sm font-semibold text-text-primary tabular-nums">
          {time}
        </span>
        <span className="text-caption text-text-tertiary">{date}</span>
        <SignalBars />
      </div>
    </div>
  </header>
);

const HeroSection = ({
  storeName,
  storeId,
  todayLabel,
  posLabel,
  posSubtitle,
}: {
  storeName: string;
  storeId: string;
  todayLabel: string;
  posLabel: string;
  posSubtitle: string;
}) => (
  <section className="mb-16 flex flex-col items-center gap-5 text-center">
    <p className="text-label text-text-tertiary uppercase tracking-[0.08em]">{todayLabel}</p>
    <h1 className="text-display font-semibold text-text-primary tracking-tight">
      {storeName}
    </h1>
    <p className="max-w-xl text-body text-text-secondary">
      {posSubtitle}
    </p>
    <Link
      to={`/store/${storeId}/pos`}
      className="inline-flex h-button-height-lg items-center justify-center rounded-xl bg-button-primary-bg px-12 text-button-lg font-button text-button-primary-text transition-colors duration-[var(--motion-fast)] hover:bg-button-primary-bg-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
    >
      {posLabel}
    </Link>
  </section>
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
  <Link to={to}>
    <Card className="transition-colors duration-[var(--motion-fast)] hover:bg-card-bg-hover">
      <CardContent className="flex flex-col items-center gap-4 py-8">
        <IconTile size="lg" tone="neutral" shape="square">
          {icon}
        </IconTile>
        <span className="text-body-sm font-medium text-text-secondary">
          {label}
        </span>
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
  const now = useLiveClock();

  const timeString = now.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const dateString = now.toLocaleDateString("th-TH", {
    day: "numeric",
    month: "long",
  });

  const today = new Date();

  const todayOrders = useMemo(
    () =>
      (ordersQuery as DashboardOrder[]).filter((order) =>
        isSameCalendarDay(order.createdAt, today),
      ),
    [ordersQuery, today],
  );

  const todayOrderCount = todayOrders.length;
  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + (typeof order.totalAmount === "number" ? order.totalAmount : 0),
    0,
  );

  /* Loading state */
  if (storeFinOneLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <SkeletonCard className="h-12 w-64" />
        <SkeletonCard className="h-16 w-80" />
        <SkeletonCard className="h-12 w-48 rounded-xl" />
        <div className="grid grid-cols-2 gap-4 w-full max-w-2xl">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
        </div>
      </div>
    );
  }

  /* Error state */
  if (storeFinOneQueryError) {
    return <div>Error: {storeFinOneQueryError}</div>;
  }

  const storeName = storeFinOneQuery?.name ?? "";

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl flex-col">
      <div className="w-full">
        <DashboardChrome
          overviewLabel={t("dashboard.storeOverview")}
          storeName={storeName}
          time={timeString}
          date={dateString}
        />
      </div>

      <div className="flex flex-1 flex-col justify-center py-12">
        <HeroSection
          storeName={storeName}
          storeId={id ?? ""}
          todayLabel={t("dashboard.today")}
          posLabel={t("dashboard.openPos")}
          posSubtitle={t("dashboard.startReceivingOrders")}
        />

        <section className="mb-16 grid w-full gap-4 md:grid-cols-2">
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

        <section className="w-full">
          <h2 className="mb-4 text-subtitle font-semibold text-text-primary">
            {t("dashboard.shortcuts")}
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
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
    </div>
  );
};

export default StoreDashboardPage;

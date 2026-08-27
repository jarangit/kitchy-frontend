import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useStoreOperations } from "@/features/store/hooks/use-store-operations";
import { useTranslation } from "@/shared/i18n/use-translation";
import { type ReactNode, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LuArrowRight,
  LuChefHat,
  LuHistory,
  LuSettings,
  LuShoppingCart,
} from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import TodayOrderTimeline from "@/features/store/components/today-order-timeline";
import { StoreOperationsOverview } from "@/features/store/components/store-operations-overview";
import type { OperationsStatusRowProps } from "@/features/store/components/operations-status-row";

/* ── Helpers ───────────────────────────────────────────── */

// typed helpers — keep MessageKey narrowing
type TFn = (
  key: import("@/shared/i18n/messages").MessageKey,
  values?: Record<string, string | number>,
) => string;

const formatItemCount = (count: number, t: TFn): string => {
  return t("dashboard.operations.itemCount", { count: String(count) });
};

const formatMinutes = (minutes: number, t: TFn): string => {
  return t("dashboard.operations.minutesAgo", { count: String(minutes) });
};

/* ── Sub-components ────────────────────────────────────── */

const DashboardCard = ({
  icon,
  title,
  to,
  footerLabel,
}: {
  icon: ReactNode;
  title: string;
  to: string;
  footerLabel: string;
}) => (
  <Link
    to={to}
    className="group flex h-full flex-col rounded-card border border-border-hover bg-surface px-4 py-4 shadow-sm transition-all duration-fast hover:border-border-hover hover:bg-card-bg-hover hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:ring-offset-2 focus-visible:ring-offset-bg sm:px-5 sm:py-5"
  >
    <div className="flex items-start justify-between gap-4">
      <span className="rounded-full bg-surface-muted p-2 text-text-secondary transition-colors duration-fast group-hover:text-text-primary">
        {icon}
      </span>
      <LuArrowRight
        className="h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-fast group-hover:translate-x-0.5 group-hover:text-text-secondary"
        aria-hidden="true"
      />
    </div>
    <h2 className="mt-3 text-body font-medium text-text-primary sm:text-subtitle">
      {title}
    </h2>
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
  const {
    todayOrders,
    todayOpenOrders,
    todayOpenOrdersCount,
    kitchenPending,
    kitchenPendingCount,
    readyToServe,
    readyToServeCount,
    parseTimeLabel,
    elapsedMinutesLabel,
  } = useStoreOperations();

  const todayOrdersForTimeline = useMemo(() => {
    return todayOrders.map((o) => ({ createdAt: o.createdAt }));
  }, [todayOrders]);

  const stages = useMemo(
    () => [
      {
        index: 1,
        label: t("dashboard.operations.stage.openOrders"),
        count: todayOpenOrdersCount,
        helperText: t("dashboard.operations.helper.open"),
        tone: "default" as const,
      },
      {
        index: 2,
        label: t("dashboard.operations.stage.kitchen"),
        count: kitchenPendingCount,
        helperText: t("dashboard.operations.helper.kitchen"),
        tone: "warning" as const,
      },
      {
        index: 3,
        label: t("dashboard.operations.stage.ready"),
        count: readyToServeCount,
        helperText: t("dashboard.operations.helper.ready"),
        tone: "success" as const,
      },
    ],
    [t, todayOpenOrdersCount, kitchenPendingCount, readyToServeCount],
  );

  const columns = useMemo(() => {
    const leftRows: OperationsStatusRowProps[] = todayOpenOrders
      .slice(0, 5)
      .map((o) => {
        return {
          orderNumber: o.orderNumber.padStart(5, "0"),
          timeLabel: parseTimeLabel(o.createdAt),
          badgeLabel: t("dashboard.operations.badge.prepare"),
          badgeTone: "default" as const,
          trailingVariant: "chevron" as const,
          to: `/store/${id}/transactions`,
        };
      });

    const middleRows: OperationsStatusRowProps[] = kitchenPending
      .slice(0, 5)
      .map((o) => ({
        orderNumber: o.orderNumber.padStart(5, "0"),
        timeLabel: parseTimeLabel(o.createdAt),
        itemCountLabel: formatItemCount(o.count, t),
        badgeLabel: t("dashboard.operations.badge.cooking"),
        badgeTone: "warning" as const,
        trailingLabel: formatMinutes(elapsedMinutesLabel(o.createdAt), t),
        trailingVariant: "text" as const,
        to: `/store/${id}/kds`,
      }));

    const rightRows: OperationsStatusRowProps[] = readyToServe
      .slice(0, 5)
      .map((o) => ({
        orderNumber: o.orderNumber.padStart(5, "0"),
        timeLabel: parseTimeLabel(o.createdAt),
        itemCountLabel: formatItemCount(o.quantity, t),
        badgeLabel: t("dashboard.operations.badge.ready"),
        badgeTone: "success" as const,
        trailingLabel: formatMinutes(elapsedMinutesLabel(o.createdAt), t),
        trailingVariant: "text" as const,
        to: `/store/${id}/ready-to-serve`,
      }));

    return [
      {
        title: t("dashboard.operations.stage.openOrders"),
        count: todayOpenOrdersCount,
        tone: "default" as const,
        rows: leftRows,
        viewAllTo: `/store/${id}/transactions`,
      },
      {
        title: t("dashboard.operations.stage.kitchen"),
        count: kitchenPendingCount,
        tone: "warning" as const,
        rows: middleRows,
        viewAllTo: `/store/${id}/kds`,
      },
      {
        title: t("dashboard.operations.stage.ready"),
        count: readyToServeCount,
        tone: "success" as const,
        rows: rightRows,
        viewAllTo: `/store/${id}/ready-to-serve`,
      },
    ];
  }, [
    t,
    id,
    todayOpenOrders,
    todayOpenOrdersCount,
    kitchenPending,
    kitchenPendingCount,
    readyToServe,
    readyToServeCount,
    parseTimeLabel,
    elapsedMinutesLabel,
  ]);

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
          <p className="text-label uppercase tracking-widest text-text-tertiary">
            {t("dashboard.storeOverview")}
          </p>
          <h1 className="truncate text-heading font-semibold tracking-tight text-text-primary">
            {storeName}
          </h1>
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

      <StoreOperationsOverview stages={stages} columns={columns} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardCard
          icon={<LuShoppingCart size={22} />}
          title={t("dashboard.orders")}
          to={`/store/${id}/pos`}
          footerLabel={t("dashboard.openPos")}
        />

        <DashboardCard
          icon={<LuChefHat size={22} />}
          title={t("dashboard.kitchen")}
          to={`/store/${id}/kds`}
          footerLabel={t("dashboard.openKds")}
        />

        <DashboardCard
          icon={<LuHistory size={22} />}
          title={t("dashboard.summaryHistory")}
          to={`/store/${id}/transactions`}
          footerLabel={t("dashboard.viewHistory")}
        />

        <Card className="shadow-sm md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("dashboard.ordersByTime")}</CardTitle>
            <CardDescription>{t("dashboard.ordersByTimeDesc")}</CardDescription>
          </CardHeader>
          <TodayOrderTimeline orders={todayOrdersForTimeline} />
        </Card>

        <DashboardCard
          icon={<LuSettings size={22} />}
          title={t("dashboard.settings")}
          to={`/store/${id}/settings`}
          footerLabel={t("dashboard.openSettings")}
        />
      </div>
    </div>
  );
};

export default StoreDashboardPage;

import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { ErrorState } from "@/shared/components/ui/error-state";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { useStoreOperations } from "@/features/store/hooks/use-store-operations";
import { useStoreOverviewCounts } from "@/shared/hooks/use-store-overview-counts";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuShoppingCart } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import TodayOrderTimeline from "@/features/store/components/today-order-timeline";
import { StoreOperationsOverview } from "@/features/store/components/store-operations-overview";

/* ── Page ──────────────────────────────────────────────── */

const StoreDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { storeFinOneQuery, storeFinOneLoading, storeFinOneQueryError } =
    useStoreService({});
  const { todayOrders } = useStoreOperations();
  const { openOrdersCount, kitchenPendingCount, readyToServeCount } =
    useStoreOverviewCounts();

  const todayOrdersForTimeline = useMemo(() => {
    return todayOrders.map((o) => ({ createdAt: o.createdAt }));
  }, [todayOrders]);

  const stages = useMemo(
    () => [
      {
        index: 1,
        label: t("dashboard.operations.stage.openOrders"),
        count: openOrdersCount,
        helperText: t("dashboard.operations.helper.open"),
        tone: "default" as const,
        to: `/store/${id}/transactions`,
      },
      {
        index: 2,
        label: t("dashboard.operations.stage.kitchen"),
        count: kitchenPendingCount,
        helperText: t("dashboard.operations.helper.kitchen"),
        tone: "warning" as const,
        to: `/store/${id}/kds`,
      },
      {
        index: 3,
        label: t("dashboard.operations.stage.ready"),
        count: readyToServeCount,
        helperText: t("dashboard.operations.helper.ready"),
        tone: "success" as const,
        to: `/store/${id}/ready-to-serve`,
      },
    ],
    [t, id, openOrdersCount, kitchenPendingCount, readyToServeCount],
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

      <StoreOperationsOverview stages={stages} />

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.ordersByTime")}</CardTitle>
          <CardDescription>{t("dashboard.ordersByTimeDesc")}</CardDescription>
        </CardHeader>
        <TodayOrderTimeline orders={todayOrdersForTimeline} />
      </Card>
    </div>
  );
};

export default StoreDashboardPage;

import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useKds } from "@/features/kds/hooks/useKds";
import KdsHeader from "@/features/kds/components/kds-header";
import KdsOrderCard from "@/features/kds/components/kds-order-card";
import { useStationService } from "@/features/station/hooks/useStation";
import { Button } from "@/shared/components/ui/button";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { LuUtensilsCrossed } from "react-icons/lu";

const DUE_NOW_MINUTES = 10;

const getWaitingMinutes = (createdAt: string) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

const KdsBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { stationsQuery } = useStationService({});
  const activeStation = stationsQuery?.[0];
  const [activeTab, setActiveTab] = useState<"PENDING" | "READY">("PENDING");

  const { orders, isLoading, isRefetching, isUpdating, updateStatus } = useKds(
    activeStation?.id
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status !== "READY"),
    [orders]
  );
  const readyOrders = useMemo(
    () => orders.filter((order) => order.status === "READY"),
    [orders]
  );
  const sortedPendingOrders = useMemo(
    () =>
      [...pendingOrders].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [pendingOrders]
  );
  const sortedReadyOrders = useMemo(
    () =>
      [...readyOrders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [readyOrders]
  );
  const dueNowOrders = useMemo(
    () => sortedPendingOrders.filter((order) => getWaitingMinutes(order.createdAt) >= DUE_NOW_MINUTES),
    [sortedPendingOrders]
  );
  const nextOrders = useMemo(
    () => sortedPendingOrders.filter((order) => getWaitingMinutes(order.createdAt) < DUE_NOW_MINUTES),
    [sortedPendingOrders]
  );
  const visibleOrders = activeTab === "PENDING" ? sortedPendingOrders : sortedReadyOrders;

  return (
    <div className="space-y-6 h-full">
      <KdsHeader
        storeId={id as string}
        stationName={activeStation?.name}
        isRefetching={isRefetching}
      />

      <div className="flex items-center gap-2">
        <Button
          variant={activeTab === "PENDING" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab("PENDING")}
          className="h-11 px-4"
        >
          Pending ({pendingOrders.length})
        </Button>
        <Button
          variant={activeTab === "READY" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab("READY")}
          className="h-11 px-4"
        >
          Ready ({readyOrders.length})
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard className="min-h-[320px]" />
          <SkeletonCard className="min-h-[320px]" />
          <SkeletonCard className="min-h-[320px]" />
        </div>
      ) : (
        activeStation == null ? (
          <div className="min-h-[320px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
            <p className="text-lg font-semibold text-[var(--color-text-primary)]">
              No station found
            </p>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Please create a station to use KDS in single-station mode.
            </p>
          </div>
        ) : (
          <div className="min-h-[420px]">
            {visibleOrders.length === 0 ? (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <EmptyState
                  icon={<LuUtensilsCrossed size={28} />}
                  title={activeTab === "PENDING" ? "No pending orders" : "No ready orders"}
                  description="Orders will appear automatically"
                />
              </div>
            ) : (
              activeTab === "PENDING" ? (
                <div className="space-y-6">
                  {dueNowOrders.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex min-h-8 items-center rounded-full bg-[var(--color-danger-bg)] px-3 text-sm font-semibold text-[var(--color-danger)]">
                          DUE NOW ({dueNowOrders.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {dueNowOrders.map((order, index) => (
                          <div key={order.id} className="h-full min-h-[360px]">
                            <KdsOrderCard
                              order={order}
                              onMove={updateStatus}
                              disabled={isUpdating}
                              queueNumber={index + 1}
                              prioritize
                              priorityTone="due"
                              showStatusBadge={false}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  {nextOrders.length > 0 && (
                    <section className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex min-h-8 items-center rounded-full bg-[var(--color-warning-bg)] px-3 text-sm font-semibold text-[var(--color-warning)]">
                          NEXT ({nextOrders.length})
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {nextOrders.map((order, index) => (
                          <div key={order.id} className="h-full min-h-[360px]">
                            <KdsOrderCard
                              order={order}
                              onMove={updateStatus}
                              disabled={isUpdating}
                              queueNumber={dueNowOrders.length + index + 1}
                              prioritize
                              priorityTone="next"
                              showStatusBadge={false}
                            />
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleOrders.map((order) => (
                    <div key={order.id} className="h-full min-h-[360px]">
                      <KdsOrderCard
                        order={order}
                        onMove={updateStatus}
                        disabled={isUpdating}
                        showStatusBadge={false}
                      />
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )
      )}
    </div>
  );
};

export default KdsBoardPage;

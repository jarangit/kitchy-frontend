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

  const { cards, isLoading, isRefetching, isUpdating, updateStatus } = useKds(
    activeStation?.id
  );

  const pendingCards = useMemo(
    () => cards.filter((c) => c.status === "PENDING"),
    [cards]
  );
  const readyCards = useMemo(
    () => cards.filter((c) => c.status === "READY"),
    [cards]
  );
  const sortedPending = useMemo(
    () =>
      [...pendingCards].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      ),
    [pendingCards]
  );
  const sortedReady = useMemo(
    () =>
      [...readyCards].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [readyCards]
  );
  const dueNow = useMemo(
    () => sortedPending.filter((c) => getWaitingMinutes(c.createdAt) >= DUE_NOW_MINUTES),
    [sortedPending]
  );
  const next = useMemo(
    () => sortedPending.filter((c) => getWaitingMinutes(c.createdAt) < DUE_NOW_MINUTES),
    [sortedPending]
  );
  const visibleCards = activeTab === "PENDING" ? sortedPending : sortedReady;

  return (
    <div className="space-y-8 h-full">
      <KdsHeader
        storeId={id as string}
        stationName={activeStation?.name}
        isRefetching={isRefetching}
      />

      <div className="flex items-center gap-3">
        <Button
          variant={activeTab === "PENDING" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab("PENDING")}
          className="h-11 px-5"
        >
          Pending ({pendingCards.length})
        </Button>
        <Button
          variant={activeTab === "READY" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveTab("READY")}
          className="h-11 px-5"
        >
          Ready ({readyCards.length})
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard className="min-h-[280px]" />
          <SkeletonCard className="min-h-[280px]" />
          <SkeletonCard className="min-h-[280px]" />
        </div>
      ) : activeStation == null ? (
        <div className="min-h-[320px] rounded-radius-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center">
          <p className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
            No station found
          </p>
          <p className="mt-2 text-body-sm text-[var(--color-text-secondary)]">
            Please create a station to use KDS in single-station mode.
          </p>
        </div>
      ) : visibleCards.length === 0 ? (
        <div className="rounded-radius-md border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <EmptyState
            icon={<LuUtensilsCrossed size={28} />}
            title={activeTab === "PENDING" ? "No pending items" : "No ready items"}
            description="Items will appear automatically"
          />
        </div>
      ) : activeTab === "PENDING" ? (
        <div className="space-y-8">
          {dueNow.length > 0 && (
            <section className="space-y-4">
              <span className="inline-flex min-h-8 items-center rounded-radius-full bg-[var(--color-danger-bg)] px-3 text-label font-[var(--weight-semibold)] text-[var(--color-danger)]">
                DUE NOW ({dueNow.length})
              </span>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {dueNow.map((card, index) => (
                  <div key={card.orderStationItemId} className="h-full min-h-[300px]">
                    <KdsOrderCard
                      card={card}
                      onMove={updateStatus}
                      disabled={isUpdating}
                      queueNumber={index + 1}
                      prioritize
                      priorityTone="due"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          {next.length > 0 && (
            <section className="space-y-4">
              <span className="inline-flex min-h-8 items-center rounded-radius-full bg-[var(--color-warning-bg)] px-3 text-label font-[var(--weight-semibold)] text-[var(--color-warning)]">
                NEXT ({next.length})
              </span>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                {next.map((card, index) => (
                  <div key={card.orderStationItemId} className="h-full min-h-[300px]">
                    <KdsOrderCard
                      card={card}
                      onMove={updateStatus}
                      disabled={isUpdating}
                      queueNumber={dueNow.length + index + 1}
                      prioritize
                      priorityTone="next"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleCards.map((card) => (
            <div key={card.orderStationItemId} className="h-full min-h-[300px]">
              <KdsOrderCard
                card={card}
                onMove={updateStatus}
                disabled={isUpdating}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KdsBoardPage;

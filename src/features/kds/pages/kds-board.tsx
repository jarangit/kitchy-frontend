import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useKds } from "@/features/kds/hooks/useKds";
import KdsHeader from "@/features/kds/components/kds-header";
import KdsOrderCard from "@/features/kds/components/kds-order-card";
import { useStationService } from "@/features/station/hooks/useStation";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/i18n/use-translation";
import { LuUtensilsCrossed } from "react-icons/lu";

const DUE_NOW_MINUTES = 10;

const getWaitingMinutes = (createdAt: string) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

const KdsBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
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

      <div className="flex items-center gap-2">
        <ChipTab
          size="md"
          active={activeTab === "PENDING"}
          onClick={() => setActiveTab("PENDING")}
        >
          {t("kds.tab.pending")} {t("kds.tab.countSuffix", { count: String(pendingCards.length) })}
        </ChipTab>
        <ChipTab
          size="md"
          active={activeTab === "READY"}
          onClick={() => setActiveTab("READY")}
        >
          {t("kds.tab.ready")} {t("kds.tab.countSuffix", { count: String(readyCards.length) })}
        </ChipTab>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <SkeletonCard className="min-h-[280px]" />
          <SkeletonCard className="min-h-[280px]" />
          <SkeletonCard className="min-h-[280px]" />
        </div>
      ) : activeStation == null ? (
        <div className="rounded-card border border-card-border bg-card-bg p-card-padding">
          <EmptyState
            icon={<LuUtensilsCrossed size={28} />}
            title={t("kds.empty.noStationTitle")}
            description={t("kds.empty.noStationDescription")}
          />
        </div>
      ) : visibleCards.length === 0 ? (
        <div className="rounded-card border border-card-border bg-card-bg p-card-padding">
          <EmptyState
            icon={<LuUtensilsCrossed size={28} />}
            title={activeTab === "PENDING" ? t("kds.empty.pendingTitle") : t("kds.empty.readyTitle")}
            description={t("kds.empty.description")}
          />
        </div>
      ) : activeTab === "PENDING" ? (
        <div className="space-y-8">
          {dueNow.length > 0 && (
            <section className="space-y-4">
              <span className="inline-flex min-h-8 items-center rounded-full bg-danger-bg px-3 text-label font-semibold text-danger tracking-[0.08em] uppercase">
                {t("kds.priority.dueNow", { count: String(dueNow.length) })}
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
              <span className="inline-flex min-h-8 items-center rounded-full bg-warning-bg px-3 text-label font-semibold text-warning tracking-[0.08em] uppercase">
                {t("kds.priority.next", { count: String(next.length) })}
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

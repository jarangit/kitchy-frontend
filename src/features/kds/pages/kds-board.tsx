import { useEffect, useMemo, useRef, useState } from "react";
import { useKds } from "@/features/kds/hooks/useKds";
import KdsOrderColumn from "@/features/kds/components/kds-order-column";
import KdsStatsBar from "@/features/kds/components/kds-stats-bar";
import { useStationService } from "@/features/station/hooks/useStation";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Card } from "@/shared/components/ui/card";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/i18n/use-translation";
import { LuUtensilsCrossed } from "react-icons/lu";

const DEFAULT_ORDER_LIMIT = 20;

const useDragScroll = (ref: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const pageX = (e: Event) => {
      return "touches" in e
        ? (e as TouchEvent).touches[0]!.pageX
        : (e as MouseEvent).pageX;
    };

    const onDown = (e: Event) => {
      isDown = true;
      el.classList.add("cursor-grabbing");
      el.classList.remove("cursor-grab");
      startX = pageX(e) - el.offsetLeft;
      scrollLeft = el.scrollLeft;
    };
    const onMove = (e: Event) => {
      if (!isDown) return;
      e.preventDefault();
      const x = pageX(e) - el.offsetLeft;
      el.scrollLeft = scrollLeft - (x - startX);
    };
    const onUp = () => {
      isDown = false;
      el.classList.remove("cursor-grabbing");
      el.classList.add("cursor-grab");
    };

    el.addEventListener("mousedown", onDown);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseup", onUp);
    el.addEventListener("mouseleave", onUp);
    el.addEventListener("touchstart", onDown, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onUp);
    el.addEventListener("touchcancel", onUp);

    return () => {
      el.removeEventListener("mousedown", onDown);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseup", onUp);
      el.removeEventListener("mouseleave", onUp);
      el.removeEventListener("touchstart", onDown);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onUp);
      el.removeEventListener("touchcancel", onUp);
    };
  }, [ref]);
};

const KdsBoardPage = () => {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useDragScroll(scrollRef);
  const { stationsQuery } = useStationService({});
  const { storeFinOneQuery } = useStoreService({});
  const stations = useMemo(() => stationsQuery ?? [], [stationsQuery]);
  const [activeStationId, setActiveStationId] = useState<string | null>(null);
  const activeStation = useMemo(() => {
    if (stations.length === 0) return null;
    return (
      stations.find((station) => station.id === activeStationId) ?? stations[0]
    );
  }, [activeStationId, stations]);

  const {
    pendingGroups,
    isLoading,
    isUpdating,
    bumpAndRemove,
    bumpedOrderId,
    updateStatus,
  } = useKds(activeStation?.id);
  const orderLimit = storeFinOneQuery?.orderLimit ?? DEFAULT_ORDER_LIMIT;

  const handleBump = (group: Parameters<typeof bumpAndRemove>[0]) => {
    void bumpAndRemove(group);
  };

  const handleItemReady = (item: Parameters<typeof updateStatus>[0]) => {
    void updateStatus(item, item.status === "READY" ? "PENDING" : "READY");
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 page-shell">
      {stations.length > 1 && (
        <Tabs
          value={activeStation?.id ?? ""}
          onChange={setActiveStationId}
          variant="chip"
          size="md"
        >
          <TabList aria-label={t("pos.cart.selectTable")} scrollable>
            {stations.map((station) => (
              <Tab key={station.id} value={station.id}>
                {station.name}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      )}

      {isLoading ? (
        <div className="flex gap-4 overflow-x-auto pb-2">
          <SkeletonCard className="h-[480px] w-[300px] shrink-0" />
          <SkeletonCard className="h-[480px] w-[300px] shrink-0" />
          <SkeletonCard className="h-[480px] w-[300px] shrink-0" />
        </div>
      ) : activeStation == null ? (
        <Card>
          <EmptyState
            icon={<LuUtensilsCrossed size={28} />}
            title={t("kds.empty.noStationTitle")}
            description={t("kds.empty.noStationDescription")}
          />
        </Card>
      ) : (
        <>
          <KdsStatsBar groups={pendingGroups} orderLimit={orderLimit} />
          {pendingGroups.length === 0 ? (
            <Card>
              <EmptyState
                icon={<LuUtensilsCrossed size={28} />}
                title={t("kds.empty.pendingTitle")}
                description={t("kds.empty.description")}
              />
            </Card>
          ) : (
            <div
              ref={scrollRef}
              className="flex flex-1 min-h-0 gap-4 overflow-x-auto cursor-grab pb-2 select-none"
            >
              {pendingGroups.map((group) => (
                <KdsOrderColumn
                  key={group.orderId}
                  group={group}
                  isBumped={bumpedOrderId === group.orderId}
                  onBump={handleBump}
                  onItemReady={handleItemReady}
                  disabled={isUpdating}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KdsBoardPage;

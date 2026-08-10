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

type KdsBoardScreenState =
  "loading" | "no-station" | "empty-queue" | "active-board";

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

interface KdsStationTabsProps {
  stations: Array<{ id: string; name: string }>;
  activeStationId: string;
  onChange: (stationId: string) => void;
}

const KdsStationTabs = ({
  stations,
  activeStationId,
  onChange,
}: KdsStationTabsProps) => {
  const { t } = useTranslation();

  if (stations.length <= 1) return null;

  return (
    <Tabs value={activeStationId} onChange={onChange} variant="chip" size="md">
      <TabList aria-label={t("pos.cart.selectTable")} scrollable>
        {stations.map((station) => (
          <Tab key={station.id} value={station.id}>
            {station.name}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

const KdsBoardLoadingState = () => (
  <div className="flex gap-4 overflow-x-auto pb-2">
    <SkeletonCard className="h-[480px] w-[360px] shrink-0" />
    <SkeletonCard className="h-[480px] w-[360px] shrink-0" />
    <SkeletonCard className="h-[480px] w-[360px] shrink-0" />
  </div>
);

interface KdsBoardEmptyStateProps {
  title: string;
  description: string;
}

const KdsBoardEmptyState = ({
  title,
  description,
}: KdsBoardEmptyStateProps) => (
  <Card>
    <EmptyState
      icon={<LuUtensilsCrossed size={28} />}
      title={title}
      description={description}
    />
  </Card>
);

interface KdsBoardWorkspaceProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  groups: Parameters<typeof KdsOrderColumn>[0]["group"][];
  bumpedOrderId: string | null;
  isUpdating: boolean;
  onBump: (group: Parameters<typeof KdsOrderColumn>[0]["group"]) => void;
  onItemReady: (
    item: Parameters<typeof KdsOrderColumn>[0]["group"]["items"][number],
  ) => void;
}

const KdsBoardWorkspace = ({
  scrollRef,
  groups,
  bumpedOrderId,
  isUpdating,
  onBump,
  onItemReady,
}: KdsBoardWorkspaceProps) => (
  <div
    ref={scrollRef}
    className="flex flex-1 min-h-0 gap-4 overflow-x-auto cursor-grab pb-2 select-none"
  >
    {groups.map((group) => (
      <KdsOrderColumn
        key={group.orderId}
        group={group}
        isBumped={bumpedOrderId === group.orderId}
        isRecentlyCompleted={
          bumpedOrderId !== group.orderId && group.status === "READY"
        }
        onBump={onBump}
        onItemReady={onItemReady}
        disabled={isUpdating || group.status === "READY"}
      />
    ))}
  </div>
);

const KdsBoardPage = () => {
  const { t } = useTranslation();
  const boardScrollRef = useRef<HTMLDivElement | null>(null);
  useDragScroll(boardScrollRef);
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
    visiblePendingGroups,
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

  const screenState: KdsBoardScreenState = isLoading
    ? "loading"
    : activeStation == null
      ? "no-station"
      : visiblePendingGroups.length === 0
        ? "empty-queue"
        : "active-board";

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 page-shell">
      {/* Top controls: station-scoped board switcher */}
      <KdsStationTabs
        stations={stations}
        activeStationId={activeStation?.id ?? ""}
        onChange={setActiveStationId}
      />

      {/* Screen states: loading, missing station, empty queue, active board */}
      {screenState === "loading" && <KdsBoardLoadingState />}

      {screenState === "no-station" && (
        <KdsBoardEmptyState
          title={t("kds.empty.noStationTitle")}
          description={t("kds.empty.noStationDescription")}
        />
      )}

      {(screenState === "empty-queue" || screenState === "active-board") && (
        <>
          {/* Queue summary: workload overview for the active station */}
          <KdsStatsBar groups={pendingGroups} orderLimit={orderLimit} />

          {screenState === "empty-queue" ? (
            <KdsBoardEmptyState
              title={t("kds.empty.pendingTitle")}
              description={t("kds.empty.description")}
            />
          ) : (
            /* Main workspace: horizontally scrollable queue of order columns */
            <KdsBoardWorkspace
              scrollRef={boardScrollRef}
              groups={visiblePendingGroups}
              bumpedOrderId={bumpedOrderId}
              isUpdating={isUpdating}
              onBump={handleBump}
              onItemReady={handleItemReady}
            />
          )}
        </>
      )}
    </div>
  );
};

export default KdsBoardPage;

import { useEffect, useMemo, useRef, useState } from "react";
import { useKds } from "@/features/kds/hooks/useKds";
import { useNewOrderAlert } from "@/features/kds/hooks/use-new-order-alert";
import { useAlertSound } from "@/features/kds/hooks/use-alert-sound";
import KdsOrderColumn from "@/features/kds/components/kds-order-column";
import KdsStatsBar from "@/features/kds/components/kds-stats-bar";
import { KdsControlGroup } from "@/features/kds/components/kds-controls";
import { useKdsLayout } from "@/features/kds/components/kds-layout";
import { useStationService } from "@/features/station/hooks/useStation";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Card } from "@/shared/components/ui/card";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import {
  decodeDeviceToken,
  hasDeviceToken,
} from "@/features/device/utils/device-token";
import { LuUtensilsCrossed } from "react-icons/lu";

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
  fullscreen?: boolean;
}

const KdsBoardWorkspace = ({
  scrollRef,
  groups,
  bumpedOrderId,
  isUpdating,
  onBump,
  onItemReady,
  fullscreen = false,
}: KdsBoardWorkspaceProps) => (
  <div
    ref={scrollRef}
    className={cn(
      "flex flex-1 min-h-0 gap-4 overflow-x-auto cursor-grab pb-2 select-none",
      fullscreen && "px-3",
    )}
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
  const { fullscreen } = useKdsLayout();
  const boardScrollRef = useRef<HTMLDivElement | null>(null);
  useDragScroll(boardScrollRef);
  const { alertSoundOn } = useAlertSound();
  const { stationsQuery } = useStationService({});
  const stations = useMemo(() => stationsQuery ?? [], [stationsQuery]);
  const deviceMode = hasDeviceToken();
  const deviceStationId = decodeDeviceToken()?.station ?? null;
  const [activeStationId, setActiveStationId] = useState<string | null>(
    deviceStationId,
  );
  const activeStation = useMemo(() => {
    if (stations.length === 0) return null;
    if (deviceMode && deviceStationId) {
      return (
        stations.find((station) => station.id === deviceStationId) ??
        stations[0]
      );
    }
    return (
      stations.find((station) => station.id === activeStationId) ?? stations[0]
    );
  }, [activeStationId, deviceMode, deviceStationId, stations]);

  const {
    pendingGroups,
    visiblePendingGroups,
    isLoading,
    isUpdating,
    bumpAndRemove,
    bumpedOrderId,
    updateStatus,
  } = useKds(activeStation?.id);

  // Alert scope follows the visible queue: re-baseline per station and
  // ignore snapshots while the station's query is still loading.
  useNewOrderAlert(pendingGroups, {
    enabled: alertSoundOn,
    scopeKey: activeStation?.id,
    isSnapshotPending: isLoading,
  });

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

  const showStats =
    screenState === "empty-queue" || screenState === "active-board";
  const showTopControls = !showStats;

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col gap-4",
        fullscreen ? "p-0" : "p-card-padding",
      )}
    >
      {/* Top controls: station-scoped board switcher + utility controls (when stats bar is hidden) */}
      {showTopControls && (
        <div className="flex items-center justify-between gap-3">
          {!deviceMode && (
            <KdsStationTabs
              stations={stations}
              activeStationId={activeStation?.id ?? ""}
              onChange={setActiveStationId}
            />
          )}
          {!showStats && (
            <div className="ml-auto shrink-0">
              <KdsControlGroup />
            </div>
          )}
        </div>
      )}

      {/* Screen states: loading, missing station, empty queue, active board */}
      {screenState === "loading" && <KdsBoardLoadingState />}

      {screenState === "no-station" && (
        <KdsBoardEmptyState
          title={t("kds.empty.noStationTitle")}
          description={t("kds.empty.noStationDescription")}
        />
      )}

      {showStats && (
        <>
          {/* Queue summary: workload overview for the active station */}
          <KdsStatsBar groups={pendingGroups} />

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
              fullscreen={fullscreen}
            />
          )}
        </>
      )}
    </div>
  );
};

export default KdsBoardPage;

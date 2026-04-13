import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useKds } from "@/features/kds/hooks/useKds";
import KdsHeader from "@/features/kds/components/kds-header";
import KdsColumn from "@/features/kds/components/kds-column";
import type { KdsStatus } from "@/features/kds/types/kds.model";
import { useStationService } from "@/features/station/hooks/useStation";
import { Button } from "@/shared/components/ui/button";
import { SkeletonCard } from "@/shared/components/ui/skeleton";

const KdsBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const storeId = Number(id);

  const [activeStationId, setActiveStationId] = useState<number | undefined>();
  const { stationsQuery } = useStationService({ storeId });

  const activeStation = useMemo(
    () => stationsQuery?.find((s: { id: number }) => s.id === activeStationId),
    [stationsQuery, activeStationId]
  );

  const { orders, isLoading, isRefetching, isUpdating, updateStatus } = useKds(
    storeId,
    activeStationId
  );

  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status === "PENDING"),
    [orders]
  );
  const cookingOrders = useMemo(
    () => orders.filter((order) => order.status === "COOKING"),
    [orders]
  );
  const readyOrders = useMemo(
    () => orders.filter((order) => order.status === "READY"),
    [orders]
  );

  return (
    <div className="space-y-6 h-full">
      <KdsHeader
        storeId={storeId}
        stationName={activeStation?.name}
        isRefetching={isRefetching}
      />

      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <Button
          variant={activeStationId == null ? "primary" : "secondary"}
          size="sm"
          onClick={() => setActiveStationId(undefined)}
          className="h-11"
        >
          All Stations
        </Button>
        {stationsQuery?.map((station: { id: number; name: string }) => (
          <Button
            key={station.id}
            variant={activeStationId === station.id ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveStationId(station.id)}
            className="h-11"
          >
            {station.name}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SkeletonCard className="min-h-[320px]" />
          <SkeletonCard className="min-h-[320px]" />
          <SkeletonCard className="min-h-[320px]" />
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2 min-h-[420px]">
          <KdsColumn
            title="Pending"
            status="PENDING"
            orders={pendingOrders}
            onMove={updateStatus as (orderId: number, status: KdsStatus) => void}
            disabled={isUpdating}
          />
          <KdsColumn
            title="Cooking"
            status="COOKING"
            orders={cookingOrders}
            onMove={updateStatus as (orderId: number, status: KdsStatus) => void}
            disabled={isUpdating}
          />
          <KdsColumn
            title="Ready"
            status="READY"
            orders={readyOrders}
            onMove={updateStatus as (orderId: number, status: KdsStatus) => void}
            disabled={isUpdating}
          />
        </div>
      )}
    </div>
  );
};

export default KdsBoardPage;

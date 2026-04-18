import React, { useEffect } from "react";
import Sidebar from "./sidebar";
import { setupAutoReload } from "@/shared/utils/idleReload";
import { useNetworkStatus } from "@/shared/hooks/useNetworkStatus";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { setCurrentStoreId } from "@/shared/store/slices/current-store-slice";
import {
  clearCurrentStation,
  setCurrentStation,
} from "@/shared/store/slices/current-station-slice";
import { useStationService } from "@/features/station/hooks/useStation";
import { cn } from "@/shared/utils/cn";

type Props = {
  children?: React.ReactNode;
  noPadding?: boolean;
  hideSidebar?: boolean;
};

const Layout = ({ children, noPadding, hideSidebar }: Props) => {
  const isOnline = useNetworkStatus();
  const dispatch = useAppDispatch();
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const currentStoreId = useAppSelector((state) => state.currentStore.storeId);
  const currentStationId = useAppSelector(
    (state) => state.currentStation.stationId
  );
  const { stationsQuery } = useStationService({});

  const routeStoreId = storeId ?? id;

  useEffect(() => {
    setupAutoReload(10);
  }, []);

  useEffect(() => {
    if (routeStoreId && currentStoreId !== routeStoreId) {
      dispatch(setCurrentStoreId(routeStoreId));
      // store เปลี่ยน → reset current station ก่อน แล้วให้ effect ด้านล่าง set ใหม่
      dispatch(clearCurrentStation());
    }
  }, [dispatch, routeStoreId, currentStoreId]);

  useEffect(() => {
    const stations = (stationsQuery ?? []) as Array<{
      id: string;
      name: string;
    }>;
    if (stations.length === 0) return;

    const stillValid = stations.some((s) => s.id === currentStationId);
    if (!currentStationId || !stillValid) {
      const first = stations[0];
      dispatch(
        setCurrentStation({ stationId: first.id, stationName: first.name })
      );
    }
  }, [dispatch, stationsQuery, currentStationId]);

  return (
    <div className="flex min-h-screen bg-bg text-text-primary">
      {!hideSidebar && <Sidebar />}
      <div className={cn("flex min-h-screen flex-grow flex-col transition-all duration-300", !hideSidebar && "ml-sidebar-width")}>
        {!isOnline && (
          <section className="w-full bg-danger-bg py-2 text-center text-label font-[var(--weight-medium)] text-danger">
            You are offline
          </section>
        )}
        <main className={cn("flex flex-1 flex-col", !noPadding && "px-6 py-8 lg:px-10 lg:py-10 xl:px-12 xl:py-12")}>{children}</main>
      </div>
    </div>
  );
};

export default Layout;

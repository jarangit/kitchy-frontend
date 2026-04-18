import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { setCurrentStoreId } from "@/shared/store/slices/current-store-slice";
import {
  clearCurrentStation,
  setCurrentStation,
} from "@/shared/store/slices/current-station-slice";
import { useStationService } from "@/features/station/hooks/useStation";
import { setupAutoReload } from "@/shared/utils/idleReload";

/**
 * Shared side-effects for any authenticated store-scoped shell.
 * Keeps the current store id / station id in Redux in sync with the route,
 * and registers the idle auto-reload handler.
 *
 * Used by the main app <Layout> and the Settings full-screen shell so behaviour
 * stays identical regardless of which chrome the user is viewing.
 */
export function useStoreContextSync() {
  const dispatch = useAppDispatch();
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const currentStoreId = useAppSelector((state) => state.currentStore.storeId);
  const currentStationId = useAppSelector(
    (state) => state.currentStation.stationId,
  );
  const { stationsQuery } = useStationService({});

  const routeStoreId = storeId ?? id;

  useEffect(() => {
    setupAutoReload(10);
  }, []);

  useEffect(() => {
    if (routeStoreId && currentStoreId !== routeStoreId) {
      dispatch(setCurrentStoreId(routeStoreId));
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
        setCurrentStation({ stationId: first.id, stationName: first.name }),
      );
    }
  }, [dispatch, stationsQuery, currentStationId]);
}

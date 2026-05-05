import axiosClient from "@/shared/services/axios-client";
import type { ICreateStation, IUpdateStation } from "@/features/station/types/station.dto";
import { IS_DEMO_MODE, getAdapter } from "@/shared/services/adapters/data-adapter";

export const stationServiceApi = {
  getByStoreId: async (storeId: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).getStationsByStoreId(storeId);
    const response = await axiosClient.get(`/stations/store/${storeId}`);
    return response.data;
  },
  add: async (stationData: ICreateStation) => {
    if (IS_DEMO_MODE) return (await getAdapter()).createStation(stationData);
    const response = await axiosClient.post("/stations", stationData);
    return response.data;
  },
  getById: async (stationId: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).getStationById(stationId);
    const response = await axiosClient.get(`/stations/${stationId}`);
    return response.data;
  },
  update: async (stationId: string, stationData: IUpdateStation) => {
    if (IS_DEMO_MODE) return (await getAdapter()).updateStation(stationId, stationData);
    const response = await axiosClient.patch(`/stations/${stationId}`, stationData);
    return response.data;
  },
  delete: async (stationId: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).deleteStation(stationId);
    const response = await axiosClient.delete(`/stations/${stationId}`);
    return response.data;
  },
};

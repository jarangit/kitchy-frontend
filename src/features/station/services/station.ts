import axiosClient from "@/shared/services/axios-client";
import type { ICreateStation, IUpdateStation } from "@/features/station/types/station.dto";

export const stationServiceApi = {
  getByStoreId: async (storeId: number) => {
    const response = await axiosClient.get(
      `/stations/store/${storeId}`
    );
    return response.data;
  },
  add: async (stationData: ICreateStation) => {
    const response = await axiosClient.post("/stations", stationData);
    return response.data;
  },
  getById: async (stationId: number) => {
    const response = await axiosClient.get(`/stations/${stationId}`);
    return response.data;
  },
  update: async (stationId: number, stationData: IUpdateStation) => {
    const response = await axiosClient.patch(
      `/stations/${stationId}`,
      stationData
    );
    return response.data;
  },
  delete: async (stationId: number) => {
    const response = await axiosClient.delete(`/stations/${stationId}`);
    return response.data;
  },
};

import axiosClient from "./axios-client";

export const stationServiceApi = {
  //  login
  getByRestaurantId: async (restaurantId: number) => {
    const response = await axiosClient.get(
      `/stations/restaurant/${restaurantId}`
    );
    return response.data;
  },
  add: async (stationData: { restaurantId: number; name: string }) => {
    const response = await axiosClient.post("/stations", stationData);
    return response.data;
  },
  getById: async (stationId: number) => {
    const response = await axiosClient.get(`/stations/${stationId}`);
    return response.data;
  },
  update: async (stationId: number, stationData: { name: string }) => {
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

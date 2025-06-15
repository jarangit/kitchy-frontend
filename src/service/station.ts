import axiosClient from "./axios-client";

export const stationServiceApi = {
  //  login
  getByRestaurantId: async (restaurantId: number) => {
    const response = await axiosClient.get(`/stations/restaurant/${restaurantId}`);
    return response.data;
  },
 
};

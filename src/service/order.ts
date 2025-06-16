import axiosClient from "./axios-client";

export const orderApiService = {
  getOrdersByRestaurantId: async (restaurantId: number) => {
    return await axiosClient.get(`/orders/restaurant/${restaurantId}`);
  },
};

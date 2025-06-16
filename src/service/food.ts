import axiosClient from "./axios-client";

export const foodApiService = {
  getFoodsByRestaurantId: async (restaurantId: number) => {
    return await axiosClient.get(`/menus/restaurant/${restaurantId}`);
  },

  getFoodById: async (foodId: number) => {
    return await axiosClient.get(`/menus/${foodId}`);
  },

  createFood: async (data: any) => {
    return await axiosClient.post("/menus", data);
  },

  updateFood: async (foodId: number, data: any) => {
    return await axiosClient.put(`/menus/${foodId}`, data);
  },

  deleteFood: async (foodId: number) => {
    return await axiosClient.delete(`/menus/${foodId}`);
  },
};

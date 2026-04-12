import axiosClient from "@/shared/services/axios-client";
import type { ICreateRestaurant, IUpdateRestaurant } from "@/features/restaurant/types/restaurant.dto";

export const restaurantServiceApi = {
  //  login
  getByUserId: async (userId: number) => {
    const response = await axiosClient.get(`/restaurants/user/${userId}`);
    return response.data;
  },
  addRestaurant: async (restaurantData: ICreateRestaurant) => {
    const response = await axiosClient.post("/restaurants", restaurantData);
    return response.data;
  },
  getById: async (restaurantId: number) => {
    const response = await axiosClient.get(`/restaurants/${restaurantId}`);
    return response.data;
  },
  updateRestaurant: async (
    restaurantId: number,
    restaurantData: IUpdateRestaurant
  ) => {
    const response = await axiosClient.patch(
      `/restaurants/${restaurantId}`,
      restaurantData
    );
    return response.data;
  },
  deleteRestaurant: async (restaurantId: number) => {
    const response = await axiosClient.delete(`/restaurants/${restaurantId}`);
    return response.data;
  },
};

import axiosClient from "./axios-client";

export const restaurantServiceApi = {
  //  login
  getByUserId: async (userId: number) => {
    const response = await axiosClient.get(`/restaurants/user/${userId}`);
    return response.data;
  },
  addRestaurant: async (restaurantData: { userId: number; name: string }) => {
    const response = await axiosClient.post("/restaurants", restaurantData);
    return response.data;
  },
  getById: async (restaurantId: number) => {
    const response = await axiosClient.get(`/restaurants/${restaurantId}`);
    return response.data;
  },
  updateRestaurant: async (
    restaurantId: number,
    restaurantData: { name: string }
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

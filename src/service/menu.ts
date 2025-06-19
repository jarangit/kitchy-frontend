import axiosClient from "./axios-client";

export const menuApiService = {
  getMenusByRestaurantId: async (restaurantId: number) => {
    return await axiosClient.get(`/menus/restaurant/${restaurantId}`);
  },

  getMenuById: async (MenuId: number) => {
    return await axiosClient.get(`/menus/${MenuId}`);
  },

  createMenu: async (data: any) => {
    return await axiosClient.post("/menus", data);
  },

  updateMenu: async (MenuId: number, data: any) => {
    return await axiosClient.put(`/menus/${MenuId}`, data);
  },

  deleteMenu: async (MenuId: number) => {
    return await axiosClient.delete(`/menus/${MenuId}`);
  },
};

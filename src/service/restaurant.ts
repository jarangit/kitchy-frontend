import axiosClient from "./axios-client";

export const restaurantServiceApi = {
  //  login
  getByUserId: async (userId: number) => {
    const response = await axiosClient.get(`/restaurants/user/${userId}`);
    return response.data;
  },
 
};

import axiosClient from "./axios-client";

export const userServiceApi = {
  //  login
  login: async (email: string, password: string) => {
    const response = await axiosClient.post("/users/login", {
      email,
      password,
    });
    return response.data;
  },
};

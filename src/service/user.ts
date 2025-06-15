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
  getBydId: async (id: number) => {
    const response = await axiosClient.get("/users/" + id);
    return response.data;
  },
};

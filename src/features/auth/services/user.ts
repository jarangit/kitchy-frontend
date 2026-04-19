import axiosClient from "@/shared/services/axios-client";
import type { IRegisterRequest } from "@/features/auth/types/auth.dto";

export const userServiceApi = {
  //  login
  login: async (email: string, password: string) => {
    const response = await axiosClient.post("/users/login", {
      email,
      password,
    });
    return response.data;
  },
  register: async (payload: IRegisterRequest) => {
    const response = await axiosClient.post("/users/register", payload);
    return response.data;
  },
  googleLogin: async (idToken: string) => {
    const response = await axiosClient.post("/users/google-login", { idToken });
    return response.data;
  },
  getBydId: async (id: number) => {
    const response = await axiosClient.get("/users/" + id);
    return response.data;
  },
  getMe: async () => {
    const response = await axiosClient.get("/users/me");
    return response.data;
  }
};

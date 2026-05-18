import axiosClient from "@/shared/services/axios-client";
import type { IRegisterRequest } from "@/features/auth/types/auth.dto";
import { IS_DEMO_MODE, getAdapter } from "@/shared/services/adapters/data-adapter";

export const userServiceApi = {
  //  login
  login: async (email: string, password: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).login(email, password);
    const response = await axiosClient.post("/users/login", {
      email,
      password,
    });
    return response.data;
  },
  register: async (payload: IRegisterRequest) => {
    if (IS_DEMO_MODE) return (await getAdapter()).register(payload);
    const response = await axiosClient.post("/users/register", payload);
    return response.data;
  },
  googleLogin: async (idToken: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).login(idToken, "demo");
    const response = await axiosClient.post("/users/google-login", { idToken });
    return response.data;
  },
  getBydId: async (id: number) => {
    if (IS_DEMO_MODE) {
      const user = await (await getAdapter()).getMe();
      return { data: user };
    }
    const response = await axiosClient.get("/users/" + id);
    return response.data;
  },
  getMe: async () => {
    if (IS_DEMO_MODE) {
      const user = await (await getAdapter()).getMe();
      return { data: user };
    }
    const response = await axiosClient.get("/users/me");
    return response.data;
  }
};

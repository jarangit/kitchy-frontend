import axiosClient from "@/shared/services/axios-client";
import type {
  ICreateStore,
  ISetStorePinPayload,
  IUpdateStore,
} from "@/features/store/types/store.dto";
import {
  IS_DEMO_MODE,
  getAdapter,
} from "@/shared/services/adapters/data-adapter";

export const storeServiceApi = {
  getByUserId: async (userId: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).getStoresByUserId(userId);
    const response = await axiosClient.get(`/stores/user/${userId}`);
    return response.data;
  },
  addStore: async (storeData: ICreateStore) => {
    // Backend derives owner_id from JWT; send only name
    const payload = { name: storeData.name };
    if (IS_DEMO_MODE) return (await getAdapter()).createStore(storeData);
    const response = await axiosClient.post("/stores", payload);
    return response.data;
  },
  getById: async (storeId: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).getStoreById(storeId);
    const response = await axiosClient.get(`/stores/${storeId}`);
    return response.data;
  },
  setStorePin: async (storeId: string, payload: ISetStorePinPayload) => {
    if (IS_DEMO_MODE) {
      // Demo mode has no real PIN — simulate success and store pin in memory cache
      const { setStorePinCache } =
        await import("@/features/store/utils/store-pin-cache");
      setStorePinCache(storeId, payload.pin);
      return { data: { id: storeId } };
    }
    const response = await axiosClient.post(`/stores/${storeId}/pin`, payload);
    return response.data;
  },
  updateStore: async (storeId: string, storeData: IUpdateStore) => {
    if (IS_DEMO_MODE)
      return (await getAdapter()).updateStore(storeId, storeData);
    const response = await axiosClient.patch(`/stores/${storeId}`, storeData);
    return response.data;
  },
  deleteStore: async (storeId: string) => {
    if (IS_DEMO_MODE) return (await getAdapter()).deleteStore(storeId);
    const response = await axiosClient.delete(`/stores/${storeId}`);
    return response.data;
  },
};

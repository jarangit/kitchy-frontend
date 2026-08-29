import axiosClient from "@/shared/services/axios-client";
import {
  IS_DEMO_MODE,
  getAdapter,
} from "@/shared/services/adapters/data-adapter";
import type {
  DeviceDto,
  JoinPairingResponse,
  PairingCodeResponse,
  UpdateDeviceRequest,
} from "@/features/device/types/device.dto";
import { normalizeResponse } from "@/shared/services/normalize-response";

export const deviceServiceApi = {
  getByStoreId: async (storeId: string) => {
    if (IS_DEMO_MODE) {
      const data = await (await getAdapter()).getDevicesByStoreId(storeId);
      return { data: { success: true, message: "ok", data } };
    }
    return await axiosClient.get<DeviceDto[]>(`/devices/store/${storeId}`);
  },
  update: async (id: string, data: UpdateDeviceRequest) => {
    if (IS_DEMO_MODE) {
      const device = await (await getAdapter()).updateDevice(id, data);
      return { data: { success: true, message: "ok", data: device } };
    }
    return await axiosClient.patch<DeviceDto>(`/devices/${id}`, data);
  },
  remove: async (id: string) => {
    if (IS_DEMO_MODE) {
      await (await getAdapter()).deleteDevice(id);
      return { data: { success: true, message: "ok", data: null } };
    }
    return await axiosClient.delete<{ message: string }>(`/devices/${id}`);
  },
};

export const pairingCodeServiceApi = {
  create: async (storeId: string): Promise<PairingCodeResponse> => {
    if (IS_DEMO_MODE) {
      return await (await getAdapter()).createPairingCode(storeId);
    }
    const res = await axiosClient.post("/pairing-codes", {
      storeId,
    });
    return normalizeResponse<PairingCodeResponse>(res.data);
  },
  join: async (code: string): Promise<JoinPairingResponse> => {
    if (IS_DEMO_MODE) {
      return await (await getAdapter()).joinPairingCode(code);
    }
    const res = await axiosClient.post(`/pairing-codes/${code}/join`, {
      deviceName: "KDS Screen",
    });
    return normalizeResponse<JoinPairingResponse>(res.data);
  },
};

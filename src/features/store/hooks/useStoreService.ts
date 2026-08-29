/* eslint-disable @typescript-eslint/no-explicit-any */
import { storeServiceApi } from "@/features/store/services/store";
import type {
  ICreateStore,
  ISetStorePinPayload,
  IUpdateStore,
} from "@/features/store/types/store.dto";
import type { IStore } from "@/features/store/types/store.model";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";
import { normalizeResponse } from "@/shared/services/normalize-response";

export function useStoreService({ userId }: { userId?: string }) {
  const queryClient = useQueryClient();
  const storeId =
    useAppSelector((state) => state.currentStore.storeId) ?? undefined;

  // READ
  const storesQuery = useQuery({
    queryKey: ["stores", userId],
    queryFn: () => storeServiceApi.getByUserId(userId as string),
    enabled: !!userId,
    select: (data: unknown) => normalizeResponse<IStore[]>(data),
  });

  const storeFinOneQuery = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => storeServiceApi.getById(storeId as string),
    enabled: !!storeId,
    select: (data: unknown) => normalizeResponse<IStore>(data),
  });

  // CREATE
  const createMutation = useMutation({
    mutationFn: (data: ICreateStore) => storeServiceApi.addStore(data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stores", userId],
      }),
  });

  // UPDATE - inject PIN from in-memory cache (per-request model)
  const updateMutation = useMutation({
    mutationFn: async ({
      storeData,
    }: {
      storeData: Omit<IUpdateStore, "pin"> & Partial<Pick<IUpdateStore, "pin">>;
    }) => {
      const { getStorePin, isValidStorePin } =
        await import("@/features/store/utils/store-pin-cache");
      const cached = storeData.pin ?? getStorePin(storeId as string);
      const pin = cached?.trim() ?? "";
      if (!isValidStorePin(pin)) {
        const err = {
          response: {
            data: {
              message: {
                message: "PIN is required for this operation",
                errorCode: "STORE_PIN_REQUIRED",
              },
            },
            status: 400,
          },
        };
        throw err;
      }
      const payload: IUpdateStore = { ...storeData, pin } as IUpdateStore;
      return storeServiceApi.updateStore(storeId as string, payload);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["store", storeId],
      }),
    onError: async (error: unknown) => {
      const { clearStorePinCache } =
        await import("@/features/store/utils/store-pin-cache");
      const { toast } = await import("@/shared/services/toast-service");
      const data = (error as { response?: { data?: unknown } })?.response
        ?.data as
        | {
            message?:
              { errorCode?: string; message?: string } | string | string[];
          }
        | undefined;
      const msg = data?.message;
      const code =
        typeof msg === "object" && msg !== null && "errorCode" in msg
          ? (msg as { errorCode?: string }).errorCode
          : undefined;
      if (code === "INVALID_STORE_PIN") {
        if (storeId) clearStorePinCache(storeId);
        toast.error({ title: "PIN ไม่ถูกต้อง ลองอีกครั้ง" });
      } else if (code === "STORE_PIN_REQUIRED") {
        toast.error({ title: "ต้องตั้ง PIN ก่อนแก้ไขตั้งค่า" });
      }
    },
  });

  // SET PIN
  const setPinMutation = useMutation({
    mutationFn: async (payload: ISetStorePinPayload) => {
      const result = await storeServiceApi.setStorePin(
        storeId as string,
        payload,
      );
      const { setStorePinCache } =
        await import("@/features/store/utils/store-pin-cache");
      setStorePinCache(storeId as string, payload.pin);
      return result;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["store", storeId],
      }),
    onError: async (error: unknown) => {
      const { toast } = await import("@/shared/services/toast-service");
      const data = (error as { response?: { data?: unknown } })?.response
        ?.data as
        { message?: { errorCode?: string } | string | string[] } | undefined;
      const msg = data?.message;
      const code =
        typeof msg === "object" && msg !== null && "errorCode" in msg
          ? (msg as { errorCode?: string }).errorCode
          : undefined;
      if (code === "STORE_PIN_ALREADY_SET") {
        toast.error({ title: "ตั้ง PIN ไว้แล้ว" });
      } else if (code === "STORE_PIN_REQUIRED") {
        toast.error({ title: "ต้องตั้ง PIN ก่อน" });
      }
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: () => storeServiceApi.deleteStore(storeId as string),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["stores", userId],
      }),
  });

  const onGetErrors = (error: any) => {
    if (error?.response) {
      return error.response.data.message || error.response.statusText;
    }
  };
  return {
    stores: storesQuery.data,
    storesLoading: storesQuery.isLoading,

    storeFinOneQuery: storeFinOneQuery.data,
    storeFinOneLoading: storeFinOneQuery.isLoading,
    storeFinOneQueryError: onGetErrors(storeFinOneQuery.error),

    createStore: createMutation.mutate,
    createStoreLoading: createMutation.isPending,
    createStoreAsync: createMutation.mutateAsync,

    updateStore: updateMutation.mutate,
    updateStoreAsync: updateMutation.mutateAsync,
    updateStoreLoading: updateMutation.isPending,

    setStorePin: setPinMutation.mutate,
    setStorePinAsync: setPinMutation.mutateAsync,
    setStorePinLoading: setPinMutation.isPending,

    deleteStore: deleteMutation.mutate,
    deleteStoreLoading: deleteMutation.isPending,
  };
}

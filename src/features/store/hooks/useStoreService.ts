/* eslint-disable @typescript-eslint/no-explicit-any */
import { storeServiceApi } from "@/features/store/services/store";
import type { ICreateStore } from "@/features/store/types/store.dto";
import type { IUpdateStore } from "@/features/store/types/store.dto";
import type { IStore } from "@/features/store/types/store.model";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";
import { normalizeResponse } from "@/shared/services/normalize-response";

export function useStoreService({
  userId,
}: {
  userId?: string;
}) {
  const queryClient = useQueryClient();
  const storeId = useAppSelector((state) => state.currentStore.storeId) ?? undefined;

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

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: ({
      storeData,
    }: {
      storeData: IUpdateStore;
    }) => storeServiceApi.updateStore(storeId as string, storeData),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["store", storeId],
      }),
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

    updateStore: updateMutation.mutate,
    updateStoreLoading: updateMutation.isPending,

    deleteStore: deleteMutation.mutate,
    deleteStoreLoading: deleteMutation.isPending,
  };
}

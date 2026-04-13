/* eslint-disable @typescript-eslint/no-explicit-any */
import { storeServiceApi } from "@/features/store/services/store";
import type { ICreateStore } from "@/features/store/types/store.dto";
import type { IUpdateStore } from "@/features/store/types/store.dto";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useStoreService({
  userId,
  storeId,
}: {
  userId?: string;
  storeId?: string;
}) {
  const queryClient = useQueryClient();

  // READ
  const storesQuery = useQuery({
    queryKey: ["stores", userId],
    queryFn: () => storeServiceApi.getByUserId(userId as string),
    enabled: !!userId,
    select: (data: any) => data.data,
  });

  const storeFinOneQuery = useQuery({
    queryKey: ["store", storeId],
    queryFn: () => storeServiceApi.getById(storeId as string),
    enabled: !!storeId,
    select: (data: any) => data.data,
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
      storeId,
      storeData,
    }: {
      storeId: string;
      storeData: IUpdateStore;
    }) => storeServiceApi.updateStore(storeId, storeData),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["store", storeId],
      }),
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: (storeId: string) =>
      storeServiceApi.deleteStore(storeId),
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

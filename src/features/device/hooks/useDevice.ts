import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deviceServiceApi,
  pairingCodeServiceApi,
} from "@/features/device/services/device";
import { unwrapPayload } from "@/shared/services/unwrap-payload";
import type {
  DeviceDto,
  UpdateDeviceRequest,
} from "@/features/device/types/device.dto";

export function useDeviceService({ storeId }: { storeId?: string }) {
  const queryClient = useQueryClient();

  const devicesQuery = useQuery({
    queryKey: ["devices", storeId],
    queryFn: () => deviceServiceApi.getByStoreId(storeId as string),
    enabled: !!storeId,
    select: (data) => unwrapPayload<DeviceDto>(data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceRequest }) =>
      deviceServiceApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices", storeId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deviceServiceApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["devices", storeId] });
    },
  });

  const createPairingMutation = useMutation({
    mutationFn: () => pairingCodeServiceApi.create(storeId as string),
  });

  return {
    devices: devicesQuery.data ?? [],
    isLoading: devicesQuery.isLoading,
    isError: devicesQuery.isError,
    error: devicesQuery.error,
    updateMutation,
    deleteMutation,
    createPairingMutation,
  };
}

import { useQuery } from "@tanstack/react-query";
import { orderApiService } from "@/features/order/services/order";
import type { IPromptpayQrResult } from "@/features/pos/types/pos.dto";

export function usePromptpayQr(storeId: string | undefined, amount: number) {
  return useQuery<IPromptpayQrResult>({
    queryKey: ["promptpay-qr", storeId, amount],
    queryFn: async () => {
      const res = await orderApiService.getPromptpayQr(
        storeId as string,
        amount,
      );
      return ((res.data as { data?: unknown })?.data ??
        res.data) as IPromptpayQrResult;
    },
    enabled: Boolean(storeId) && amount > 0,
    staleTime: 30_000,
    retry: 1,
  });
}

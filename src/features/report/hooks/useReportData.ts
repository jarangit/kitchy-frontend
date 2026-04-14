import { useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/shared/hooks/hooks";
import { reportService } from "@/features/report/services/report";
import type { DateRangePreset } from "@/features/report/types/report.dto";

export function useReportData(preset: DateRangePreset, month?: string) {
  const storeId = useAppSelector((state) => state.currentStore.storeId);

  const query = useQuery({
    queryKey: ["report", storeId, preset, month],
    queryFn: () =>
      reportService.getReportData({
        storeId: storeId ?? "",
        preset,
        month,
      }),
    enabled: !!storeId,
    staleTime: 5 * 60 * 1000,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}

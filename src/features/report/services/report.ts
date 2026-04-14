import type { IReportData } from "@/features/report/types/report.model";
import type { IReportFilter } from "@/features/report/types/report.dto";
import { generateMockReportData } from "@/features/report/data/mock-report-data";

/**
 * Report service.
 *
 * Currently returns mock data.
 * When a real API is available, swap the implementation inside `getReportData`
 * without changing the public interface.
 */
export const reportService = {
  async getReportData(filter: IReportFilter): Promise<IReportData> {
    // TODO: replace with real API call
    // const { data } = await axiosClient.get<IReportData>('/reports', { params: filter });
    // return data;

    await new Promise((resolve) => setTimeout(resolve, 300));
    return generateMockReportData(filter.preset, filter.month);
  },
};

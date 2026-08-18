import type { IReportData } from "@/features/report/types/report.model";
import type { IReportFilter } from "@/features/report/types/report.dto";
import axiosClient from "@/shared/services/axios-client";
import {
  IS_DEMO_MODE,
  getAdapter,
} from "@/shared/services/adapters/data-adapter";

type ApiResponse<T> = { success: boolean; message: string; data: T };

/**
 * Report service.
 *
 * Fetches from `GET /reports` in production mode; demo mode reads from the
 * local adapter (which returns generated mock data).
 */
export const reportService = {
  async getReportData(filter: IReportFilter): Promise<IReportData> {
    if (IS_DEMO_MODE) return (await getAdapter()).getReportData(filter);

    const { data } = await axiosClient.get<ApiResponse<IReportData>>(
      "/reports",
      { params: filter },
    );
    return data.data;
  },
};

/** Predefined date range presets */
export type DateRangePreset = "today" | "week" | "month";

/** Filter parameters for fetching report data */
export interface IReportFilter {
  storeId: string;
  preset: DateRangePreset;
  month?: string;
}

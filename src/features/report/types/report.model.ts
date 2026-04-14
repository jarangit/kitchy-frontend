/** Snapshot summary — the 3 numbers the owner needs */
export interface IReportSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
}

/** Top selling product */
export interface ITopProduct {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

/** Single calendar day data (month mode) */
export interface ICalendarDay {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
  topProducts: ITopProduct[];
}

/** Complete report data returned from the service */
export interface IReportData {
  summary: IReportSummary;
  topProducts: ITopProduct[];
  /** Only present in "month" mode */
  calendarDays?: ICalendarDay[];
}

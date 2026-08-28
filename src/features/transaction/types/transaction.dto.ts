export interface ITransactionFilter {
  storeId: string;
  startDate?: string;
  endDate?: string;
  method?: string;
  search?: string;
  flowStatus?: "ALL" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  orderType?: "ALL" | "DINE_IN" | "TOGO" | "DELIVERY";
  dateRange?: "ALL" | "TODAY" | "YESTERDAY" | "LAST_7_DAYS";
}

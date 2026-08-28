export interface ITransactionFilter {
  storeId: string;
  startDate?: string;
  endDate?: string;
  method?: string;
  search?: string;
  flowStatus?: "IN_PROGRESS" | "DONE" | "CANCELLED";
  orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
}

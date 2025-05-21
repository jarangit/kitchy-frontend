export interface IReport {
  total: number;
  totalByType: TotalByType;
  totalByStatus: TotalByStatus;
  waitingInStore: number;
  archived: number;
  orderTimeMinutes: OrderTimeMinutes;
  topDineInTables: TopDineInTable[];
}

export interface OrderTimeMinutes {
  min: number;
  max: number;
  avg: number;
}

export interface TopDineInTable {
  orderNumber: string;
  count: number;
}

export interface TotalByStatus {
  PENDING: number;
  COMPLETED: number;
}

export interface TotalByType {
  TOGO: number;
  DINEIN: number;
}

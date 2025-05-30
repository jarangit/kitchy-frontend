export interface ICreateOrder {
  orderNumber: string;
  orderType: string;
  isWaitingInStore?: boolean;
}
export interface IOrderItem {
  id: number;
  orderNumber: string;
  type: string;
  status: string;
  isArchived: boolean;
  archivedAt: null;
  isWaitingInStore: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IUpdateOrder {
  id: number;
  type?: "TOGO" | "DINEIN" | "";
  status?: "PENDING" | "COMPLETED";
  orderNumber?: string;
  isWaitingInStore?: boolean;
}
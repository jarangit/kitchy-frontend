export interface ICreateOrder {
  orderNumber: string;
  orderType: string;
  isWaitingInStore?: boolean;
}

export interface IUpdateOrder {
  id: number;
  type?: "TOGO" | "DINEIN" | "";
  status?: "PENDING" | "COMPLETED";
  orderNumber?: string;
  isWaitingInStore?: boolean;
}

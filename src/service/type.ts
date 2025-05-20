export interface ICreateOrder {
  orderNumber: string;
  orderType: string;
  tableNumber?: string;
  isWaitingInStore?: boolean;
}

export interface ICreateOrder {
  orderNumber: string;
  orderType: string;
  waitingOrderNumber?: string;
  isWaitingInStore?: boolean;
}
export interface IOrderItem {
  orderNumber: string;
  orderType: string;
  waitingOrderNumber?: string;
  isWaitingInStore?: boolean;
}

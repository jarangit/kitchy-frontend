export interface ITransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  storeId: string;
  status?: string;
  type?: string;
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  method: string;
  amount: number;
  totalAmount?: number;
  receiptId: string;
  items: ITransactionItem[];
  products?: ITransactionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ITransactionItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

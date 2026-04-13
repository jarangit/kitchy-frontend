export interface ITransaction {
  id: number;
  orderId: number;
  orderNumber: string;
  storeId: number;
  method: string;
  amount: number;
  receiptId: string;
  items: ITransactionItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ITransactionItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

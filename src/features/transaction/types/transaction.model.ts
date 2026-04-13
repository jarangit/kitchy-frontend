export interface ITransaction {
  id: string;
  orderId: string;
  orderNumber: string;
  storeId: string;
  method: string;
  amount: number;
  receiptId: string;
  items: ITransactionItem[];
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

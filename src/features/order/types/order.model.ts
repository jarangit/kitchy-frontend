export interface IOrderItem {
  id: number;
  orderNumber: string;
  previousOrderNumber?: string | null;
  type: string;
  status: string;
  isArchived: boolean;
  archivedAt: null;
  isWaitingInStore: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface OrderFormData {
  name: string;
}

/**
 * Matches the backend OrderStationItem entity with relations:
 * ['orderItem', 'orderItem.product', 'orderItem.order']
 *
 * Response from: GET /order-station-item/station/:stationId
 */
export interface IOrderStationItemDto {
  id: string;
  status: "pending" | "complete";
  orderItem: {
    id: string;
    quantity: number;
    notes: string | null;
    product: {
      id: string;
      name: string;
    };
    order: {
      id: string;
      orderNumber: string;
      status: string;
      orderType?: "DINE_IN" | "TOGO" | "DELIVERY";
      tableNumber?: string;
      customerName?: string;
      deliveryPlatform?: string;
      createdAt: string;
    };
  };
}

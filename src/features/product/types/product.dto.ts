export interface ICreateMenu {
  name: string;
  stationId?: number;
  restaurantId: number;
}

export interface IUpdateMenu {
  name?: string;
  stationId?: number;
}

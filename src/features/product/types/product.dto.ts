export interface ICreateMenu {
  name: string;
  stationId?: number;
  storeId: number;
}

export interface IUpdateMenu {
  name?: string;
  stationId?: number;
}

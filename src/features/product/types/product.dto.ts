export interface ICreateMenu {
  name: string;
  stationId?: string;
  storeId: string;
}

export interface IUpdateMenu {
  name?: string;
  stationId?: string;
}

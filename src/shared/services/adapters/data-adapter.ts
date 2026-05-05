/**
 * DataAdapter — unified interface for all data operations.
 * In production: delegates to real API via axios.
 * In demo mode: uses localStorage for full offline CRUD.
 */

import type { IUser } from "@/features/auth/types/auth.model";
import type { IRegisterRequest } from "@/features/auth/types/auth.dto";
import type { IStore } from "@/features/store/types/store.model";
import type { ICreateStore, IUpdateStore } from "@/features/store/types/store.dto";
import type { IStation } from "@/features/station/types/station.model";
import type { ICreateStation, IUpdateStation } from "@/features/station/types/station.dto";
import type { IMenu } from "@/features/product/types/product.model";
import type { CreateProductRequest, UpdateProductRequest } from "@/features/product/types/product.dto";
import type { CategoryModel } from "@/features/category/types/category.model";
import type { CreateCategoryRequestDto, UpdateCategoryRequestDto } from "@/features/category/types/category.dto";
import type { IOrderItem } from "@/features/order/types/order.model";
import type { OrderType } from "@/features/order/types/order.dto";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";
import type { ITransaction } from "@/features/transaction/types/transaction.model";
import type { ITransactionFilter } from "@/features/transaction/types/transaction.dto";
import type { IReportData } from "@/features/report/types/report.model";
import type { IReportFilter } from "@/features/report/types/report.dto";

export interface DataAdapter {
  // Auth
  login(email: string, password: string): Promise<{ data: { access_token: string } }>;
  register(payload: IRegisterRequest): Promise<{ data: { access_token: string } }>;
  getMe(): Promise<IUser>;

  // Store
  getStoresByUserId(userId: string): Promise<IStore[]>;
  getStoreById(id: string): Promise<IStore>;
  createStore(dto: ICreateStore): Promise<IStore>;
  updateStore(id: string, dto: IUpdateStore): Promise<IStore>;
  deleteStore(id: string): Promise<void>;

  // Station
  getStationsByStoreId(storeId: string): Promise<IStation[]>;
  getStationById(id: string): Promise<IStation>;
  createStation(dto: ICreateStation): Promise<IStation>;
  updateStation(id: string, dto: IUpdateStation): Promise<IStation>;
  deleteStation(id: string): Promise<void>;

  // Product
  getProductsByStoreId(storeId: string): Promise<IMenu[]>;
  getProductById(id: string): Promise<IMenu>;
  getProductsByCategoryId(categoryId: string): Promise<IMenu[]>;
  createProduct(dto: CreateProductRequest): Promise<IMenu>;
  updateProduct(id: string, dto: UpdateProductRequest): Promise<IMenu>;
  deleteProduct(id: string): Promise<void>;

  // Category
  getCategoriesByStoreId(storeId: string): Promise<CategoryModel[]>;
  createCategory(dto: CreateCategoryRequestDto): Promise<CategoryModel>;
  updateCategory(id: string, dto: UpdateCategoryRequestDto): Promise<CategoryModel>;
  deleteCategory(id: string): Promise<void>;

  // Order
  getOrdersByStoreId(storeId: string): Promise<IOrderItem[]>;
  getOrdersByStationId(stationId: string): Promise<IOrderItem[]>;
  getOrderById(id: string): Promise<IOrderItem>;
  createOrder(
    storeId: string,
    orderNumber: string,
    products: { productId: string; quantity: number; note?: string }[],
    orderType: OrderType,
    tableNumber?: string,
    customerName?: string,
    deliveryPlatform?: string,
    deliveryOrderNumber?: string,
  ): Promise<IOrderItem>;
  updateOrder(id: string, data: Record<string, unknown>): Promise<IOrderItem>;
  deleteOrder(id: string): Promise<void>;

  // KDS
  getOrderStationItemsByStationId(stationId: string): Promise<IOrderStationItemDto[]>;
  updateOrderStationItem(
    id: string,
    data: { status: "pending" | "complete" | "served"; stationId: string; orderItemId: string },
  ): Promise<void>;

  // Transaction
  getTransactionsByStoreId(filter: ITransactionFilter): Promise<ITransaction[]>;
  getTransactionById(id: string): Promise<ITransaction>;
  updateTransaction(id: string, payload: unknown): Promise<ITransaction>;

  // Report
  getReportData(filter: IReportFilter): Promise<IReportData>;
}

export const IS_DEMO_MODE = import.meta.env.VITE_DEMO_MODE === "true";

let _adapter: DataAdapter | null = null;

export async function getAdapter(): Promise<DataAdapter> {
  if (_adapter) return _adapter;

  if (IS_DEMO_MODE) {
    const { localAdapter } = await import("./local.adapter");
    _adapter = localAdapter;
  } else {
    const { apiAdapter } = await import("./api.adapter");
    _adapter = apiAdapter;
  }

  return _adapter;
}

/**
 * API adapter — wraps real axios-based services to conform to DataAdapter interface.
 * Used in production mode (VITE_DEMO_MODE !== "true").
 */

import type { DataAdapter } from "./data-adapter";
import type { IRegisterRequest } from "@/features/auth/types/auth.dto";
import type { ICreateStore, IUpdateStore } from "@/features/store/types/store.dto";
import type { ICreateStation, IUpdateStation } from "@/features/station/types/station.dto";
import type { CreateProductRequest, UpdateProductRequest } from "@/features/product/types/product.dto";
import type { CreateCategoryRequestDto, UpdateCategoryRequestDto } from "@/features/category/types/category.dto";
import type { OrderType } from "@/features/order/types/order.dto";
import type { ITransactionFilter } from "@/features/transaction/types/transaction.dto";
import type { IReportFilter } from "@/features/report/types/report.dto";

import { userServiceApi } from "@/features/auth/services/user";
import { storeServiceApi } from "@/features/store/services/store";
import { stationServiceApi } from "@/features/station/services/station";
import { productApiService } from "@/features/product/services/product";
import { categoryServiceApi } from "@/features/category/services/category";
import { orderApiService } from "@/features/order/services/order";
import { transactionServiceApi } from "@/features/transaction/services/transaction";
import { reportService } from "@/features/report/services/report";
import { unwrapPayload } from "@/shared/services/unwrap-payload";

export const apiAdapter: DataAdapter = {
  // ═══ Auth ═══
  async login(email, password) {
    return userServiceApi.login(email, password);
  },
  async register(payload: IRegisterRequest) {
    return userServiceApi.register(payload);
  },
  async getMe() {
    return userServiceApi.getMe();
  },

  // ═══ Store ═══
  async getStoresByUserId(userId) {
    return storeServiceApi.getByUserId(userId);
  },
  async getStoreById(id) {
    return storeServiceApi.getById(id);
  },
  async createStore(dto: ICreateStore) {
    return storeServiceApi.addStore(dto);
  },
  async updateStore(id, dto: IUpdateStore) {
    return storeServiceApi.updateStore(id, dto);
  },
  async deleteStore(id) {
    return storeServiceApi.deleteStore(id);
  },

  // ═══ Station ═══
  async getStationsByStoreId(storeId) {
    return stationServiceApi.getByStoreId(storeId);
  },
  async getStationById(id) {
    return stationServiceApi.getById(id);
  },
  async createStation(dto: ICreateStation) {
    return stationServiceApi.add(dto);
  },
  async updateStation(id, dto: IUpdateStation) {
    return stationServiceApi.update(id, dto);
  },
  async deleteStation(id) {
    return stationServiceApi.delete(id);
  },

  // ═══ Product ═══
  async getProductsByStoreId(storeId) {
    const res = await productApiService.getProductsByStoreId(storeId);
    return unwrapPayload(res);
  },
  async getProductById(id) {
    const res = await productApiService.getProductById(id);
    const data = res.data?.data;
    if (typeof data === "string") throw new Error(data);
    return data;
  },
  async getProductsByCategoryId(categoryId) {
    const res = await productApiService.getProductsByCategoryId(categoryId);
    return unwrapPayload(res);
  },
  async createProduct(dto: CreateProductRequest) {
    const res = await productApiService.createProduct(dto);
    return res.data.data;
  },
  async updateProduct(id, dto: UpdateProductRequest) {
    const res = await productApiService.updateProduct(id, dto);
    return res.data.data;
  },
  async deleteProduct(id) {
    await productApiService.deleteProduct(id);
  },

  // ═══ Category ═══
  async getCategoriesByStoreId(storeId) {
    const res = await categoryServiceApi.getByStoreId(storeId);
    return unwrapPayload(res);
  },
  async createCategory(dto: CreateCategoryRequestDto) {
    const res = await categoryServiceApi.create(dto);
    return res.data.data as unknown as import("@/features/category/types/category.model").CategoryModel;
  },
  async updateCategory(id, dto: UpdateCategoryRequestDto) {
    const res = await categoryServiceApi.update(id, dto);
    return res.data.data as unknown as import("@/features/category/types/category.model").CategoryModel;
  },
  async deleteCategory(id) {
    await categoryServiceApi.delete(id);
  },

  // ═══ Order ═══
  async getOrdersByStoreId(storeId) {
    const res = await orderApiService.getOrdersByStoreId(storeId);
    return unwrapPayload(res);
  },
  async getOrdersByStationId(stationId) {
    const res = await orderApiService.getOrdersByStationId(stationId);
    return unwrapPayload(res);
  },
  async getOrderById(id) {
    const res = await orderApiService.getById(id);
    return unwrapPayload(res);
  },
  async createOrder(storeId, orderNumber, products, orderType: OrderType, tableNumber?, customerName?, deliveryPlatform?, deliveryOrderNumber?) {
    const res = await orderApiService.add(storeId, orderNumber, products, orderType, tableNumber, customerName, deliveryPlatform, deliveryOrderNumber);
    return res.data;
  },
  async updateOrder(id, data) {
    const res = await orderApiService.update(id, data);
    return res.data;
  },
  async deleteOrder(id) {
    await orderApiService.delete(id);
  },

  // ═══ KDS ═══
  async getOrderStationItemsByStationId(stationId) {
    const res = await orderApiService.getOrderStationItemsByStationId(stationId);
    return unwrapPayload(res);
  },
  async updateOrderStationItem(id, data) {
    await orderApiService.updateOrderStationItem(id, data);
  },

  // ═══ Transaction ═══
  async getTransactionsByStoreId(filter: ITransactionFilter) {
    return transactionServiceApi.getByStoreId(filter.storeId);
  },
  async getTransactionById(id) {
    return transactionServiceApi.getById(id);
  },
  async updateTransaction(id, payload) {
    return transactionServiceApi.update(id, payload);
  },

  // ═══ Report ═══
  async getReportData(filter: IReportFilter) {
    return reportService.getReportData(filter);
  },
};

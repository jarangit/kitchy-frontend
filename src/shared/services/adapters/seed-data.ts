/**
 * Demo seed data — Thai restaurant fixtures.
 * Auto-loaded when localStorage is empty in demo mode.
 */

import type { IUser } from "@/features/auth/types/auth.model";
import type { IStore } from "@/features/store/types/store.model";
import type { IStation } from "@/features/station/types/station.model";
import type { IMenu } from "@/features/product/types/product.model";
import type { CategoryModel } from "@/features/category/types/category.model";
import type { IOrderItem } from "@/features/order/types/order.model";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";
import type { ITransaction } from "@/features/transaction/types/transaction.model";

const now = new Date().toISOString();
const hourAgo = new Date(Date.now() - 3600_000).toISOString();
const twoHoursAgo = new Date(Date.now() - 7200_000).toISOString();

// ─── User ──────────────────────────────────────────────────
export const seedUser: IUser = {
  id: 1,
  email: "demo@kitchy.app",
  name: "Demo User",
};

// ─── Store ─────────────────────────────────────────────────
export const seedStore: IStore = {
  id: "store-001",
  name: "ร้านกิจจี้ Demo",
  userId: "1",
  createdAt: twoHoursAgo,
  updatedAt: now,
};

// ─── Stations ──────────────────────────────────────────────
export const seedStations: IStation[] = [
  { id: "station-001", name: "ครัวร้อน", color: "#ef4444", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "station-002", name: "เครื่องดื่ม", color: "#3b82f6", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
];

// ─── Categories ────────────────────────────────────────────
export const seedCategories: CategoryModel[] = [
  { id: "cat-001", name: "อาหารจานเดียว", isActive: true, sortOrder: 1, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-002", name: "เครื่องดื่ม", isActive: true, sortOrder: 2, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-003", name: "ของหวาน", isActive: true, sortOrder: 3, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-004", name: "อาหารทานเล่น", isActive: true, sortOrder: 4, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-005", name: "เมนูย่าง", isActive: true, sortOrder: 5, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-006", name: "ซุปและแกง", isActive: true, sortOrder: 6, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-007", name: "สลัดและสุขภาพ", isActive: true, sortOrder: 7, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-008", name: "เมนูพิเศษ", isActive: true, sortOrder: 8, createdAt: twoHoursAgo, updatedAt: now },
];

// ─── Products ──────────────────────────────────────────────
export const seedProducts: IMenu[] = [
  { id: "prod-001", name: "ข้าวผัดกระเพรา", isActive: true, isBestSeller: true, price: 65, cost: 25, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-002", name: "ข้าวมันไก่", isActive: true, isBestSeller: true, price: 60, cost: 22, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-003", name: "ผัดไทย", isActive: true, price: 70, cost: 28, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-004", name: "ต้มยำกุ้ง", isActive: true, price: 120, cost: 50, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-005", name: "ส้มตำ", isActive: true, price: 55, cost: 18, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-006", name: "ชาเย็น", isActive: true, isBestSeller: true, price: 45, cost: 12, categoryId: "cat-002", categoryName: "เครื่องดื่ม", stationId: "station-002", stationName: "เครื่องดื่ม", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-007", name: "กาแฟเย็น", isActive: true, price: 50, cost: 15, categoryId: "cat-002", categoryName: "เครื่องดื่ม", stationId: "station-002", stationName: "เครื่องดื่ม", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-008", name: "น้ำมะนาว", isActive: true, price: 35, cost: 8, categoryId: "cat-002", categoryName: "เครื่องดื่ม", stationId: "station-002", stationName: "เครื่องดื่ม", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-009", name: "ข้าวเหนียวมะม่วง", isActive: true, price: 80, cost: 35, categoryId: "cat-003", categoryName: "ของหวาน", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-010", name: "ไอศกรีมกะทิ", isActive: true, price: 45, cost: 15, categoryId: "cat-003", categoryName: "ของหวาน", stationId: "station-002", stationName: "เครื่องดื่ม", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-011", name: "ปอเปี๊ยะทอด", isActive: true, price: 65, cost: 24, categoryId: "cat-004", categoryName: "อาหารทานเล่น", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-012", name: "ไก่ทอดสมุนไพร", isActive: true, isBestSeller: true, price: 95, cost: 38, categoryId: "cat-004", categoryName: "อาหารทานเล่น", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-013", name: "เฟรนช์ฟรายส์", isActive: true, price: 59, cost: 20, categoryId: "cat-004", categoryName: "อาหารทานเล่น", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-014", name: "คอหมูย่าง", isActive: true, isBestSeller: true, price: 120, cost: 48, categoryId: "cat-005", categoryName: "เมนูย่าง", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-015", name: "ไก่ย่างน้ำจิ้มแจ่ว", isActive: true, price: 110, cost: 45, categoryId: "cat-005", categoryName: "เมนูย่าง", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-016", name: "ปลาหมึกย่าง", isActive: true, price: 135, cost: 60, categoryId: "cat-005", categoryName: "เมนูย่าง", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-017", name: "แกงเขียวหวานไก่", isActive: true, price: 95, cost: 36, categoryId: "cat-006", categoryName: "ซุปและแกง", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-018", name: "ต้มข่าไก่", isActive: true, price: 110, cost: 42, categoryId: "cat-006", categoryName: "ซุปและแกง", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-019", name: "แกงจืดเต้าหู้หมูสับ", isActive: true, price: 85, cost: 30, categoryId: "cat-006", categoryName: "ซุปและแกง", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-020", name: "สลัดอกไก่ย่าง", isActive: true, price: 99, cost: 40, categoryId: "cat-007", categoryName: "สลัดและสุขภาพ", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-021", name: "สลัดทูน่า", isActive: true, price: 109, cost: 44, categoryId: "cat-007", categoryName: "สลัดและสุขภาพ", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-022", name: "โยเกิร์ตผลไม้", isActive: true, price: 69, cost: 24, categoryId: "cat-007", categoryName: "สลัดและสุขภาพ", stationId: "station-002", stationName: "เครื่องดื่ม", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-023", name: "ชามะนาวโซดา", isActive: true, isBestSeller: true, price: 55, cost: 16, categoryId: "cat-008", categoryName: "เมนูพิเศษ", stationId: "station-002", stationName: "เครื่องดื่ม", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-024", name: "โกโก้ลาวา", isActive: true, price: 65, cost: 22, categoryId: "cat-008", categoryName: "เมนูพิเศษ", stationId: "station-002", stationName: "เครื่องดื่ม", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-025", name: "ข้าวหน้าหมูย่างซอสเกาหลี", isActive: true, price: 129, cost: 52, categoryId: "cat-008", categoryName: "เมนูพิเศษ", stationId: "station-001", stationName: "ครัวร้อน", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
];

// ─── Orders ────────────────────────────────────────────────
export const seedOrders: IOrderItem[] = [
  { id: "order-001", orderNumber: "001", type: "DINE_IN", status: "COMPLETED", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: twoHoursAgo, updatedAt: hourAgo },
  { id: "order-002", orderNumber: "002", type: "TOGO", status: "COMPLETED", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: hourAgo, updatedAt: hourAgo },
  { id: "order-003", orderNumber: "003", type: "DINE_IN", status: "PREPARING", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: hourAgo, updatedAt: now },
  { id: "order-004", orderNumber: "004", type: "DELIVERY", status: "PENDING", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: now, updatedAt: now },
  { id: "order-005", orderNumber: "005", type: "TOGO", status: "READY", isArchived: false, archivedAt: null, isWaitingInStore: true, createdAt: now, updatedAt: now },
];

// ─── Order-Station Items (KDS) ─────────────────────────────
export const seedOrderStationItems: IOrderStationItemDto[] = [
  {
    id: "osi-001",
    status: "complete",
    orderItem: {
      id: "oi-001", quantity: 2, notes: null,
      product: { id: "prod-001", name: "ข้าวผัดกระเพรา" },
      order: { id: "order-003", orderNumber: "003", status: "PREPARING", orderType: "DINE_IN", tableNumber: "3", createdAt: hourAgo },
    },
  },
  {
    id: "osi-002",
    status: "pending",
    orderItem: {
      id: "oi-002", quantity: 1, notes: "ไม่ใส่ผัก",
      product: { id: "prod-003", name: "ผัดไทย" },
      order: { id: "order-003", orderNumber: "003", status: "PREPARING", orderType: "DINE_IN", tableNumber: "3", createdAt: hourAgo },
    },
  },
  {
    id: "osi-003",
    status: "pending",
    orderItem: {
      id: "oi-003", quantity: 1, notes: null,
      product: { id: "prod-006", name: "ชาเย็น" },
      order: { id: "order-004", orderNumber: "004", status: "PENDING", orderType: "DELIVERY", deliveryPlatform: "Grab", deliveryOrderNumber: "GR-1234", createdAt: now },
    },
  },
  {
    id: "osi-004",
    status: "complete",
    orderItem: {
      id: "oi-004", quantity: 1, notes: null,
      product: { id: "prod-002", name: "ข้าวมันไก่" },
      order: { id: "order-005", orderNumber: "005", status: "READY", orderType: "TOGO", createdAt: now },
    },
  },
];

// ─── Transactions ──────────────────────────────────────────
export const seedTransactions: ITransaction[] = [
  {
    id: "txn-001", orderId: "order-001", orderNumber: "001", storeId: "store-001",
    method: "CASH", amount: 195, receiptId: "RCP-001",
    items: [
      { productId: "prod-001", name: "ข้าวผัดกระเพรา", price: 65, quantity: 2, total: 130 },
      { productId: "prod-006", name: "ชาเย็น", price: 45, quantity: 1, total: 45 },
      { productId: "prod-008", name: "น้ำมะนาว", price: 35, quantity: 1, total: 35 },
    ],
    createdAt: twoHoursAgo, updatedAt: twoHoursAgo,
  },
  {
    id: "txn-002", orderId: "order-002", orderNumber: "002", storeId: "store-001",
    method: "QR", amount: 130, receiptId: "RCP-002",
    items: [
      { productId: "prod-002", name: "ข้าวมันไก่", price: 60, quantity: 1, total: 60 },
      { productId: "prod-003", name: "ผัดไทย", price: 70, quantity: 1, total: 70 },
    ],
    createdAt: hourAgo, updatedAt: hourAgo,
  },
  {
    id: "txn-003", orderId: "order-001", orderNumber: "001", storeId: "store-001",
    method: "CASH", amount: 80, receiptId: "RCP-003",
    items: [
      { productId: "prod-009", name: "ข้าวเหนียวมะม่วง", price: 80, quantity: 1, total: 80 },
    ],
    createdAt: hourAgo, updatedAt: hourAgo,
  },
];

// ─── Extra metadata for orders (stored separately) ─────────
export interface DemoOrderMeta {
  id: string;
  storeId: string;
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  products: { productId: string; quantity: number; note?: string }[];
}

export const seedOrderMeta: DemoOrderMeta[] = [
  { id: "order-001", storeId: "store-001", tableNumber: "1", products: [{ productId: "prod-001", quantity: 2 }, { productId: "prod-006", quantity: 1 }, { productId: "prod-008", quantity: 1 }] },
  { id: "order-002", storeId: "store-001", products: [{ productId: "prod-002", quantity: 1 }, { productId: "prod-003", quantity: 1 }] },
  { id: "order-003", storeId: "store-001", tableNumber: "3", products: [{ productId: "prod-001", quantity: 2 }, { productId: "prod-003", quantity: 1 }] },
  { id: "order-004", storeId: "store-001", deliveryPlatform: "Grab", deliveryOrderNumber: "GR-1234", products: [{ productId: "prod-006", quantity: 1 }] },
  { id: "order-005", storeId: "store-001", products: [{ productId: "prod-002", quantity: 1 }] },
];

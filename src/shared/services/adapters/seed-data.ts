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

export const DEMO_SEED_VERSION = "2026-06-pos-demo-v2";

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
  { id: "station-001", name: "ครัวหลัก", color: "#ef4444", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
];

// ─── Categories ────────────────────────────────────────────
export const seedCategories: CategoryModel[] = [
  { id: "cat-001", name: "อาหารจานเดียว", isActive: true, sortOrder: 1, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-002", name: "เมนูเส้น", isActive: true, sortOrder: 2, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-003", name: "ของกินเล่น", isActive: true, sortOrder: 3, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-004", name: "ต้ม/แกง", isActive: true, sortOrder: 4, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-005", name: "ย่าง/ทอด", isActive: true, sortOrder: 5, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-006", name: "เครื่องดื่มชา/กาแฟ", isActive: true, sortOrder: 6, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-007", name: "เครื่องดื่มสดชื่น", isActive: true, sortOrder: 7, createdAt: twoHoursAgo, updatedAt: now },
  { id: "cat-008", name: "ของหวาน/เมนูพิเศษ", isActive: true, sortOrder: 8, createdAt: twoHoursAgo, updatedAt: now },
];

// ─── Products ──────────────────────────────────────────────
export const seedProducts: IMenu[] = [
  { id: "prod-001", name: "ข้าวกะเพราหมูสับ", isActive: true, isBestSeller: true, price: 69, cost: 25, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-002", name: "ข้าวกะเพราไก่กรอบ", isActive: true, isBestSeller: true, price: 79, cost: 30, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-003", name: "ข้าวผัดหมู", isActive: true, price: 72, cost: 28, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-004", name: "ข้าวผัดกุ้ง", isActive: true, price: 89, cost: 35, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-005", name: "ข้าวคะน้าหมูกรอบ", isActive: true, price: 85, cost: 32, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-006", name: "ข้าวกระเทียมหมู", isActive: true, price: 75, cost: 27, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-007", name: "ข้าวไข่ข้นกุ้ง", isActive: true, price: 99, cost: 40, categoryId: "cat-001", categoryName: "อาหารจานเดียว", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-008", name: "ผัดไทยกุ้งสด", isActive: true, isBestSeller: true, price: 89, cost: 34, categoryId: "cat-002", categoryName: "เมนูเส้น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-009", name: "ราดหน้าหมู", isActive: true, price: 75, cost: 29, categoryId: "cat-002", categoryName: "เมนูเส้น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-010", name: "ผัดซีอิ๊วไก่", isActive: true, price: 75, cost: 28, categoryId: "cat-002", categoryName: "เมนูเส้น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-011", name: "ก๋วยเตี๋ยวคั่วไก่", isActive: true, price: 82, cost: 31, categoryId: "cat-002", categoryName: "เมนูเส้น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-012", name: "สุกี้แห้งทะเล", isActive: true, price: 95, cost: 38, categoryId: "cat-002", categoryName: "เมนูเส้น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-013", name: "ปอเปี๊ยะทอด", isActive: true, price: 69, cost: 24, categoryId: "cat-003", categoryName: "ของกินเล่น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-014", name: "นักเก็ตไก่", isActive: true, price: 79, cost: 28, categoryId: "cat-003", categoryName: "ของกินเล่น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-015", name: "เฟรนช์ฟรายส์", isActive: true, price: 59, cost: 20, categoryId: "cat-003", categoryName: "ของกินเล่น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-016", name: "หมูสะเต๊ะ", isActive: true, price: 95, cost: 38, categoryId: "cat-003", categoryName: "ของกินเล่น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-017", name: "ต้มยำกุ้ง", isActive: true, isBestSeller: true, price: 129, cost: 52, categoryId: "cat-004", categoryName: "ต้ม/แกง", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-018", name: "ต้มข่าไก่", isActive: true, price: 115, cost: 45, categoryId: "cat-004", categoryName: "ต้ม/แกง", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-019", name: "แกงเขียวหวานไก่", isActive: true, price: 99, cost: 37, categoryId: "cat-004", categoryName: "ต้ม/แกง", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-020", name: "แกงจืดเต้าหู้หมูสับ", isActive: true, price: 89, cost: 31, categoryId: "cat-004", categoryName: "ต้ม/แกง", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-021", name: "คอหมูย่าง", isActive: true, isBestSeller: true, price: 129, cost: 49, categoryId: "cat-005", categoryName: "ย่าง/ทอด", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-022", name: "ไก่ย่างน้ำจิ้มแจ่ว", isActive: true, price: 119, cost: 46, categoryId: "cat-005", categoryName: "ย่าง/ทอด", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-023", name: "ปีกไก่ทอดน้ำปลา", isActive: true, price: 109, cost: 40, categoryId: "cat-005", categoryName: "ย่าง/ทอด", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-024", name: "หมูแดดเดียว", isActive: true, price: 105, cost: 41, categoryId: "cat-005", categoryName: "ย่าง/ทอด", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-025", name: "ชาเย็น", isActive: true, isBestSeller: true, price: 45, cost: 12, categoryId: "cat-006", categoryName: "เครื่องดื่มชา/กาแฟ", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-026", name: "ชาเขียวนม", isActive: true, price: 50, cost: 14, categoryId: "cat-006", categoryName: "เครื่องดื่มชา/กาแฟ", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-027", name: "กาแฟเย็น", isActive: true, price: 55, cost: 18, categoryId: "cat-006", categoryName: "เครื่องดื่มชา/กาแฟ", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-028", name: "โกโก้เย็น", isActive: true, price: 59, cost: 20, categoryId: "cat-006", categoryName: "เครื่องดื่มชา/กาแฟ", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-029", name: "น้ำมะนาว", isActive: true, price: 39, cost: 10, categoryId: "cat-007", categoryName: "เครื่องดื่มสดชื่น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-030", name: "ชามะนาว", isActive: true, price: 45, cost: 13, categoryId: "cat-007", categoryName: "เครื่องดื่มสดชื่น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-031", name: "อัญชันมะนาวโซดา", isActive: true, price: 49, cost: 16, categoryId: "cat-007", categoryName: "เครื่องดื่มสดชื่น", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-032", name: "ข้าวเหนียวมะม่วง", isActive: true, isBestSeller: true, price: 89, cost: 36, categoryId: "cat-008", categoryName: "ของหวาน/เมนูพิเศษ", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-033", name: "ไอศกรีมกะทิ", isActive: true, price: 49, cost: 17, categoryId: "cat-008", categoryName: "ของหวาน/เมนูพิเศษ", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
  { id: "prod-034", name: "โทสต์เนยนม", isActive: true, price: 79, cost: 29, categoryId: "cat-008", categoryName: "ของหวาน/เมนูพิเศษ", stationId: "station-001", stationName: "ครัวหลัก", storeId: "store-001", createdAt: twoHoursAgo, updatedAt: now },
];

// ─── Orders ────────────────────────────────────────────────
export const seedOrders: IOrderItem[] = [
  { id: "order-001", orderNumber: "001", type: "DINE_IN", status: "COMPLETED", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: twoHoursAgo, updatedAt: hourAgo },
  { id: "order-002", orderNumber: "002", type: "TOGO", status: "COMPLETED", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: hourAgo, updatedAt: hourAgo },
  { id: "order-003", orderNumber: "003", type: "DINE_IN", status: "PREPARING", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: hourAgo, updatedAt: now },
  { id: "order-004", orderNumber: "004", type: "DELIVERY", status: "PENDING", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: now, updatedAt: now },
  { id: "order-005", orderNumber: "005", type: "TOGO", status: "READY", isArchived: false, archivedAt: null, isWaitingInStore: true, createdAt: now, updatedAt: now },
  { id: "order-006", orderNumber: "006", type: "DELIVERY", status: "PREPARING", isArchived: false, archivedAt: null, isWaitingInStore: false, createdAt: hourAgo, updatedAt: now },
];

// ─── Order-Station Items (KDS) ─────────────────────────────
export const seedOrderStationItems: IOrderStationItemDto[] = [
  {
    id: "osi-001",
    status: "complete",
    orderItem: {
      id: "oi-001", quantity: 2, notes: null,
      product: { id: "prod-001", name: "ข้าวกะเพราหมูสับ" },
      order: { id: "order-003", orderNumber: "003", status: "PREPARING", orderType: "DINE_IN", tableNumber: "3", createdAt: hourAgo },
    },
  },
  {
    id: "osi-002",
    status: "pending",
    orderItem: {
      id: "oi-002", quantity: 1, notes: "ไม่ใส่ผัก",
      product: { id: "prod-008", name: "ผัดไทยกุ้งสด" },
      order: { id: "order-003", orderNumber: "003", status: "PREPARING", orderType: "DINE_IN", tableNumber: "3", createdAt: hourAgo },
    },
  },
  {
    id: "osi-003",
    status: "pending",
    orderItem: {
      id: "oi-003", quantity: 1, notes: null,
      product: { id: "prod-025", name: "ชาเย็น" },
      order: { id: "order-004", orderNumber: "004", status: "PENDING", orderType: "DELIVERY", deliveryPlatform: "GrabFood", deliveryOrderNumber: "GF-2048", createdAt: now },
    },
  },
  {
    id: "osi-004",
    status: "complete",
    orderItem: {
      id: "oi-004", quantity: 1, notes: null,
      product: { id: "prod-006", name: "ข้าวกระเทียมหมู" },
      order: { id: "order-005", orderNumber: "005", status: "READY", orderType: "TOGO", createdAt: now },
    },
  },
  {
    id: "osi-005",
    status: "pending",
    orderItem: {
      id: "oi-005", quantity: 1, notes: "ไม่ใส่น้ําแข็ง",
      product: { id: "prod-029", name: "น้ำมะนาว" },
      order: { id: "order-006", orderNumber: "006", status: "PREPARING", orderType: "DELIVERY", deliveryPlatform: "LINE MAN", deliveryOrderNumber: "LM-3321", createdAt: hourAgo },
    },
  },
];

// ─── Transactions ──────────────────────────────────────────
export const seedTransactions: ITransaction[] = [
  {
    id: "txn-001", orderId: "order-001", orderNumber: "001", storeId: "store-001",
    method: "CASH", amount: 272, receiptId: "RCP-001",
    items: [
      { productId: "prod-001", name: "ข้าวกะเพราหมูสับ", price: 69, quantity: 2, total: 138 },
      { productId: "prod-025", name: "ชาเย็น", price: 45, quantity: 1, total: 45 },
      { productId: "prod-032", name: "ข้าวเหนียวมะม่วง", price: 89, quantity: 1, total: 89 },
    ],
    createdAt: twoHoursAgo, updatedAt: twoHoursAgo,
  },
  {
    id: "txn-002", orderId: "order-002", orderNumber: "002", storeId: "store-001",
    method: "QR", amount: 173, receiptId: "RCP-002",
    items: [
      { productId: "prod-006", name: "ข้าวกระเทียมหมู", price: 75, quantity: 1, total: 75 },
      { productId: "prod-015", name: "เฟรนช์ฟรายส์", price: 59, quantity: 1, total: 59 },
      { productId: "prod-029", name: "น้ำมะนาว", price: 39, quantity: 1, total: 39 },
    ],
    createdAt: hourAgo, updatedAt: hourAgo,
  },
  {
    id: "txn-003", orderId: "order-006", orderNumber: "006", storeId: "store-001",
    method: "QR", amount: 178, receiptId: "RCP-003",
    items: [
      { productId: "prod-021", name: "คอหมูย่าง", price: 129, quantity: 1, total: 129 },
      { productId: "prod-029", name: "น้ำมะนาว", price: 49, quantity: 1, total: 49 },
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
  { id: "order-001", storeId: "store-001", tableNumber: "1", products: [{ productId: "prod-001", quantity: 2 }, { productId: "prod-025", quantity: 1 }, { productId: "prod-032", quantity: 1 }] },
  { id: "order-002", storeId: "store-001", products: [{ productId: "prod-006", quantity: 1 }, { productId: "prod-015", quantity: 1 }, { productId: "prod-029", quantity: 1 }] },
  { id: "order-003", storeId: "store-001", tableNumber: "3", products: [{ productId: "prod-001", quantity: 2 }, { productId: "prod-008", quantity: 1, note: "ไม่ใส่ผัก" }] },
  { id: "order-004", storeId: "store-001", deliveryPlatform: "GrabFood", deliveryOrderNumber: "GF-2048", products: [{ productId: "prod-025", quantity: 1 }] },
  { id: "order-005", storeId: "store-001", products: [{ productId: "prod-006", quantity: 1 }] },
  { id: "order-006", storeId: "store-001", deliveryPlatform: "LINE MAN", deliveryOrderNumber: "LM-3321", products: [{ productId: "prod-021", quantity: 1 }, { productId: "prod-029", quantity: 1, note: "ไม่ใส่น้ําแข็ง" }] },
];

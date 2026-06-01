/**
 * Demo seed data grouped by store preset.
 * Auto-loaded when localStorage is empty in demo mode.
 */

import type { IUser } from "@/features/auth/types/auth.model";
import type { CategoryModel } from "@/features/category/types/category.model";
import type { IOrderStationItemDto } from "@/features/kds/types/kds.dto";
import type { IOrderItem } from "@/features/order/types/order.model";
import type { OrderType } from "@/features/pos/types/pos.model";
import type { IMenu } from "@/features/product/types/product.model";
import type { IStation } from "@/features/station/types/station.model";
import type { IStore } from "@/features/store/types/store.model";
import type { ITransaction } from "@/features/transaction/types/transaction.model";

const now = new Date().toISOString();
const hourAgo = new Date(Date.now() - 3600_000).toISOString();
const twoHoursAgo = new Date(Date.now() - 7200_000).toISOString();

export const DEMO_SEED_VERSION = "2026-06-pos-demo-v4";
export const DEMO_STORE_PRESET_STORAGE_KEY = "demo:store-preset";
export const DEMO_STORE_ID = "store-001";
export const DEMO_STORE_NAME = "ร้านกิจจี้ Demo";
export const DEMO_STATION_ID = "station-001";
export const DEMO_STATION_NAME = "ครัวหลัก";

export type DemoStorePreset = "CAFE" | "FAST_FOOD" | "MADE_TO_ORDER";

export interface DemoOrderMeta {
  id: string;
  storeId: string;
  tableNumber?: string;
  customerName?: string;
  deliveryPlatform?: string;
  deliveryOrderNumber?: string;
  products: { productId: string; quantity: number; note?: string }[];
}

export interface DemoSeedBundle {
  user: IUser;
  store: IStore;
  stations: IStation[];
  categories: CategoryModel[];
  products: IMenu[];
  orders: IOrderItem[];
  orderStationItems: IOrderStationItemDto[];
  transactions: ITransaction[];
  orderMeta: DemoOrderMeta[];
}

const baseSeedUser: IUser = {
  id: 1,
  email: "demo@kitchy.app",
  name: "Demo User",
};

const baseSeedStations: IStation[] = [
  {
    id: DEMO_STATION_ID,
    name: DEMO_STATION_NAME,
    color: "#ef4444",
    storeId: DEMO_STORE_ID,
    createdAt: twoHoursAgo,
    updatedAt: now,
  },
];

const STORE_NAMES: Record<DemoStorePreset, string> = {
  CAFE: "Kitchy Demo - คาเฟ่",
  FAST_FOOD: "Kitchy Demo - ฟาสต์ฟู้ด",
  MADE_TO_ORDER: "Kitchy Demo - อาหารตามสั่ง",
};

const createSeedStore = (preset: DemoStorePreset): IStore => ({
  id: DEMO_STORE_ID,
  name: STORE_NAMES[preset],
  userId: "1",
  createdAt: twoHoursAgo,
  updatedAt: now,
});

const createMenu = (
  id: string,
  name: string,
  price: number,
  cost: number,
  categoryId: string,
  categoryName: string,
  isBestSeller = false,
): IMenu => ({
  id,
  name,
  isActive: true,
  isBestSeller,
  price,
  cost,
  categoryId,
  categoryName,
  stationId: DEMO_STATION_ID,
  stationName: DEMO_STATION_NAME,
  storeId: DEMO_STORE_ID,
  createdAt: twoHoursAgo,
  updatedAt: now,
});

const createOrder = (
  id: string,
  orderNumber: string,
  type: OrderType,
  status: IOrderItem["status"],
  createdAt: string,
  updatedAt: string,
  isWaitingInStore = false,
): IOrderItem => ({
  id,
  orderNumber,
  type,
  status,
  isArchived: false,
  archivedAt: null,
  isWaitingInStore,
  createdAt,
  updatedAt,
});

const createTransaction = (
  id: string,
  orderId: string,
  orderNumber: string,
  method: ITransaction["method"],
  items: ITransaction["items"],
  createdAt: string,
): ITransaction => ({
  id,
  orderId,
  orderNumber,
  storeId: DEMO_STORE_ID,
  method,
  amount: items.reduce((sum, item) => sum + item.total, 0),
  receiptId: id.toUpperCase(),
  items,
  createdAt,
  updatedAt: createdAt,
});

function createCafeBundle(): DemoSeedBundle {
  const categories: CategoryModel[] = [
    { id: "cat-001", name: "กาแฟ", isActive: true, sortOrder: 1, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-002", name: "ชา/มัทฉะ", isActive: true, sortOrder: 2, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-003", name: "เบเกอรี", isActive: true, sortOrder: 3, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-004", name: "บรันช์", isActive: true, sortOrder: 4, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-005", name: "เค้ก/ของหวาน", isActive: true, sortOrder: 5, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-006", name: "โซดา/ผลไม้", isActive: true, sortOrder: 6, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-007", name: "ซิกเนเจอร์", isActive: true, sortOrder: 7, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-008", name: "เมล็ดกาแฟ/ของฝาก", isActive: true, sortOrder: 8, createdAt: twoHoursAgo, updatedAt: now },
  ];

  const products: IMenu[] = [
    createMenu("prod-001", "อเมริกาโน่เย็น", 70, 18, "cat-001", "กาแฟ", true),
    createMenu("prod-002", "ลาเต้เย็น", 85, 25, "cat-001", "กาแฟ", true),
    createMenu("prod-003", "คาปูชิโน่เย็น", 85, 25, "cat-001", "กาแฟ"),
    createMenu("prod-004", "เอสเพรสโซ่ส้ม", 95, 29, "cat-001", "กาแฟ"),
    createMenu("prod-005", "มัทฉะลาเต้", 95, 32, "cat-002", "ชา/มัทฉะ", true),
    createMenu("prod-006", "ชาไทยนมสด", 75, 20, "cat-002", "ชา/มัทฉะ"),
    createMenu("prod-007", "พีชอู่หลง", 80, 22, "cat-002", "ชา/มัทฉะ"),
    createMenu("prod-008", "ครัวซองต์เนยสด", 75, 28, "cat-003", "เบเกอรี", true),
    createMenu("prod-009", "ครอฟเฟิลน้ำผึ้ง", 95, 34, "cat-003", "เบเกอรี"),
    createMenu("prod-010", "มัฟฟินช็อกโกแลต", 65, 24, "cat-003", "เบเกอรี"),
    createMenu("prod-011", "แซนด์วิชแฮมชีส", 129, 48, "cat-004", "บรันช์", true),
    createMenu("prod-012", "โทสต์อะโวคาโด", 159, 58, "cat-004", "บรันช์"),
    createMenu("prod-013", "พาสต้าเพสโต้ไก่", 189, 70, "cat-004", "บรันช์"),
    createMenu("prod-014", "ชีสเค้กหน้าไหม้", 115, 42, "cat-005", "เค้ก/ของหวาน", true),
    createMenu("prod-015", "เค้กแครอท", 110, 40, "cat-005", "เค้ก/ของหวาน"),
    createMenu("prod-016", "บราวนี่วอลนัต", 85, 31, "cat-005", "เค้ก/ของหวาน"),
    createMenu("prod-017", "ยูซุโซดา", 79, 19, "cat-006", "โซดา/ผลไม้"),
    createMenu("prod-018", "สตรอว์เบอร์รีโซดา", 79, 19, "cat-006", "โซดา/ผลไม้"),
    createMenu("prod-019", "Cold Brew Tonic", 105, 31, "cat-007", "ซิกเนเจอร์", true),
    createMenu("prod-020", "Dirty Coffee", 115, 35, "cat-007", "ซิกเนเจอร์"),
    createMenu("prod-021", "House Blend 250g", 320, 140, "cat-008", "เมล็ดกาแฟ/ของฝาก"),
    createMenu("prod-022", "Drip Bag Set", 180, 75, "cat-008", "เมล็ดกาแฟ/ของฝาก"),
  ];

  const orders = [
    createOrder("order-001", "301", "DINE_IN", "COMPLETED", twoHoursAgo, hourAgo),
    createOrder("order-002", "302", "TOGO", "COMPLETED", hourAgo, hourAgo, true),
    createOrder("order-003", "303", "DINE_IN", "PREPARING", hourAgo, now),
    createOrder("order-004", "304", "DELIVERY", "PENDING", now, now),
    createOrder("order-005", "305", "TOGO", "READY", now, now, true),
  ];

  const orderMeta: DemoOrderMeta[] = [
    { id: "order-001", storeId: DEMO_STORE_ID, tableNumber: "A2", products: [{ productId: "prod-002", quantity: 1 }, { productId: "prod-014", quantity: 1 }] },
    { id: "order-002", storeId: DEMO_STORE_ID, customerName: "Mint", products: [{ productId: "prod-011", quantity: 1 }, { productId: "prod-017", quantity: 1 }] },
    { id: "order-003", storeId: DEMO_STORE_ID, tableNumber: "B1", products: [{ productId: "prod-019", quantity: 1 }, { productId: "prod-008", quantity: 2 }] },
    { id: "order-004", storeId: DEMO_STORE_ID, deliveryPlatform: "GrabFood", deliveryOrderNumber: "GF-CF-304", products: [{ productId: "prod-013", quantity: 1 }, { productId: "prod-018", quantity: 1, note: "หวานน้อย" }] },
    { id: "order-005", storeId: DEMO_STORE_ID, products: [{ productId: "prod-020", quantity: 1 }] },
  ];

  const orderStationItems: IOrderStationItemDto[] = [
    {
      id: "osi-001",
      status: "complete",
      orderItem: {
        id: "oi-001",
        quantity: 1,
        notes: null,
        product: { id: "prod-002", name: "ลาเต้เย็น" },
        order: { id: "order-001", orderNumber: "301", status: "COMPLETED", orderType: "DINE_IN", tableNumber: "A2", createdAt: twoHoursAgo },
      },
    },
    {
      id: "osi-002",
      status: "pending",
      orderItem: {
        id: "oi-002",
        quantity: 2,
        notes: null,
        product: { id: "prod-008", name: "ครัวซองต์เนยสด" },
        order: { id: "order-003", orderNumber: "303", status: "PREPARING", orderType: "DINE_IN", tableNumber: "B1", createdAt: hourAgo },
      },
    },
    {
      id: "osi-003",
      status: "pending",
      orderItem: {
        id: "oi-003",
        quantity: 1,
        notes: "หวานน้อย",
        product: { id: "prod-018", name: "สตรอว์เบอร์รีโซดา" },
        order: { id: "order-004", orderNumber: "304", status: "PENDING", orderType: "DELIVERY", deliveryPlatform: "GrabFood", deliveryOrderNumber: "GF-CF-304", createdAt: now },
      },
    },
  ];

  const transactions = [
    createTransaction("txn-301", "order-001", "301", "CASH", [
      { productId: "prod-002", name: "ลาเต้เย็น", price: 85, quantity: 1, total: 85 },
      { productId: "prod-014", name: "ชีสเค้กหน้าไหม้", price: 115, quantity: 1, total: 115 },
    ], twoHoursAgo),
    createTransaction("txn-302", "order-002", "302", "QR", [
      { productId: "prod-011", name: "แซนด์วิชแฮมชีส", price: 129, quantity: 1, total: 129 },
      { productId: "prod-017", name: "ยูซุโซดา", price: 79, quantity: 1, total: 79 },
    ], hourAgo),
  ];

  return {
    user: baseSeedUser,
    store: createSeedStore("CAFE"),
    stations: baseSeedStations,
    categories,
    products,
    orders,
    orderStationItems,
    transactions,
    orderMeta,
  };
}

function createFastFoodBundle(): DemoSeedBundle {
  const categories: CategoryModel[] = [
    { id: "cat-001", name: "เบอร์เกอร์", isActive: true, sortOrder: 1, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-002", name: "ไก่ทอด", isActive: true, sortOrder: 2, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-003", name: "ของทานเล่น", isActive: true, sortOrder: 3, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-004", name: "คอมโบเซ็ต", isActive: true, sortOrder: 4, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-005", name: "แรป/ฮอตด็อก", isActive: true, sortOrder: 5, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-006", name: "น้ำอัดลม", isActive: true, sortOrder: 6, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-007", name: "ของหวาน", isActive: true, sortOrder: 7, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-008", name: "เมนูเช้า", isActive: true, sortOrder: 8, createdAt: twoHoursAgo, updatedAt: now },
  ];

  const products: IMenu[] = [
    createMenu("prod-001", "Classic Beef Burger", 129, 46, "cat-001", "เบอร์เกอร์", true),
    createMenu("prod-002", "Double Cheese Burger", 169, 62, "cat-001", "เบอร์เกอร์", true),
    createMenu("prod-003", "Spicy Chicken Burger", 139, 50, "cat-001", "เบอร์เกอร์"),
    createMenu("prod-004", "Fish Burger", 145, 54, "cat-001", "เบอร์เกอร์"),
    createMenu("prod-005", "ไก่ทอด 2 ชิ้น", 119, 41, "cat-002", "ไก่ทอด", true),
    createMenu("prod-006", "ไก่ทอด 4 ชิ้น", 219, 82, "cat-002", "ไก่ทอด"),
    createMenu("prod-007", "ไก่ป๊อป", 89, 30, "cat-002", "ไก่ทอด"),
    createMenu("prod-008", "เฟรนช์ฟรายส์", 69, 23, "cat-003", "ของทานเล่น", true),
    createMenu("prod-009", "นักเก็ตไก่ 6 ชิ้น", 99, 34, "cat-003", "ของทานเล่น"),
    createMenu("prod-010", "หอมทอด", 79, 27, "cat-003", "ของทานเล่น"),
    createMenu("prod-011", "Burger Combo", 189, 68, "cat-004", "คอมโบเซ็ต", true),
    createMenu("prod-012", "Chicken Combo", 209, 76, "cat-004", "คอมโบเซ็ต"),
    createMenu("prod-013", "Family Bucket", 399, 155, "cat-004", "คอมโบเซ็ต"),
    createMenu("prod-014", "Chicken Wrap", 125, 46, "cat-005", "แรป/ฮอตด็อก"),
    createMenu("prod-015", "Hotdog Cheese", 105, 37, "cat-005", "แรป/ฮอตด็อก"),
    createMenu("prod-016", "Cola", 39, 9, "cat-006", "น้ำอัดลม", true),
    createMenu("prod-017", "Orange Soda", 39, 9, "cat-006", "น้ำอัดลม"),
    createMenu("prod-018", "Lemon Tea", 45, 11, "cat-006", "น้ำอัดลม"),
    createMenu("prod-019", "ซันเดช็อกโกแลต", 59, 19, "cat-007", "ของหวาน"),
    createMenu("prod-020", "พายแอปเปิล", 49, 17, "cat-007", "ของหวาน"),
    createMenu("prod-021", "Breakfast Muffin", 99, 33, "cat-008", "เมนูเช้า"),
    createMenu("prod-022", "Hash Brown", 45, 14, "cat-008", "เมนูเช้า"),
  ];

  const orders = [
    createOrder("order-001", "401", "TOGO", "COMPLETED", twoHoursAgo, hourAgo, true),
    createOrder("order-002", "402", "TOGO", "READY", hourAgo, hourAgo, true),
    createOrder("order-003", "403", "DELIVERY", "PREPARING", hourAgo, now),
    createOrder("order-004", "404", "TOGO", "PENDING", now, now, true),
    createOrder("order-005", "405", "DINE_IN", "COMPLETED", now, now),
  ];

  const orderMeta: DemoOrderMeta[] = [
    { id: "order-001", storeId: DEMO_STORE_ID, products: [{ productId: "prod-011", quantity: 1 }] },
    { id: "order-002", storeId: DEMO_STORE_ID, products: [{ productId: "prod-013", quantity: 1 }] },
    { id: "order-003", storeId: DEMO_STORE_ID, deliveryPlatform: "LINE MAN", deliveryOrderNumber: "LM-FF-403", products: [{ productId: "prod-003", quantity: 1 }, { productId: "prod-008", quantity: 1 }] },
    { id: "order-004", storeId: DEMO_STORE_ID, products: [{ productId: "prod-014", quantity: 1 }, { productId: "prod-016", quantity: 1 }] },
    { id: "order-005", storeId: DEMO_STORE_ID, tableNumber: "C4", products: [{ productId: "prod-002", quantity: 1 }, { productId: "prod-010", quantity: 1 }] },
  ];

  const orderStationItems: IOrderStationItemDto[] = [
    {
      id: "osi-001",
      status: "complete",
      orderItem: {
        id: "oi-001",
        quantity: 1,
        notes: null,
        product: { id: "prod-013", name: "Family Bucket" },
        order: { id: "order-002", orderNumber: "402", status: "READY", orderType: "TOGO", createdAt: hourAgo },
      },
    },
    {
      id: "osi-002",
      status: "pending",
      orderItem: {
        id: "oi-002",
        quantity: 1,
        notes: null,
        product: { id: "prod-003", name: "Spicy Chicken Burger" },
        order: { id: "order-003", orderNumber: "403", status: "PREPARING", orderType: "DELIVERY", deliveryPlatform: "LINE MAN", deliveryOrderNumber: "LM-FF-403", createdAt: hourAgo },
      },
    },
    {
      id: "osi-003",
      status: "pending",
      orderItem: {
        id: "oi-003",
        quantity: 1,
        notes: null,
        product: { id: "prod-014", name: "Chicken Wrap" },
        order: { id: "order-004", orderNumber: "404", status: "PENDING", orderType: "TOGO", createdAt: now },
      },
    },
  ];

  const transactions = [
    createTransaction("txn-401", "order-001", "401", "CASH", [
      { productId: "prod-011", name: "Burger Combo", price: 189, quantity: 1, total: 189 },
    ], twoHoursAgo),
    createTransaction("txn-405", "order-005", "405", "QR", [
      { productId: "prod-002", name: "Double Cheese Burger", price: 169, quantity: 1, total: 169 },
      { productId: "prod-010", name: "หอมทอด", price: 79, quantity: 1, total: 79 },
    ], now),
  ];

  return {
    user: baseSeedUser,
    store: createSeedStore("FAST_FOOD"),
    stations: baseSeedStations,
    categories,
    products,
    orders,
    orderStationItems,
    transactions,
    orderMeta,
  };
}

function createMadeToOrderBundle(): DemoSeedBundle {
  const categories: CategoryModel[] = [
    { id: "cat-001", name: "อาหารจานเดียว", isActive: true, sortOrder: 1, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-002", name: "เมนูเส้น", isActive: true, sortOrder: 2, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-003", name: "ของกินเล่น", isActive: true, sortOrder: 3, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-004", name: "ต้ม/แกง", isActive: true, sortOrder: 4, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-005", name: "ย่าง/ทอด", isActive: true, sortOrder: 5, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-006", name: "เครื่องดื่มชา/กาแฟ", isActive: true, sortOrder: 6, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-007", name: "เครื่องดื่มสดชื่น", isActive: true, sortOrder: 7, createdAt: twoHoursAgo, updatedAt: now },
    { id: "cat-008", name: "ของหวาน/เมนูพิเศษ", isActive: true, sortOrder: 8, createdAt: twoHoursAgo, updatedAt: now },
  ];

  const products: IMenu[] = [
    createMenu("prod-001", "ข้าวกะเพราหมูสับ", 69, 25, "cat-001", "อาหารจานเดียว", true),
    createMenu("prod-002", "ข้าวกะเพราไก่กรอบ", 79, 30, "cat-001", "อาหารจานเดียว", true),
    createMenu("prod-003", "ข้าวผัดหมู", 72, 28, "cat-001", "อาหารจานเดียว"),
    createMenu("prod-004", "ข้าวผัดกุ้ง", 89, 35, "cat-001", "อาหารจานเดียว"),
    createMenu("prod-005", "ข้าวคะน้าหมูกรอบ", 85, 32, "cat-001", "อาหารจานเดียว"),
    createMenu("prod-006", "ข้าวกระเทียมหมู", 75, 27, "cat-001", "อาหารจานเดียว"),
    createMenu("prod-007", "ข้าวไข่ข้นกุ้ง", 99, 40, "cat-001", "อาหารจานเดียว"),
    createMenu("prod-008", "ผัดไทยกุ้งสด", 89, 34, "cat-002", "เมนูเส้น", true),
    createMenu("prod-009", "ราดหน้าหมู", 75, 29, "cat-002", "เมนูเส้น"),
    createMenu("prod-010", "ผัดซีอิ๊วไก่", 75, 28, "cat-002", "เมนูเส้น"),
    createMenu("prod-011", "ก๋วยเตี๋ยวคั่วไก่", 82, 31, "cat-002", "เมนูเส้น"),
    createMenu("prod-012", "สุกี้แห้งทะเล", 95, 38, "cat-002", "เมนูเส้น"),
    createMenu("prod-013", "ปอเปี๊ยะทอด", 69, 24, "cat-003", "ของกินเล่น"),
    createMenu("prod-014", "นักเก็ตไก่", 79, 28, "cat-003", "ของกินเล่น"),
    createMenu("prod-015", "เฟรนช์ฟรายส์", 59, 20, "cat-003", "ของกินเล่น"),
    createMenu("prod-016", "หมูสะเต๊ะ", 95, 38, "cat-003", "ของกินเล่น"),
    createMenu("prod-017", "ต้มยำกุ้ง", 129, 52, "cat-004", "ต้ม/แกง", true),
    createMenu("prod-018", "ต้มข่าไก่", 115, 45, "cat-004", "ต้ม/แกง"),
    createMenu("prod-019", "แกงเขียวหวานไก่", 99, 37, "cat-004", "ต้ม/แกง"),
    createMenu("prod-020", "แกงจืดเต้าหู้หมูสับ", 89, 31, "cat-004", "ต้ม/แกง"),
    createMenu("prod-021", "คอหมูย่าง", 129, 49, "cat-005", "ย่าง/ทอด", true),
    createMenu("prod-022", "ไก่ย่างน้ำจิ้มแจ่ว", 119, 46, "cat-005", "ย่าง/ทอด"),
    createMenu("prod-023", "ปีกไก่ทอดน้ำปลา", 109, 40, "cat-005", "ย่าง/ทอด"),
    createMenu("prod-024", "หมูแดดเดียว", 105, 41, "cat-005", "ย่าง/ทอด"),
    createMenu("prod-025", "ชาเย็น", 45, 12, "cat-006", "เครื่องดื่มชา/กาแฟ", true),
    createMenu("prod-026", "ชาเขียวนม", 50, 14, "cat-006", "เครื่องดื่มชา/กาแฟ"),
    createMenu("prod-027", "กาแฟเย็น", 55, 18, "cat-006", "เครื่องดื่มชา/กาแฟ"),
    createMenu("prod-028", "โกโก้เย็น", 59, 20, "cat-006", "เครื่องดื่มชา/กาแฟ"),
    createMenu("prod-029", "น้ำมะนาว", 39, 10, "cat-007", "เครื่องดื่มสดชื่น"),
    createMenu("prod-030", "ชามะนาว", 45, 13, "cat-007", "เครื่องดื่มสดชื่น"),
    createMenu("prod-031", "อัญชันมะนาวโซดา", 49, 16, "cat-007", "เครื่องดื่มสดชื่น"),
    createMenu("prod-032", "ข้าวเหนียวมะม่วง", 89, 36, "cat-008", "ของหวาน/เมนูพิเศษ", true),
    createMenu("prod-033", "ไอศกรีมกะทิ", 49, 17, "cat-008", "ของหวาน/เมนูพิเศษ"),
    createMenu("prod-034", "โทสต์เนยนม", 79, 29, "cat-008", "ของหวาน/เมนูพิเศษ"),
  ];

  const orders = [
    createOrder("order-001", "001", "DINE_IN", "COMPLETED", twoHoursAgo, hourAgo),
    createOrder("order-002", "002", "TOGO", "COMPLETED", hourAgo, hourAgo),
    createOrder("order-003", "003", "DINE_IN", "PREPARING", hourAgo, now),
    createOrder("order-004", "004", "DELIVERY", "PENDING", now, now),
    createOrder("order-005", "005", "TOGO", "READY", now, now, true),
    createOrder("order-006", "006", "DELIVERY", "PREPARING", hourAgo, now),
  ];

  const orderMeta: DemoOrderMeta[] = [
    { id: "order-001", storeId: DEMO_STORE_ID, tableNumber: "1", products: [{ productId: "prod-001", quantity: 2 }, { productId: "prod-025", quantity: 1 }, { productId: "prod-032", quantity: 1 }] },
    { id: "order-002", storeId: DEMO_STORE_ID, products: [{ productId: "prod-006", quantity: 1 }, { productId: "prod-015", quantity: 1 }, { productId: "prod-029", quantity: 1 }] },
    { id: "order-003", storeId: DEMO_STORE_ID, tableNumber: "3", products: [{ productId: "prod-001", quantity: 2 }, { productId: "prod-008", quantity: 1, note: "ไม่ใส่ผัก" }] },
    { id: "order-004", storeId: DEMO_STORE_ID, deliveryPlatform: "GrabFood", deliveryOrderNumber: "GF-2048", products: [{ productId: "prod-025", quantity: 1 }] },
    { id: "order-005", storeId: DEMO_STORE_ID, products: [{ productId: "prod-006", quantity: 1 }] },
    { id: "order-006", storeId: DEMO_STORE_ID, deliveryPlatform: "LINE MAN", deliveryOrderNumber: "LM-3321", products: [{ productId: "prod-021", quantity: 1 }, { productId: "prod-029", quantity: 1, note: "ไม่ใส่น้ําแข็ง" }] },
  ];

  const orderStationItems: IOrderStationItemDto[] = [
    {
      id: "osi-001",
      status: "complete",
      orderItem: {
        id: "oi-001",
        quantity: 2,
        notes: null,
        product: { id: "prod-001", name: "ข้าวกะเพราหมูสับ" },
        order: { id: "order-003", orderNumber: "003", status: "PREPARING", orderType: "DINE_IN", tableNumber: "3", createdAt: hourAgo },
      },
    },
    {
      id: "osi-002",
      status: "pending",
      orderItem: {
        id: "oi-002",
        quantity: 1,
        notes: "ไม่ใส่ผัก",
        product: { id: "prod-008", name: "ผัดไทยกุ้งสด" },
        order: { id: "order-003", orderNumber: "003", status: "PREPARING", orderType: "DINE_IN", tableNumber: "3", createdAt: hourAgo },
      },
    },
    {
      id: "osi-003",
      status: "pending",
      orderItem: {
        id: "oi-003",
        quantity: 1,
        notes: null,
        product: { id: "prod-025", name: "ชาเย็น" },
        order: { id: "order-004", orderNumber: "004", status: "PENDING", orderType: "DELIVERY", deliveryPlatform: "GrabFood", deliveryOrderNumber: "GF-2048", createdAt: now },
      },
    },
    {
      id: "osi-004",
      status: "complete",
      orderItem: {
        id: "oi-004",
        quantity: 1,
        notes: null,
        product: { id: "prod-006", name: "ข้าวกระเทียมหมู" },
        order: { id: "order-005", orderNumber: "005", status: "READY", orderType: "TOGO", createdAt: now },
      },
    },
    {
      id: "osi-005",
      status: "pending",
      orderItem: {
        id: "oi-005",
        quantity: 1,
        notes: "ไม่ใส่น้ําแข็ง",
        product: { id: "prod-029", name: "น้ำมะนาว" },
        order: { id: "order-006", orderNumber: "006", status: "PREPARING", orderType: "DELIVERY", deliveryPlatform: "LINE MAN", deliveryOrderNumber: "LM-3321", createdAt: hourAgo },
      },
    },
  ];

  const transactions = [
    createTransaction("txn-001", "order-001", "001", "CASH", [
      { productId: "prod-001", name: "ข้าวกะเพราหมูสับ", price: 69, quantity: 2, total: 138 },
      { productId: "prod-025", name: "ชาเย็น", price: 45, quantity: 1, total: 45 },
      { productId: "prod-032", name: "ข้าวเหนียวมะม่วง", price: 89, quantity: 1, total: 89 },
    ], twoHoursAgo),
    createTransaction("txn-002", "order-002", "002", "QR", [
      { productId: "prod-006", name: "ข้าวกระเทียมหมู", price: 75, quantity: 1, total: 75 },
      { productId: "prod-015", name: "เฟรนช์ฟรายส์", price: 59, quantity: 1, total: 59 },
      { productId: "prod-029", name: "น้ำมะนาว", price: 39, quantity: 1, total: 39 },
    ], hourAgo),
    createTransaction("txn-003", "order-006", "006", "QR", [
      { productId: "prod-021", name: "คอหมูย่าง", price: 129, quantity: 1, total: 129 },
      { productId: "prod-031", name: "อัญชันมะนาวโซดา", price: 49, quantity: 1, total: 49 },
    ], hourAgo),
  ];

  return {
    user: baseSeedUser,
    store: createSeedStore("MADE_TO_ORDER"),
    stations: baseSeedStations,
    categories,
    products,
    orders,
    orderStationItems,
    transactions,
    orderMeta,
  };
}

export const demoSeedPresets: Record<DemoStorePreset, DemoSeedBundle> = {
  CAFE: createCafeBundle(),
  FAST_FOOD: createFastFoodBundle(),
  MADE_TO_ORDER: createMadeToOrderBundle(),
};

export const getDemoSeedBundle = (preset: DemoStorePreset): DemoSeedBundle =>
  demoSeedPresets[preset] ?? demoSeedPresets.MADE_TO_ORDER;

export const getDemoStoreName = (preset: DemoStorePreset): string =>
  STORE_NAMES[preset] ?? STORE_NAMES.MADE_TO_ORDER;

const defaultBundle = getDemoSeedBundle("MADE_TO_ORDER");

export const seedUser = defaultBundle.user;
export const seedStore = defaultBundle.store;
export const seedStations = defaultBundle.stations;
export const seedCategories = defaultBundle.categories;
export const seedProducts = defaultBundle.products;
export const seedOrders = defaultBundle.orders;
export const seedOrderStationItems = defaultBundle.orderStationItems;
export const seedTransactions = defaultBundle.transactions;
export const seedOrderMeta = defaultBundle.orderMeta;

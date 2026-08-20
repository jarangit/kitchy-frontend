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
import {
  DEFAULT_STORE_SETTINGS,
  type IStore,
} from "@/features/store/types/store.model";
import type { ITransaction } from "@/features/transaction/types/transaction.model";

const now = new Date().toISOString();
const hourAgo = new Date(Date.now() - 3600_000).toISOString();
const twoHoursAgo = new Date(Date.now() - 7200_000).toISOString();

export const DEMO_SEED_VERSION = "2026-08-demo-images-v7";
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
  orderLimit: 20,
  settings: DEFAULT_STORE_SETTINGS,
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
  imageUrl?: string,
): IMenu => ({
  id,
  name,
  isActive: true,
  isBestSeller,
  price,
  cost,
  imageUrl,
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
    {
      id: "cat-001",
      name: "กาแฟ",
      isActive: true,
      sortOrder: 1,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-002",
      name: "นอนคอฟฟี่",
      isActive: true,
      sortOrder: 2,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-003",
      name: "เบเกอรี",
      isActive: true,
      sortOrder: 3,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-004",
      name: "เค้ก / ของหวาน",
      isActive: true,
      sortOrder: 4,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-005",
      name: "เครื่องดื่มผลไม้",
      isActive: true,
      sortOrder: 5,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-006",
      name: "ซิกเนเจอร์",
      isActive: true,
      sortOrder: 6,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
  ];

  const products: IMenu[] = [
    createMenu(
      "prod-001",
      "เอสเปรสโซ่ร้อน",
      65,
      18,
      "cat-001",
      "กาแฟ",
      true,
      "/images/cafe/mehmet-talha-onuk-MBeY2m00Ybc-unsplash.jpg",
    ),
    createMenu(
      "prod-002",
      "ลาเต้ร้อน",
      85,
      28,
      "cat-001",
      "กาแฟ",
      true,
      "/images/cafe/katya-azimova-_AeS7M_P03o-unsplash.jpg",
    ),
    createMenu(
      "prod-003",
      "คาปูชิโน่ร้อน",
      90,
      30,
      "cat-001",
      "กาแฟ",
      false,
      "/images/cafe/jonas-jacobsson-RFHFV7lVQBY-unsplash.jpg",
    ),
    createMenu(
      "prod-004",
      "มัทฉะลาเต้เย็น",
      105,
      36,
      "cat-002",
      "นอนคอฟฟี่",
      true,
      "/images/cafe/gaia-co-VKWjhlgFFwc-unsplash.jpg",
    ),
    createMenu(
      "prod-005",
      "มัทฉะมะพร้าวเย็น",
      115,
      40,
      "cat-002",
      "นอนคอฟฟี่",
      false,
      "/images/cafe/victor-rutka-4FujjkcI40g-unsplash.jpg",
    ),
    createMenu(
      "prod-006",
      "โอรีโอ้ช็อกโก้เฟรปเป้",
      129,
      46,
      "cat-002",
      "นอนคอฟฟี่",
      true,
      "/images/cafe/nataliya-melnychuk-Li2zmWtG8Ns-unsplash.jpg",
    ),
    createMenu(
      "prod-007",
      "ครัวซองต์เนยสด",
      79,
      26,
      "cat-003",
      "เบเกอรี",
      true,
      "/images/cafe/olga-petnyunene-VgsizSk7py0-unsplash.jpg",
    ),
    createMenu(
      "prod-008",
      "ครัวซองต์สตรอว์เบอร์รี",
      95,
      33,
      "cat-003",
      "เบเกอรี",
      false,
      "/images/cafe/olena-bohovyk-ld4DOEligUw-unsplash.jpg",
    ),
    createMenu(
      "prod-009",
      "อัลมอนด์ครัวซองต์",
      105,
      37,
      "cat-003",
      "เบเกอรี",
      true,
      "/images/cafe/tkhao-khoang-AidLjZx4rs4-unsplash.jpg",
    ),
    createMenu(
      "prod-010",
      "โดนัทเคลือบน้ำตาล",
      69,
      22,
      "cat-003",
      "เบเกอรี",
      false,
      "/images/cafe/heather-ford-POM4KxWZcG8-unsplash.jpg",
    ),
    createMenu(
      "prod-011",
      "เค้กมอคค่าเลเยอร์",
      135,
      49,
      "cat-004",
      "เค้ก / ของหวาน",
      true,
      "/images/cafe/anthony-espinosa-6iqpLKqeaE0-unsplash.jpg",
    ),
    createMenu(
      "prod-012",
      "ช็อกโกแลตชีสเค้ก",
      145,
      54,
      "cat-004",
      "เค้ก / ของหวาน",
      false,
      "/images/cafe/allen-rad-JBIK4QZOFfc-unsplash.jpg",
    ),
    createMenu(
      "prod-013",
      "เค้กเบอร์รีโยเกิร์ต",
      139,
      51,
      "cat-004",
      "เค้ก / ของหวาน",
      false,
      "/images/cafe/diliara-garifullina-I48gnI1Qs5o-unsplash.jpg",
    ),
    createMenu(
      "prod-014",
      "ส้มโทนิคเย็น",
      95,
      26,
      "cat-005",
      "เครื่องดื่มผลไม้",
      true,
      "/images/cafe/abhishek-hajare-JWfcm1stQuo-unsplash.jpg",
    ),
    createMenu(
      "prod-015",
      "พิงก์สตรอว์เบอร์รีฟิซ",
      109,
      34,
      "cat-006",
      "ซิกเนเจอร์",
      true,
      "/images/cafe/great-cocktails-9PyQwwmZxpI-unsplash.jpg",
    ),
    createMenu(
      "prod-016",
      "ไอซ์สตรอว์เบอร์รีคูลเลอร์",
      119,
      38,
      "cat-006",
      "ซิกเนเจอร์",
      false,
      "/images/cafe/cristian-cristian-0SwrXvH3rL0-unsplash.jpg",
    ),
  ];

  const orders = [
    createOrder(
      "order-001",
      "301",
      "DINE_IN",
      "COMPLETED",
      twoHoursAgo,
      hourAgo,
    ),
    createOrder(
      "order-002",
      "302",
      "TOGO",
      "COMPLETED",
      hourAgo,
      hourAgo,
      true,
    ),
    createOrder("order-003", "303", "DINE_IN", "PREPARING", hourAgo, now),
    createOrder("order-004", "304", "DELIVERY", "PENDING", now, now),
    createOrder("order-005", "305", "TOGO", "READY", now, now, true),
  ];

  const orderMeta: DemoOrderMeta[] = [
    {
      id: "order-001",
      storeId: DEMO_STORE_ID,
      tableNumber: "A2",
      products: [
        { productId: "prod-002", quantity: 1 },
        { productId: "prod-011", quantity: 1 },
      ],
    },
    {
      id: "order-002",
      storeId: DEMO_STORE_ID,
      customerName: "Mint",
      products: [
        { productId: "prod-004", quantity: 1 },
        { productId: "prod-010", quantity: 1 },
      ],
    },
    {
      id: "order-003",
      storeId: DEMO_STORE_ID,
      tableNumber: "B1",
      products: [
        { productId: "prod-015", quantity: 1 },
        { productId: "prod-009", quantity: 1 },
        { productId: "prod-013", quantity: 1 },
      ],
    },
    {
      id: "order-004",
      storeId: DEMO_STORE_ID,
      deliveryPlatform: "GrabFood",
      deliveryOrderNumber: "GF-CF-304",
      products: [
        { productId: "prod-016", quantity: 1, note: "หวานน้อย" },
        { productId: "prod-008", quantity: 1 },
      ],
    },
    {
      id: "order-005",
      storeId: DEMO_STORE_ID,
      products: [
        { productId: "prod-001", quantity: 1 },
        { productId: "prod-007", quantity: 1 },
      ],
    },
  ];

  const orderStationItems: IOrderStationItemDto[] = [
    {
      id: "osi-001",
      status: "complete",
      orderItem: {
        id: "oi-001",
        quantity: 1,
        notes: null,
        product: { id: "prod-002", name: "ลาเต้ร้อน" },
        order: {
          id: "order-001",
          orderNumber: "301",
          status: "COMPLETED",
          orderType: "DINE_IN",
          tableNumber: "A2",
          createdAt: twoHoursAgo,
        },
      },
    },
    {
      id: "osi-002",
      status: "pending",
      orderItem: {
        id: "oi-002",
        quantity: 1,
        notes: null,
        product: { id: "prod-009", name: "อัลมอนด์ครัวซองต์" },
        order: {
          id: "order-003",
          orderNumber: "303",
          status: "PREPARING",
          orderType: "DINE_IN",
          tableNumber: "B1",
          createdAt: hourAgo,
        },
      },
    },
    {
      id: "osi-003",
      status: "pending",
      orderItem: {
        id: "oi-003",
        quantity: 1,
        notes: "หวานน้อย",
        product: { id: "prod-016", name: "ไอซ์สตรอว์เบอร์รีคูลเลอร์" },
        order: {
          id: "order-004",
          orderNumber: "304",
          status: "PENDING",
          orderType: "DELIVERY",
          deliveryPlatform: "GrabFood",
          deliveryOrderNumber: "GF-CF-304",
          createdAt: now,
        },
      },
    },
  ];

  const transactions = [
    createTransaction(
      "txn-301",
      "order-001",
      "301",
      "CASH",
      [
        {
          productId: "prod-002",
          name: "ลาเต้ร้อน",
          price: 85,
          quantity: 1,
          total: 85,
        },
        {
          productId: "prod-011",
          name: "เค้กมอคค่าเลเยอร์",
          price: 135,
          quantity: 1,
          total: 135,
        },
      ],
      twoHoursAgo,
    ),
    createTransaction(
      "txn-302",
      "order-002",
      "302",
      "QR",
      [
        {
          productId: "prod-004",
          name: "มัทฉะลาเต้เย็น",
          price: 105,
          quantity: 1,
          total: 105,
        },
        {
          productId: "prod-010",
          name: "โดนัทเคลือบน้ำตาล",
          price: 69,
          quantity: 1,
          total: 69,
        },
      ],
      hourAgo,
    ),
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
    {
      id: "cat-001",
      name: "เบอร์เกอร์",
      isActive: true,
      sortOrder: 1,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-002",
      name: "ฮอตด็อก",
      isActive: true,
      sortOrder: 2,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-003",
      name: "ของทานเล่น",
      isActive: true,
      sortOrder: 3,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-004",
      name: "คอมโบเซ็ต",
      isActive: true,
      sortOrder: 4,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-005",
      name: "ไก่ทอด",
      isActive: true,
      sortOrder: 5,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-006",
      name: "พิซซ่า",
      isActive: true,
      sortOrder: 6,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-007",
      name: "เครื่องดื่ม",
      isActive: true,
      sortOrder: 7,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
  ];

  const products: IMenu[] = [
    createMenu(
      "prod-001",
      "Classic Beef Burger",
      129,
      46,
      "cat-001",
      "เบอร์เกอร์",
      true,
      "/images/fast-food/mafe-estudio-LV2p9Utbkbw-unsplash.jpg",
    ),
    createMenu(
      "prod-002",
      "Loaded Cheese Burger",
      169,
      62,
      "cat-001",
      "เบอร์เกอร์",
      true,
      "/images/fast-food/fatima-akram-uU0Anw-8Vsg-unsplash.jpg",
    ),
    createMenu(
      "prod-003",
      "Classic American Hotdog",
      109,
      39,
      "cat-002",
      "ฮอตด็อก",
      true,
      "/images/fast-food/jay-wennington-UgolPhUcu9g-unsplash.jpg",
    ),
    createMenu(
      "prod-004",
      "French Fries",
      69,
      23,
      "cat-003",
      "ของทานเล่น",
      true,
      "/images/fast-food/justus-menke-IZ39sNNw3-k-unsplash.jpg",
    ),
    createMenu(
      "prod-005",
      "Skin-On Fries",
      79,
      27,
      "cat-003",
      "ของทานเล่น",
      false,
      "/images/fast-food/christian-bolt-Uf0aVyl5C70-unsplash.jpg",
    ),
    createMenu(
      "prod-006",
      "Burger Combo",
      189,
      68,
      "cat-004",
      "คอมโบเซ็ต",
      true,
      "/images/fast-food/mafe-estudio-LV2p9Utbkbw-unsplash.jpg",
    ),
    createMenu(
      "prod-007",
      "Steak Fries Combo",
      249,
      98,
      "cat-004",
      "คอมโบเซ็ต",
      true,
      "/images/fast-food/zetong-li-zCIu5vilxCE-unsplash.jpg",
    ),
    createMenu(
      "prod-008",
      "Spicy Chicken Wings",
      149,
      55,
      "cat-005",
      "ไก่ทอด",
      true,
      "/images/fast-food/ulvi-safari-9-_8faGPQrU-unsplash.jpg",
    ),
    createMenu(
      "prod-009",
      "Pepperoni Pizza Slice",
      119,
      44,
      "cat-006",
      "พิซซ่า",
      true,
      "/images/fast-food/logan-weaver-lgnwvr-qgZRZI-pKgM-unsplash.jpg",
    ),
    createMenu(
      "prod-010",
      "Cola Lime",
      45,
      10,
      "cat-007",
      "เครื่องดื่ม",
      true,
      "/images/fast-food/crystal-jo-miBwd6QfPKE-unsplash.jpg",
    ),
    createMenu(
      "prod-011",
      "Orange Soda Can",
      39,
      9,
      "cat-007",
      "เครื่องดื่ม",
      false,
      "/images/fast-food/keriliwi-v_JswZL-s3k-unsplash.jpg",
    ),
  ];

  const orders = [
    createOrder(
      "order-001",
      "401",
      "TOGO",
      "COMPLETED",
      twoHoursAgo,
      hourAgo,
      true,
    ),
    createOrder("order-002", "402", "TOGO", "READY", hourAgo, hourAgo, true),
    createOrder("order-003", "403", "DELIVERY", "PREPARING", hourAgo, now),
    createOrder("order-004", "404", "TOGO", "PENDING", now, now, true),
    createOrder("order-005", "405", "DINE_IN", "COMPLETED", now, now),
  ];

  const orderMeta: DemoOrderMeta[] = [
    {
      id: "order-001",
      storeId: DEMO_STORE_ID,
      products: [{ productId: "prod-006", quantity: 1 }],
    },
    {
      id: "order-002",
      storeId: DEMO_STORE_ID,
      products: [{ productId: "prod-007", quantity: 1 }],
    },
    {
      id: "order-003",
      storeId: DEMO_STORE_ID,
      deliveryPlatform: "LINE MAN",
      deliveryOrderNumber: "LM-FF-403",
      products: [
        { productId: "prod-001", quantity: 1 },
        { productId: "prod-004", quantity: 1 },
        { productId: "prod-010", quantity: 1 },
      ],
    },
    {
      id: "order-004",
      storeId: DEMO_STORE_ID,
      products: [
        { productId: "prod-003", quantity: 1 },
        { productId: "prod-011", quantity: 1 },
      ],
    },
    {
      id: "order-005",
      storeId: DEMO_STORE_ID,
      tableNumber: "C4",
      products: [
        { productId: "prod-002", quantity: 1 },
        { productId: "prod-009", quantity: 1 },
      ],
    },
  ];

  const orderStationItems: IOrderStationItemDto[] = [
    {
      id: "osi-001",
      status: "complete",
      orderItem: {
        id: "oi-001",
        quantity: 1,
        notes: null,
        product: { id: "prod-007", name: "Steak Fries Combo" },
        order: {
          id: "order-002",
          orderNumber: "402",
          status: "READY",
          orderType: "TOGO",
          createdAt: hourAgo,
        },
      },
    },
    {
      id: "osi-002",
      status: "pending",
      orderItem: {
        id: "oi-002",
        quantity: 1,
        notes: null,
        product: { id: "prod-001", name: "Classic Beef Burger" },
        order: {
          id: "order-003",
          orderNumber: "403",
          status: "PREPARING",
          orderType: "DELIVERY",
          deliveryPlatform: "LINE MAN",
          deliveryOrderNumber: "LM-FF-403",
          createdAt: hourAgo,
        },
      },
    },
    {
      id: "osi-003",
      status: "pending",
      orderItem: {
        id: "oi-003",
        quantity: 1,
        notes: null,
        product: { id: "prod-003", name: "Classic American Hotdog" },
        order: {
          id: "order-004",
          orderNumber: "404",
          status: "PENDING",
          orderType: "TOGO",
          createdAt: now,
        },
      },
    },
  ];

  const transactions = [
    createTransaction(
      "txn-401",
      "order-001",
      "401",
      "CASH",
      [
        {
          productId: "prod-006",
          name: "Burger Combo",
          price: 189,
          quantity: 1,
          total: 189,
        },
      ],
      twoHoursAgo,
    ),
    createTransaction(
      "txn-405",
      "order-005",
      "405",
      "QR",
      [
        {
          productId: "prod-002",
          name: "Loaded Cheese Burger",
          price: 169,
          quantity: 1,
          total: 169,
        },
        {
          productId: "prod-009",
          name: "Pepperoni Pizza Slice",
          price: 119,
          quantity: 1,
          total: 119,
        },
      ],
      now,
    ),
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
    {
      id: "cat-001",
      name: "จานเดียว",
      isActive: true,
      sortOrder: 1,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-002",
      name: "เส้น",
      isActive: true,
      sortOrder: 2,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-003",
      name: "ต้ม / แกง",
      isActive: true,
      sortOrder: 3,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-004",
      name: "ย่าง / ทอด",
      isActive: true,
      sortOrder: 4,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-005",
      name: "กับข้าว",
      isActive: true,
      sortOrder: 5,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
    {
      id: "cat-006",
      name: "ทานเล่น",
      isActive: true,
      sortOrder: 6,
      createdAt: twoHoursAgo,
      updatedAt: now,
    },
  ];

  const products: IMenu[] = [
    createMenu(
      "prod-001",
      "ข้าวกะเพราหมูสับไข่ดาว",
      79,
      29,
      "cat-001",
      "จานเดียว",
      true,
      "/images/thai-food/vicky-ng-NT5oqzp-050-unsplash.jpg",
    ),
    createMenu(
      "prod-002",
      "ข้าวผัดกุ้ง",
      89,
      34,
      "cat-001",
      "จานเดียว",
      false,
      "/images/thai-food/yosuke-ota-R6x3ak8nWLQ-unsplash.jpg",
    ),
    createMenu(
      "prod-003",
      "ข้าวแกงเขียวหวาน",
      95,
      36,
      "cat-001",
      "จานเดียว",
      false,
      "/images/thai-food/zoshua-colah-4ZyLEI4y3-0-unsplash.jpg",
    ),
    createMenu(
      "prod-004",
      "ผัดไทยกุ้งสด",
      99,
      38,
      "cat-002",
      "เส้น",
      true,
      "/images/thai-food/john-aledia-_wBJ0cvKhIE-unsplash.jpg",
    ),
    createMenu(
      "prod-005",
      "ขนมจีนน้ำยาไก่",
      89,
      33,
      "cat-002",
      "เส้น",
      false,
      "/images/thai-food/max-griss-YpfRCe5lda0-unsplash.jpg",
    ),
    createMenu(
      "prod-006",
      "ข้าวซอยไก่",
      109,
      42,
      "cat-002",
      "เส้น",
      true,
      "/images/thai-food/8-low-ural-_6bfVnELZXE-unsplash.jpg",
    ),
    createMenu(
      "prod-007",
      "ก๋วยเตี๋ยวต้มยำลูกชิ้น",
      89,
      32,
      "cat-002",
      "เส้น",
      false,
      "/images/thai-food/tips-fitness-CyhPA97pDiA-unsplash.jpg",
    ),
    createMenu(
      "prod-008",
      "ต้มข่าไก่",
      129,
      49,
      "cat-003",
      "ต้ม / แกง",
      true,
      "/images/thai-food/alexandra-tran-PRMrWEF8Big-unsplash.jpg",
    ),
    createMenu(
      "prod-009",
      "แกงแดงหมู",
      119,
      45,
      "cat-003",
      "ต้ม / แกง",
      false,
      "/images/thai-food/charlesdeluvio-wrfO9SWykdE-unsplash.jpg",
    ),
    createMenu(
      "prod-010",
      "ไก่ย่างสมุนไพร",
      149,
      62,
      "cat-004",
      "ย่าง / ทอด",
      true,
      "/images/thai-food/streets-of-food-uVGi2miJDXo-unsplash.jpg",
    ),
    createMenu(
      "prod-011",
      "หมูย่าง",
      129,
      54,
      "cat-004",
      "ย่าง / ทอด",
      false,
      "/images/thai-food/pcrm-dorego--wVjyTtcX04-unsplash.jpg",
    ),
    createMenu(
      "prod-012",
      "ทอดมันปลา",
      99,
      38,
      "cat-006",
      "ทานเล่น",
      false,
      "/images/thai-food/olivier-bergeron-GM8JLQyHnhI-unsplash.jpg",
    ),
    createMenu(
      "prod-013",
      "ส้มตำไทย",
      79,
      24,
      "cat-005",
      "กับข้าว",
      true,
      "/images/thai-food/bon-vivant-qom5MPOER-I-unsplash.jpg",
    ),
    createMenu(
      "prod-014",
      "ข้าวหมูกรอบคะน้า",
      99,
      39,
      "cat-001",
      "จานเดียว",
      false,
      "/images/thai-food/jerome-jome-ElvU9T6-b0M-unsplash.jpg",
    ),
  ];

  const orders = [
    createOrder(
      "order-001",
      "001",
      "DINE_IN",
      "COMPLETED",
      twoHoursAgo,
      hourAgo,
    ),
    createOrder("order-002", "002", "TOGO", "COMPLETED", hourAgo, hourAgo),
    createOrder("order-003", "003", "DINE_IN", "PREPARING", hourAgo, now),
    createOrder("order-004", "004", "DELIVERY", "PENDING", now, now),
    createOrder("order-005", "005", "TOGO", "READY", now, now, true),
    createOrder("order-006", "006", "DELIVERY", "PREPARING", hourAgo, now),
  ];

  const orderMeta: DemoOrderMeta[] = [
    {
      id: "order-001",
      storeId: DEMO_STORE_ID,
      tableNumber: "A1",
      products: [
        { productId: "prod-001", quantity: 1 },
        { productId: "prod-013", quantity: 1 },
        { productId: "prod-012", quantity: 1 },
      ],
    },
    {
      id: "order-002",
      storeId: DEMO_STORE_ID,
      products: [
        { productId: "prod-006", quantity: 1 },
        { productId: "prod-012", quantity: 1 },
      ],
    },
    {
      id: "order-003",
      storeId: DEMO_STORE_ID,
      tableNumber: "B2",
      products: [
        { productId: "prod-014", quantity: 1 },
        { productId: "prod-008", quantity: 1, note: "ขอเผ็ดกลาง" },
      ],
    },
    {
      id: "order-004",
      storeId: DEMO_STORE_ID,
      deliveryPlatform: "GrabFood",
      deliveryOrderNumber: "GF-2048",
      products: [
        { productId: "prod-004", quantity: 1 },
        { productId: "prod-013", quantity: 1 },
      ],
    },
    {
      id: "order-005",
      storeId: DEMO_STORE_ID,
      products: [
        { productId: "prod-002", quantity: 1 },
        { productId: "prod-011", quantity: 1 },
      ],
    },
    {
      id: "order-006",
      storeId: DEMO_STORE_ID,
      deliveryPlatform: "LINE MAN",
      deliveryOrderNumber: "LM-3321",
      products: [
        { productId: "prod-010", quantity: 1 },
        { productId: "prod-009", quantity: 1 },
        { productId: "prod-013", quantity: 1, note: "ไม่ใส่ถั่ว" },
      ],
    },
  ];

  const orderStationItems: IOrderStationItemDto[] = [
    {
      id: "osi-001",
      status: "complete",
      orderItem: {
        id: "oi-001",
        quantity: 1,
        notes: null,
        product: { id: "prod-014", name: "ข้าวหมูกรอบคะน้า" },
        order: {
          id: "order-003",
          orderNumber: "003",
          status: "PREPARING",
          orderType: "DINE_IN",
          tableNumber: "B2",
          createdAt: hourAgo,
        },
      },
    },
    {
      id: "osi-002",
      status: "pending",
      orderItem: {
        id: "oi-002",
        quantity: 1,
        notes: "ขอเผ็ดกลาง",
        product: { id: "prod-008", name: "ต้มข่าไก่" },
        order: {
          id: "order-003",
          orderNumber: "003",
          status: "PREPARING",
          orderType: "DINE_IN",
          tableNumber: "B2",
          createdAt: hourAgo,
        },
      },
    },
    {
      id: "osi-003",
      status: "pending",
      orderItem: {
        id: "oi-003",
        quantity: 1,
        notes: null,
        product: { id: "prod-004", name: "ผัดไทยกุ้งสด" },
        order: {
          id: "order-004",
          orderNumber: "004",
          status: "PENDING",
          orderType: "DELIVERY",
          deliveryPlatform: "GrabFood",
          deliveryOrderNumber: "GF-2048",
          createdAt: now,
        },
      },
    },
    {
      id: "osi-004",
      status: "complete",
      orderItem: {
        id: "oi-004",
        quantity: 1,
        notes: null,
        product: { id: "prod-002", name: "ข้าวผัดกุ้ง" },
        order: {
          id: "order-005",
          orderNumber: "005",
          status: "READY",
          orderType: "TOGO",
          createdAt: now,
        },
      },
    },
    {
      id: "osi-005",
      status: "pending",
      orderItem: {
        id: "oi-005",
        quantity: 1,
        notes: "ไม่ใส่ถั่ว",
        product: { id: "prod-013", name: "ส้มตำไทย" },
        order: {
          id: "order-006",
          orderNumber: "006",
          status: "PREPARING",
          orderType: "DELIVERY",
          deliveryPlatform: "LINE MAN",
          deliveryOrderNumber: "LM-3321",
          createdAt: hourAgo,
        },
      },
    },
  ];

  const transactions = [
    createTransaction(
      "txn-001",
      "order-001",
      "001",
      "CASH",
      [
        {
          productId: "prod-001",
          name: "ข้าวกะเพราหมูสับไข่ดาว",
          price: 79,
          quantity: 1,
          total: 79,
        },
        {
          productId: "prod-013",
          name: "ส้มตำไทย",
          price: 79,
          quantity: 1,
          total: 79,
        },
        {
          productId: "prod-012",
          name: "ทอดมันปลา",
          price: 99,
          quantity: 1,
          total: 99,
        },
      ],
      twoHoursAgo,
    ),
    createTransaction(
      "txn-002",
      "order-002",
      "002",
      "QR",
      [
        {
          productId: "prod-006",
          name: "ข้าวซอยไก่",
          price: 109,
          quantity: 1,
          total: 109,
        },
        {
          productId: "prod-012",
          name: "ทอดมันปลา",
          price: 99,
          quantity: 1,
          total: 99,
        },
      ],
      hourAgo,
    ),
    createTransaction(
      "txn-003",
      "order-006",
      "006",
      "QR",
      [
        {
          productId: "prod-010",
          name: "ไก่ย่างสมุนไพร",
          price: 149,
          quantity: 1,
          total: 149,
        },
        {
          productId: "prod-009",
          name: "แกงแดงหมู",
          price: 119,
          quantity: 1,
          total: 119,
        },
        {
          productId: "prod-013",
          name: "ส้มตำไทย",
          price: 79,
          quantity: 1,
          total: 79,
        },
      ],
      hourAgo,
    ),
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

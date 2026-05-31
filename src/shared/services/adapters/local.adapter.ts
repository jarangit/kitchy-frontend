/**
 * LocalStorage-based adapter for demo mode.
 * Full CRUD — no network calls.
 */

import type { DataAdapter } from "./data-adapter";
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
import type { IReportFilter } from "@/features/report/types/report.dto";
import {
  seedUser,
  seedStore,
  seedStations,
  seedCategories,
  seedProducts,
  seedOrders,
  seedOrderStationItems,
  seedTransactions,
  seedOrderMeta,
  type DemoOrderMeta,
} from "./seed-data";

// ─── Helpers ───────────────────────────────────────────────

const KEYS = {
  user: "demo:user",
  stores: "demo:stores",
  stations: "demo:stations",
  products: "demo:products",
  categories: "demo:categories",
  orders: "demo:orders",
  orderMeta: "demo:orderMeta",
  orderStationItems: "demo:orderStationItems",
  transactions: "demo:transactions",
} as const;

function get<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  return JSON.parse(raw) as T;
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function genId(): string {
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const now = () => new Date().toISOString();

function buildTransactionItems(
  meta: DemoOrderMeta | undefined,
  products: IMenu[],
  fallbackItems: ITransaction["items"] = [],
): ITransaction["items"] {
  if (!meta) return fallbackItems;

  return meta.products.map((product) => {
    const productRecord = products.find((item) => item.id === product.productId);
    const price = productRecord?.price ?? 0;

    return {
      productId: product.productId,
      name: productRecord?.name ?? `Product #${product.productId}`,
      price,
      quantity: product.quantity,
      total: price * product.quantity,
    };
  });
}

function buildTransactionView(
  order: IOrderItem,
  meta: DemoOrderMeta | undefined,
  products: IMenu[],
  payments: ITransaction[],
): ITransaction {
  const relatedPayments = payments.filter((payment) => payment.orderId === order.id);
  const primaryPayment = relatedPayments.at(-1);
  const items = buildTransactionItems(meta, products, primaryPayment?.items ?? []);
  const amount = items.reduce((sum, item) => sum + item.total, 0);

  return {
    id: order.id,
    orderId: order.id,
    orderNumber: order.orderNumber,
    storeId: meta?.storeId ?? "",
    status: order.status,
    type: order.type,
    tableNumber: meta?.tableNumber,
    customerName: meta?.customerName,
    deliveryPlatform: meta?.deliveryPlatform,
    deliveryOrderNumber: meta?.deliveryOrderNumber,
    method: primaryPayment?.method ?? "CASH",
    amount,
    totalAmount: amount,
    receiptId: primaryPayment?.receiptId ?? `DEMO-${order.orderNumber}`,
    items,
    products: items,
    createdAt: String(order.createdAt),
    updatedAt: String(order.updatedAt),
  };
}

function resolveTransactionOrderId(id: string, payments: ITransaction[]): string {
  return payments.find((payment) => payment.id === id)?.orderId ?? id;
}

// Simulate network latency
const delay = (ms = 80) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Adapter Implementation ────────────────────────────────

export const localAdapter: DataAdapter = {
  // ═══ Auth ═══
  async login(_email: string, _password: string) {
    await delay();
    return { data: { access_token: "demo-token-fake" } };
  },

  async register(_payload: IRegisterRequest) {
    await delay();
    return { data: { access_token: "demo-token-fake" } };
  },

  async getMe() {
    await delay();
    return get<IUser>(KEYS.user, seedUser);
  },

  // ═══ Store ═══
  async getStoresByUserId(_userId: string) {
    await delay();
    const stores = get<IStore[]>(KEYS.stores, [seedStore]);
    return stores;
  },

  async getStoreById(id: string) {
    await delay();
    const stores = get<IStore[]>(KEYS.stores, [seedStore]);
    return stores.find((s) => s.id === id) ?? stores[0];
  },

  async createStore(dto: ICreateStore) {
    await delay();
    const stores = get<IStore[]>(KEYS.stores, [seedStore]);
    const store: IStore = { id: genId(), name: dto.name, userId: dto.userId, createdAt: now(), updatedAt: now() };
    stores.push(store);
    set(KEYS.stores, stores);
    return store;
  },

  async updateStore(id: string, dto: IUpdateStore) {
    await delay();
    const stores = get<IStore[]>(KEYS.stores, [seedStore]);
    const idx = stores.findIndex((s) => s.id === id);
    if (idx >= 0) {
      stores[idx] = { ...stores[idx], ...dto, updatedAt: now() };
      set(KEYS.stores, stores);
      return stores[idx];
    }
    throw new Error("Store not found");
  },

  async deleteStore(id: string) {
    await delay();
    const stores = get<IStore[]>(KEYS.stores, [seedStore]).filter((s) => s.id !== id);
    set(KEYS.stores, stores);
  },

  // ═══ Station ═══
  async getStationsByStoreId(storeId: string) {
    await delay();
    return get<IStation[]>(KEYS.stations, seedStations).filter((s) => s.storeId === storeId);
  },

  async getStationById(id: string) {
    await delay();
    const stations = get<IStation[]>(KEYS.stations, seedStations);
    return stations.find((s) => s.id === id) ?? stations[0];
  },

  async createStation(dto: ICreateStation) {
    await delay();
    const stations = get<IStation[]>(KEYS.stations, seedStations);
    const station: IStation = { id: genId(), name: dto.name, color: dto.color, storeId: dto.storeId, createdAt: now(), updatedAt: now() };
    stations.push(station);
    set(KEYS.stations, stations);
    return station;
  },

  async updateStation(id: string, dto: IUpdateStation) {
    await delay();
    const stations = get<IStation[]>(KEYS.stations, seedStations);
    const idx = stations.findIndex((s) => s.id === id);
    if (idx >= 0) {
      stations[idx] = { ...stations[idx], ...dto, updatedAt: now() };
      set(KEYS.stations, stations);
      return stations[idx];
    }
    throw new Error("Station not found");
  },

  async deleteStation(id: string) {
    await delay();
    const stations = get<IStation[]>(KEYS.stations, seedStations).filter((s) => s.id !== id);
    set(KEYS.stations, stations);
  },

  // ═══ Product ═══
  async getProductsByStoreId(storeId: string) {
    await delay();
    return get<IMenu[]>(KEYS.products, seedProducts).filter((p) => p.storeId === storeId);
  },

  async getProductById(id: string) {
    await delay();
    const products = get<IMenu[]>(KEYS.products, seedProducts);
    return products.find((p) => p.id === id) ?? products[0];
  },

  async getProductsByCategoryId(categoryId: string) {
    await delay();
    return get<IMenu[]>(KEYS.products, seedProducts).filter((p) => p.categoryId === categoryId);
  },

  async createProduct(dto: CreateProductRequest) {
    await delay();
    const products = get<IMenu[]>(KEYS.products, seedProducts);
    const categories = get<CategoryModel[]>(KEYS.categories, seedCategories);
    const stations = get<IStation[]>(KEYS.stations, seedStations);
    const cat = categories.find((c) => c.id === dto.categoryId);
    const station = stations.find((s) => s.id === dto.stationId);
    const product: IMenu = {
      id: genId(),
      name: dto.name,
      isActive: dto.isActive,
      isBestSeller: dto.isBestSeller,
      price: dto.price,
      cost: dto.cost,
      imageUrl: dto.imageUrl,
      categoryId: dto.categoryId,
      categoryName: cat?.name,
      stationId: dto.stationId,
      stationName: station?.name,
      storeId: dto.storeId,
      createdAt: now(),
      updatedAt: now(),
    };
    products.push(product);
    set(KEYS.products, products);
    return product;
  },

  async updateProduct(id: string, dto: UpdateProductRequest) {
    await delay();
    const products = get<IMenu[]>(KEYS.products, seedProducts);
    const idx = products.findIndex((p) => p.id === id);
    if (idx >= 0) {
      products[idx] = { ...products[idx], ...dto, updatedAt: now() };
      set(KEYS.products, products);
      return products[idx];
    }
    throw new Error("Product not found");
  },

  async deleteProduct(id: string) {
    await delay();
    const products = get<IMenu[]>(KEYS.products, seedProducts).filter((p) => p.id !== id);
    set(KEYS.products, products);
  },

  // ═══ Category ═══
  async getCategoriesByStoreId(_storeId: string) {
    await delay();
    return get<CategoryModel[]>(KEYS.categories, seedCategories);
  },

  async createCategory(dto: CreateCategoryRequestDto) {
    await delay();
    const categories = get<CategoryModel[]>(KEYS.categories, seedCategories);
    const category: CategoryModel = {
      id: genId(),
      name: dto.name,
      isActive: dto.isActive ?? true,
      sortOrder: dto.sortOrder ?? categories.length + 1,
      createdAt: now(),
      updatedAt: now(),
    };
    categories.push(category);
    set(KEYS.categories, categories);
    return category;
  },

  async updateCategory(id: string, dto: UpdateCategoryRequestDto) {
    await delay();
    const categories = get<CategoryModel[]>(KEYS.categories, seedCategories);
    const idx = categories.findIndex((c) => c.id === id);
    if (idx >= 0) {
      categories[idx] = { ...categories[idx], ...dto, updatedAt: now() };
      set(KEYS.categories, categories);
      return categories[idx];
    }
    throw new Error("Category not found");
  },

  async deleteCategory(id: string) {
    await delay();
    const categories = get<CategoryModel[]>(KEYS.categories, seedCategories).filter((c) => c.id !== id);
    set(KEYS.categories, categories);
  },

  // ═══ Order ═══
  async getOrdersByStoreId(_storeId: string) {
    await delay();
    return get<IOrderItem[]>(KEYS.orders, seedOrders);
  },

  async getOrdersByStationId(stationId: string) {
    await delay();
    const orders = get<IOrderItem[]>(KEYS.orders, seedOrders);
    const metas = get<DemoOrderMeta[]>(KEYS.orderMeta, seedOrderMeta);
    const products = get<IMenu[]>(KEYS.products, seedProducts);
    // Return orders that have products belonging to this station
    const stationProductIds = products.filter((p) => p.stationId === stationId).map((p) => p.id);
    const orderIds = metas
      .filter((m) => m.products.some((p) => stationProductIds.includes(p.productId)))
      .map((m) => m.id);
    return orders.filter((o) => orderIds.includes(o.id));
  },

  async getOrderById(id: string) {
    await delay();
    const orders = get<IOrderItem[]>(KEYS.orders, seedOrders);
    return orders.find((o) => o.id === id) ?? orders[0];
  },

  async createOrder(
    storeId: string,
    orderNumber: string,
    products: { productId: string; quantity: number; note?: string }[],
    orderType: OrderType,
    tableNumber?: string,
    customerName?: string,
    deliveryPlatform?: string,
    deliveryOrderNumber?: string,
  ) {
    await delay();
    const orders = get<IOrderItem[]>(KEYS.orders, seedOrders);
    const metas = get<DemoOrderMeta[]>(KEYS.orderMeta, seedOrderMeta);
    const id = genId();
    const order: IOrderItem = {
      id,
      orderNumber,
      type: orderType,
      status: "PENDING",
      isArchived: false,
      archivedAt: null,
      isWaitingInStore: false,
      createdAt: now(),
      updatedAt: now(),
    };
    orders.push(order);
    set(KEYS.orders, orders);

    metas.push({ id, storeId, tableNumber, customerName, deliveryPlatform, deliveryOrderNumber, products });
    set(KEYS.orderMeta, metas);

    // Create order-station items for KDS
    const allProducts = get<IMenu[]>(KEYS.products, seedProducts);
    const osis = get<IOrderStationItemDto[]>(KEYS.orderStationItems, seedOrderStationItems);
    for (const p of products) {
      const prod = allProducts.find((ap) => ap.id === p.productId);
      if (prod) {
        osis.push({
          id: genId(),
          status: "pending",
          orderItem: {
            id: genId(),
            quantity: p.quantity,
            notes: p.note ?? null,
            product: { id: prod.id, name: prod.name },
            order: { id, orderNumber, status: "PENDING", orderType, tableNumber, customerName, deliveryPlatform, deliveryOrderNumber, createdAt: now() },
          },
        });
      }
    }
    set(KEYS.orderStationItems, osis);

    return order;
  },

  async updateOrder(id: string, data: Record<string, unknown>) {
    await delay();
    const orders = get<IOrderItem[]>(KEYS.orders, seedOrders);
    const idx = orders.findIndex((o) => o.id === id);
    if (idx >= 0) {
      orders[idx] = { ...orders[idx], ...(data as Partial<IOrderItem>), updatedAt: now() };
      set(KEYS.orders, orders);
      return orders[idx];
    }
    throw new Error("Order not found");
  },

  async deleteOrder(id: string) {
    await delay();
    set(KEYS.orders, get<IOrderItem[]>(KEYS.orders, seedOrders).filter((o) => o.id !== id));
    set(KEYS.orderMeta, get<DemoOrderMeta[]>(KEYS.orderMeta, seedOrderMeta).filter((m) => m.id !== id));
  },

  // ═══ KDS ═══
  async getOrderStationItemsByStationId(stationId: string) {
    await delay();
    const osis = get<IOrderStationItemDto[]>(KEYS.orderStationItems, seedOrderStationItems);
    const products = get<IMenu[]>(KEYS.products, seedProducts);
    const stationProductIds = products.filter((p) => p.stationId === stationId).map((p) => p.id);
    return osis.filter((osi) => stationProductIds.includes(osi.orderItem.product.id));
  },

  async updateOrderStationItem(id: string, data: { status: "pending" | "complete" | "served" }) {
    await delay();
    const osis = get<IOrderStationItemDto[]>(KEYS.orderStationItems, seedOrderStationItems);
    const idx = osis.findIndex((o) => o.id === id);
    if (idx >= 0) {
      osis[idx] = { ...osis[idx], status: data.status };
      set(KEYS.orderStationItems, osis);
    }
  },

  // ═══ Transaction ═══
  async getTransactionsByStoreId(filter: ITransactionFilter) {
    await delay();
    const orders = get<IOrderItem[]>(KEYS.orders, seedOrders);
    const metas = get<DemoOrderMeta[]>(KEYS.orderMeta, seedOrderMeta);
    const products = get<IMenu[]>(KEYS.products, seedProducts);
    const payments = get<ITransaction[]>(KEYS.transactions, seedTransactions);

    let txns = orders
      .map((order) =>
        buildTransactionView(
          order,
          metas.find((meta) => meta.id === order.id),
          products,
          payments,
        ),
      )
      .filter((transaction) => transaction.storeId === filter.storeId);

    if (filter.method) txns = txns.filter((transaction) => transaction.method === filter.method);

    return txns;
  },

  async getTransactionById(id: string) {
    await delay();
    const orders = get<IOrderItem[]>(KEYS.orders, seedOrders);
    const metas = get<DemoOrderMeta[]>(KEYS.orderMeta, seedOrderMeta);
    const products = get<IMenu[]>(KEYS.products, seedProducts);
    const payments = get<ITransaction[]>(KEYS.transactions, seedTransactions);
    const orderId = resolveTransactionOrderId(id, payments);
    const order = orders.find((item) => item.id === orderId);

    if (!order) {
      return buildTransactionView(orders[0], metas.find((meta) => meta.id === orders[0].id), products, payments);
    }

    return buildTransactionView(
      order,
      metas.find((meta) => meta.id === order.id),
      products,
      payments,
    );
  },

  async updateTransaction(id: string, payload: unknown) {
    await delay();
    const payments = get<ITransaction[]>(KEYS.transactions, seedTransactions);
    const orders = get<IOrderItem[]>(KEYS.orders, seedOrders);
    const metas = get<DemoOrderMeta[]>(KEYS.orderMeta, seedOrderMeta);
    const products = get<IMenu[]>(KEYS.products, seedProducts);
    const orderStationItems = get<IOrderStationItemDto[]>(KEYS.orderStationItems, seedOrderStationItems);
    const orderId = resolveTransactionOrderId(id, payments);
    const orderIdx = orders.findIndex((order) => order.id === orderId);

    if (orderIdx < 0) {
      throw new Error("Transaction not found");
    }

    const updates = payload as {
      status?: IOrderItem["status"];
      tableNumber?: string;
      products?: { productId: string; quantity: number; note?: string }[];
    };

    orders[orderIdx] = {
      ...orders[orderIdx],
      status: updates.status ?? orders[orderIdx].status,
      updatedAt: now(),
    };
    set(KEYS.orders, orders);

    const metaIdx = metas.findIndex((meta) => meta.id === orderId);
    if (metaIdx >= 0) {
      metas[metaIdx] = {
        ...metas[metaIdx],
        tableNumber:
          updates.tableNumber !== undefined
            ? updates.tableNumber
            : metas[metaIdx].tableNumber,
        products: updates.products ?? metas[metaIdx].products,
      };
    }
    set(KEYS.orderMeta, metas);

    const orderMeta = metas.find((meta) => meta.id === orderId);
    const nextStatus = updates.status;
    if (nextStatus) {
      const nextOrderStationItems = orderStationItems.map((item) =>
        item.orderItem.order.id === orderId
          ? {
              ...item,
              orderItem: {
                ...item.orderItem,
                order: {
                  ...item.orderItem.order,
                  status: nextStatus,
                },
              },
            }
          : item,
      );
      set(KEYS.orderStationItems, nextOrderStationItems);
    }

    return buildTransactionView(orders[orderIdx], orderMeta, products, payments);
  },

  // ═══ Report ═══
  async getReportData(_filter: IReportFilter) {
    await delay();
    const txns = get<ITransaction[]>(KEYS.transactions, seedTransactions);
    const totalRevenue = txns.reduce((sum, t) => sum + t.amount, 0);
    const totalOrders = txns.length;
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    // Aggregate top products
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    for (const txn of txns) {
      for (const item of txn.items) {
        const existing = productMap.get(item.productId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.total;
        } else {
          productMap.set(item.productId, { name: item.name, quantity: item.quantity, revenue: item.total });
        }
      }
    }

    const topProducts = [...productMap.entries()]
      .map(([productId, data]) => ({ productId, name: data.name, quantitySold: data.quantity, revenue: data.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Payment breakdown
    const methodMap = new Map<string, number>();
    for (const txn of txns) {
      methodMap.set(txn.method, (methodMap.get(txn.method) ?? 0) + txn.amount);
    }
    const paymentBreakdown = [...methodMap.entries()].map(([method, amount]) => ({ method, amount }));

    return {
      summary: { totalRevenue, totalOrders, averageOrderValue },
      topProducts,
      paymentBreakdown,
    };
  },
};

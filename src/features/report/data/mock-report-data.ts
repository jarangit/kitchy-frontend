import {
  format,
  startOfMonth,
  getDaysInMonth,
  parse,
  isSameMonth,
} from "date-fns";
import type {
  IReportData,
  ITopProduct,
  IReportSummary,
  ICalendarDay,
  IDeliveryProviderBreakdown,
  IHourlyOrderPoint,
  IPaymentBreakdown,
} from "@/features/report/types/report.model";
import type { DateRangePreset } from "@/features/report/types/report.dto";

/* ── helpers ── */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

/* ── mock menu items ── */

const MOCK_PRODUCTS: Omit<ITopProduct, "quantitySold" | "revenue">[] = [
  { productId: "p1", name: "ข้าวผัดกระเพรา" },
  { productId: "p2", name: "ส้มตำไทย" },
  { productId: "p3", name: "ต้มยำกุ้ง" },
  { productId: "p4", name: "แกงเขียวหวาน" },
  { productId: "p5", name: "ผัดไทยกุ้งสด" },
  { productId: "p6", name: "ข้าวมันไก่" },
  { productId: "p7", name: "กะเพราหมูสับ" },
  { productId: "p8", name: "กาแฟเย็น" },
];

const DELIVERY_PROVIDERS = ["GrabFood", "LINE MAN", "ShopeeFood"] as const;

/* ── generators ── */

function generateTopProducts(seed: number, count: number): ITopProduct[] {
  const rand = seededRandom(seed);
  return MOCK_PRODUCTS.map((p) => {
    const qty = 10 + Math.floor(rand() * 80);
    const price = 40 + Math.floor(rand() * 100);
    return { ...p, quantitySold: qty, revenue: qty * price };
  })
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, count);
}

function generatePaymentBreakdown(
  revenue: number,
  seed: number,
): IPaymentBreakdown[] {
  const rand = seededRandom(seed);
  const cashRatio = 0.3 + rand() * 0.35;
  const cashAmount = Math.round(revenue * cashRatio);

  return [
    { method: "Cash", amount: cashAmount },
    { method: "Transfer", amount: revenue - cashAmount },
  ];
}

function aggregatePaymentBreakdown(
  paymentRows: IPaymentBreakdown[],
): IPaymentBreakdown[] {
  const totals = new Map<string, number>();

  paymentRows.forEach((row) => {
    totals.set(row.method, (totals.get(row.method) ?? 0) + row.amount);
  });

  return Array.from(totals.entries()).map(([method, amount]) => ({
    method,
    amount,
  }));
}

function generateDeliveryProviderBreakdown(
  revenue: number,
  orders: number,
  seed: number,
): IDeliveryProviderBreakdown[] {
  const rand = seededRandom(seed);
  const deliveryRevenue = Math.round(revenue * (0.08 + rand() * 0.22));
  const deliveryOrders = Math.max(0, Math.round(orders * (0.1 + rand() * 0.2)));

  if (deliveryRevenue <= 0 || deliveryOrders <= 0) return [];

  const activeProviders = DELIVERY_PROVIDERS.filter(() => rand() > 0.35);
  const providers =
    activeProviders.length > 0 ? activeProviders : [DELIVERY_PROVIDERS[0]];

  let remainingRevenue = deliveryRevenue;
  let remainingOrders = deliveryOrders;

  return providers.map((provider, index) => {
    if (index === providers.length - 1) {
      return {
        provider,
        amount: remainingRevenue,
        orders: remainingOrders,
      };
    }

    const revenueShare = 0.2 + rand() * 0.45;
    const orderShare = 0.2 + rand() * 0.45;
    const amount = Math.max(1, Math.round(deliveryRevenue * revenueShare));
    const providerOrders = Math.max(1, Math.round(deliveryOrders * orderShare));
    const clampedAmount = Math.min(
      amount,
      remainingRevenue - (providers.length - index - 1),
    );
    const clampedOrders = Math.min(
      providerOrders,
      remainingOrders - (providers.length - index - 1),
    );
    remainingRevenue -= clampedAmount;
    remainingOrders -= clampedOrders;

    return { provider, amount: clampedAmount, orders: clampedOrders };
  });
}

function generateHourlyOrders(
  totalOrders: number,
  seed: number,
): IHourlyOrderPoint[] {
  const rand = seededRandom(seed);
  const hours = Array.from({ length: 8 }, (_, index) => ({
    hour: 10 + index,
    orders: 0,
    weight: 0.7 + rand() * 1.8,
  }));

  const totalWeight = hours.reduce((sum, point) => sum + point.weight, 0);
  let allocatedOrders = 0;

  for (let index = 0; index < hours.length; index += 1) {
    const point = hours[index];

    if (index === hours.length - 1) {
      point.orders = Math.max(0, totalOrders - allocatedOrders);
      continue;
    }

    const orders = Math.max(
      0,
      Math.round((totalOrders * point.weight) / totalWeight),
    );
    point.orders = orders;
    allocatedOrders += orders;
  }

  return hours.map(({ hour, orders }) => ({ hour, orders }));
}

function parseMonth(month?: string): Date {
  if (!month) return startOfMonth(new Date());

  const parsed = parse(month, "yyyy-MM", new Date());
  if (Number.isNaN(parsed.getTime())) {
    return startOfMonth(new Date());
  }

  return startOfMonth(parsed);
}

function getSeedFromMonth(monthStart: Date): number {
  return monthStart.getFullYear() * 100 + monthStart.getMonth() + 1;
}

function generateCalendarDays(month?: string): ICalendarDay[] {
  const now = new Date();
  const monthStart = parseMonth(month);
  const totalDays = getDaysInMonth(monthStart);
  const isCurrentMonth = isSameMonth(monthStart, now);
  const lastAvailableDay = isCurrentMonth ? now.getDate() : totalDays;
  const days: ICalendarDay[] = [];
  const monthSeed = getSeedFromMonth(monthStart);

  if (monthStart > startOfMonth(now)) {
    return [];
  }

  for (let i = 0; i < totalDays; i++) {
    const date = new Date(monthStart);
    date.setDate(i + 1);

    if (i + 1 > lastAvailableDay) break;

    const seed = monthSeed + i;
    const rand = seededRandom(seed);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseOrders = isWeekend ? 40 : 28;
    const orders = baseOrders + Math.floor(rand() * 20);
    const avgPrice = 80 + Math.floor(rand() * 80);
    const revenue = orders * avgPrice;

    days.push({
      date: format(date, "yyyy-MM-dd"),
      revenue,
      orders,
      hourlyOrders: generateHourlyOrders(orders, seed + 300),
      topProducts: generateTopProducts(seed + 500, 3),
      paymentBreakdown: generatePaymentBreakdown(revenue, seed + 900),
      deliveryProviderBreakdown: generateDeliveryProviderBreakdown(
        revenue,
        orders,
        seed + 1200,
      ),
    });
  }

  return days;
}

function getDaysCount(preset: DateRangePreset, month?: string): number {
  switch (preset) {
    case "today":
      return 1;
    case "week":
      return 7;
    case "month":
      return getDaysInMonth(parseMonth(month));
  }
}

/* ── public factory ── */

export function generateMockReportData(
  preset: DateRangePreset,
  month?: string,
): IReportData {
  const days = getDaysCount(preset, month);
  const monthStart = parseMonth(month);
  const rand = seededRandom(42 + getSeedFromMonth(monthStart));
  const now = new Date();
  const isFutureMonth = monthStart > startOfMonth(now);

  if (preset === "month") {
    const calendarDays = generateCalendarDays(month);
    const totalRevenue = calendarDays.reduce(
      (sum, day) => sum + day.revenue,
      0,
    );
    const totalOrders = calendarDays.reduce((sum, day) => sum + day.orders, 0);
    const paymentBreakdown = aggregatePaymentBreakdown(
      calendarDays.flatMap((day) => day.paymentBreakdown),
    );
    const averageOrderValue =
      totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

    return {
      summary: {
        totalRevenue,
        totalOrders,
        averageOrderValue,
        deliveryRevenue: Math.round(totalRevenue * 0.18),
      },
      topProducts:
        calendarDays.length > 0
          ? generateTopProducts(getSeedFromMonth(monthStart), 3)
          : [],
      paymentBreakdown,
      calendarDays,
    };
  }

  if (isFutureMonth) {
    return {
      summary: {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        deliveryRevenue: 0,
      },
      topProducts: [],
      paymentBreakdown: [],
    };
  }

  // Scale numbers based on preset
  const baseOrders = preset === "today" ? 42 : 42 * days * (0.8 + rand() * 0.4);
  const totalOrders = Math.round(baseOrders);
  const avgPrice = 80 + Math.floor(rand() * 60);
  const totalRevenue = totalOrders * avgPrice;
  const averageOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  const summary: IReportSummary = {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    deliveryRevenue: Math.round(totalRevenue * 0.18),
  };

  const topProducts = generateTopProducts(99, 3);
  const paymentBreakdown = generatePaymentBreakdown(totalRevenue, 120 + days);

  const result: IReportData = { summary, topProducts, paymentBreakdown };

  return result;
}

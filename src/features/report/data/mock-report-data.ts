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
      topProducts: generateTopProducts(seed + 500, 3),
      paymentBreakdown: generatePaymentBreakdown(revenue, seed + 900),
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
    const totalRevenue = calendarDays.reduce((sum, day) => sum + day.revenue, 0);
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
      },
      topProducts:
        calendarDays.length > 0 ? generateTopProducts(getSeedFromMonth(monthStart), 3) : [],
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
  };

  const topProducts = generateTopProducts(99, 3);
  const paymentBreakdown = generatePaymentBreakdown(totalRevenue, 120 + days);

  const result: IReportData = { summary, topProducts, paymentBreakdown };

  return result;
}

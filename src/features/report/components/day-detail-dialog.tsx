import { format, parseISO } from "date-fns";
import { enUS, th } from "date-fns/locale";
import { useMemo } from "react";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from "recharts";
import type { ICalendarDay } from "@/features/report/types/report.model";
import { useTranslation } from "@/shared/i18n/use-translation";
import { getDeliveryPlatformBrand } from "@/shared/utils/delivery-platform-brands";

interface Props {
  day: ICalendarDay | null;
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number): string =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

interface TimelineTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { label: string; orders: number } }>;
}

interface PaymentPoint {
  label: string;
  amount: number;
  pieColorClassName: string;
  dotColorClassName: string;
}

const PAYMENT_COLOR_CLASSES = [
  { pie: "fill-primary", dot: "bg-primary" },
  { pie: "fill-accent", dot: "bg-accent" },
  { pie: "fill-success", dot: "bg-success" },
] as const;

const TimelineTooltip = ({ active, payload }: TimelineTooltipProps) => {
  const { t } = useTranslation();
  if (!active || !payload?.[0]) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-full bg-text-primary px-3 py-1 text-center">
      <div className="text-caption font-medium text-text-inverse">
        {point.label} · {point.orders} {t("report.detail.orders")}
      </div>
    </div>
  );
};

const getPaymentMethodLabel = (
  method: string,
  t: ReturnType<typeof useTranslation>["t"],
): string => {
  const normalized = method.trim().toLowerCase();

  if (normalized === "cash") return t("report.payment.cash");
  if (normalized === "transfer") return t("report.payment.transfer");

  return method;
};

const DayDetailDialog = ({ day, open, onClose }: Props) => {
  const { t, language } = useTranslation();
  const dateLocale = language === "en" ? enUS : th;

  const avg = day && day.orders > 0 ? Math.round(day.revenue / day.orders) : 0;
  const deliveryRevenue = day
    ? day.deliveryProviderBreakdown.reduce(
        (sum, provider) => sum + provider.amount,
        0,
      )
    : 0;
  const paymentChartData = useMemo<PaymentPoint[]>(() => {
    if (!day) return [];

    const points: PaymentPoint[] = day.paymentBreakdown.map(
      (payment, index) => ({
        label: getPaymentMethodLabel(payment.method, t),
        amount: payment.amount,
        pieColorClassName:
          PAYMENT_COLOR_CLASSES[index % PAYMENT_COLOR_CLASSES.length].pie,
        dotColorClassName:
          PAYMENT_COLOR_CLASSES[index % PAYMENT_COLOR_CLASSES.length].dot,
      }),
    );

    if (deliveryRevenue > 0) {
      const color =
        PAYMENT_COLOR_CLASSES[points.length % PAYMENT_COLOR_CLASSES.length];
      points.push({
        label: t("report.payment.delivery"),
        amount: deliveryRevenue,
        pieColorClassName: color.pie,
        dotColorClassName: color.dot,
      });
    }

    return points;
  }, [day, deliveryRevenue, t]);
  const timelineData = useMemo(
    () =>
      (day?.hourlyOrders ?? []).map((point) => ({
        ...point,
        label: format(new Date(2026, 0, 1, point.hour), "HH:mm", {
          locale: dateLocale,
        }),
      })),
    [dateLocale, day],
  );

  if (!day) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="max-h-[92vh] max-w-[min(96vw,1180px)] p-5 sm:p-6 lg:p-8"
    >
      <DialogHeader>
        <DialogTitle>
          {format(parseISO(day.date), "d MMM yyyy", { locale: dateLocale })}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)] lg:items-start">
        <div className="space-y-6">
          <div className="rounded-card bg-surface/70 p-5 sm:p-6">
            <div className="text-label text-text-secondary">
              {t("report.detail.revenue")}
            </div>
            <div className="mt-1 text-heading font-semibold text-text-primary leading-tight">
              {formatCurrency(day.revenue)}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-label text-text-secondary">
              <span>
                {t("report.detail.orders")}{" "}
                <span className="font-semibold text-text-primary">
                  {day.orders}
                </span>
              </span>
              <span className="text-text-tertiary">|</span>
              <span>
                {t("report.detail.avg")}{" "}
                <span className="font-semibold text-text-primary">
                  {formatCurrency(avg)}
                </span>
              </span>
            </div>
          </div>

          <div className="rounded-card bg-surface/70 p-5 sm:p-6">
            <h4 className="mb-3 text-label font-semibold text-text-primary">
              {t("report.detail.orderTimeline")}
            </h4>
            <div className="h-[160px] w-full rounded-card bg-bg px-2 py-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={timelineData}
                  margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
                  barCategoryGap="40%"
                >
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 10, className: "fill-text-tertiary" }}
                    tickLine={false}
                    axisLine={false}
                    interval={0}
                    minTickGap={0}
                    height={18}
                  />
                  <Tooltip
                    cursor={{
                      className: "fill-primary/10",
                    }}
                    content={<TimelineTooltip />}
                  />
                  <Bar
                    dataKey="orders"
                    className="fill-primary"
                    radius={[6, 6, 6, 6]}
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {day.deliveryProviderBreakdown.length > 0 && (
            <div className="rounded-card bg-surface/70 p-5 sm:p-6">
              <h4 className="mb-3 text-label font-semibold text-text-primary">
                {t("report.detail.deliveryProviders")}
              </h4>
              <div className="space-y-2.5">
                {day.deliveryProviderBreakdown.map((provider) => {
                  const brand = getDeliveryPlatformBrand(provider.provider);

                  return (
                    <div
                      key={provider.provider}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="inline-flex items-center rounded-full px-3 py-1 text-caption font-semibold"
                          style={
                            brand
                              ? {
                                  backgroundColor: brand.brandColor,
                                  color: brand.onColor,
                                }
                              : undefined
                          }
                        >
                          {provider.provider}
                        </span>
                        <span className="text-caption text-text-secondary">
                          {t("report.detail.providerOrders", {
                            count: provider.orders.toLocaleString(),
                          })}
                        </span>
                      </div>
                      <span className="text-label text-text-secondary shrink-0">
                        {formatCurrency(provider.amount)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-card bg-surface/70 p-5 sm:p-6">
            <h4 className="mb-3 text-label font-semibold text-text-primary">
              {t("report.detail.topProducts")}
            </h4>
            <div className="space-y-2.5">
              {day.topProducts.map((product, idx) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-label text-text-secondary shrink-0">
                      {idx + 1}.
                    </span>
                    <span className="truncate text-body-sm text-text-primary">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-label text-text-secondary shrink-0">
                    {product.quantitySold}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card bg-surface/70 p-5 sm:p-6">
            <h4 className="mb-3 text-label font-semibold text-text-primary">
              {t("report.payment.title")}
            </h4>
            <div className="grid gap-4 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-center">
              <div className="mx-auto h-[120px] w-[120px] sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentChartData}
                      dataKey="amount"
                      nameKey="label"
                      innerRadius={28}
                      outerRadius={50}
                      stroke="none"
                      isAnimationActive={false}
                    >
                      {paymentChartData.map((entry) => (
                        <Cell
                          key={entry.label}
                          className={entry.pieColorClassName}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2.5">
                {paymentChartData.map((payment) => (
                  <div
                    key={payment.label}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${payment.dotColorClassName}`}
                      />
                      <span className="text-body-sm text-text-primary">
                        {payment.label}
                      </span>
                    </div>
                    <span className="text-label text-text-secondary shrink-0">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DayDetailDialog;

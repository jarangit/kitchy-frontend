import { useMemo } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { useTranslation } from "@/shared/i18n/use-translation";

const WINDOW_HOURS = 8;

interface Props {
  orders: Array<{ createdAt?: string }>;
}

interface ChartPoint {
  hour: number;
  label: string;
  count: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
}

const pad = (value: number): string => String(value).padStart(2, "0");

const hourLabel = (hour: number): string => `${pad(hour)}:00`;

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  const { t } = useTranslation();
  if (!active || !payload?.[0]) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-full bg-text-primary px-3 py-1 text-center">
      <div className="text-caption font-medium text-text-inverse">
        {point.label} · {point.count} {t("dashboard.orders")}
      </div>
    </div>
  );
};

const TodayOrderTimeline = ({ orders }: Props) => {
  const { t } = useTranslation();

  const chartData = useMemo<ChartPoint[]>(() => {
    const nowHour = new Date().getHours();
    const buckets = Array.from({ length: WINDOW_HOURS }, (_, index) => {
      const hour = (nowHour - WINDOW_HOURS + 1 + index + 24) % 24;
      return { hour, label: hourLabel(hour), count: 0 };
    });

    for (const order of orders) {
      if (!order.createdAt) continue;
      const date = new Date(order.createdAt);
      if (Number.isNaN(date.getTime())) continue;
      const bucket = buckets.find((point) => point.hour === date.getHours());
      if (bucket) bucket.count += 1;
    }
    return buckets;
  }, [orders]);

  if (orders.length === 0) {
    return (
      <div className="flex h-[140px] items-center justify-center rounded-card bg-surface-muted text-body-sm text-text-secondary">
        {t("dashboard.noOrdersToday")}
      </div>
    );
  }

  return (
    <div className="h-[140px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 8, left: 8, bottom: 4 }}
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
            content={<CustomTooltip />}
          />
          <Bar
            dataKey="count"
            className="fill-primary"
            radius={[6, 6, 6, 6]}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TodayOrderTimeline;

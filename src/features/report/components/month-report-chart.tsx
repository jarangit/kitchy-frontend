import { useMemo } from "react";
import { format, parseISO } from "date-fns";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ICalendarDay } from "@/features/report/types/report.model";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  calendarDays: ICalendarDay[];
  onSelectDay: (day: ICalendarDay) => void;
}

const formatCurrency = (value: number): string =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

const formatAxisValue = (value: number): string =>
  new Intl.NumberFormat("th-TH", {
    notation: "compact",
    maximumFractionDigits: value >= 10000 ? 0 : 1,
  }).format(value);

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: ChartPoint }>;
}

interface ChartPoint {
  day: ICalendarDay;
  dateLabel: string;
  revenue: number;
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (!active || !payload?.[0]) return null;

  const point = payload[0].payload;

  return (
    <div className="rounded-card bg-text-primary px-3 py-2 text-center">
      <div className="text-caption text-text-inverse/80">
        {format(parseISO(point.day.date), "MMM dd")}
      </div>
      <div className="text-label font-semibold text-text-inverse">
        {formatCurrency(point.revenue)}
      </div>
    </div>
  );
};

const MonthReportChart = ({ calendarDays, onSelectDay }: Props) => {
  const { t } = useTranslation();

  const chartData = useMemo<ChartPoint[]>(
    () =>
      calendarDays.map((day) => ({
        day,
        revenue: day.revenue,
        dateLabel: format(parseISO(day.date), "d MMM"),
      })),
    [calendarDays],
  );

  if (calendarDays.length === 0) {
    return (
      <div className="p-5 text-body-sm text-text-secondary">
        {t("report.monthly.noData")}
      </div>
    );
  }

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3">
      <div className="mb-1 text-label font-semibold text-text-primary">
        {t("report.monthly.revenueInsights")}
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 12, left: -12, bottom: 8 }}
            onClick={(state: unknown) => {
              const s = state as {
                activePayload?: Array<{ payload: ChartPoint }>;
              };
              if (s?.activePayload?.[0]?.payload?.day) {
                onSelectDay(s.activePayload[0].payload.day);
              }
            }}
            barCategoryGap="32%"
          >
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 10, className: "fill-text-secondary" }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={formatAxisValue}
              tick={{ fontSize: 10, className: "fill-text-secondary" }}
              tickLine={false}
              axisLine={false}
              width={34}
            />
            <Tooltip
              cursor={{
                className: "fill-primary/10",
              }}
              content={<CustomTooltip />}
            />
            <Bar
              dataKey="revenue"
              className="fill-primary"
              radius={[6, 6, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthReportChart;

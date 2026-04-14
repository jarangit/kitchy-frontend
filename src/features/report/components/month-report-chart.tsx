import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import {
  CartesianGrid,
  Dot,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ICalendarDay } from "@/features/report/types/report.model";

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

interface DotProps {
  cx?: number;
  cy?: number;
  payload?: ChartPoint;
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
    <div className="rounded-[10px] bg-[var(--color-text-primary)] px-3 py-2 text-center shadow-lg">
      <div className="text-[10px] text-[var(--color-text-inverse)]/80">
        {format(parseISO(point.day.date), "MMM dd")}
      </div>
      <div className="text-sm font-semibold text-[var(--color-text-inverse)]">
        {formatCurrency(point.revenue)}
      </div>
    </div>
  );
};

const ActiveDot = ({ cx, cy, payload }: DotProps) => {
  if (cx === undefined || cy === undefined || !payload) return null;

  return (
    <Dot
      cx={cx}
      cy={cy}
      r={5}
      fill="var(--color-text-primary)"
      stroke="var(--color-bg)"
      strokeWidth={2}
    />
  );
};

const MonthReportChart = ({ calendarDays, onSelectDay }: Props) => {
  const [activeIndex, setActiveIndex] = useState(Math.max(calendarDays.length - 1, 0));

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
      <div className="p-5 text-sm text-[var(--color-text-secondary)]">
        No report data for this month.
      </div>
    );
  }

  return (
    <div className="px-3 py-2 sm:px-4 sm:py-3">
      <div className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
        Revenue Insights
      </div>

      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 8, right: 12, left: -12, bottom: 8 }}
            onMouseLeave={() => setActiveIndex(chartData.length - 1)}
            onClick={(state) => {
              if (state?.activePayload?.[0]?.payload?.day) {
                onSelectDay(state.activePayload[0].payload.day);
              }
            }}
            onMouseMove={(state) => {
              if (typeof state?.activeTooltipIndex === "number") {
                setActiveIndex(state.activeTooltipIndex);
              }
            }}
          >
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
              dataKey="dateLabel"
              tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
              tickLine={false}
              axisLine={false}
              minTickGap={24}
            />
            <YAxis
              tickFormatter={formatAxisValue}
              tick={{ fontSize: 10, fill: "var(--color-text-secondary)" }}
              tickLine={false}
              axisLine={false}
              width={34}
            />
            <Tooltip
              cursor={{ stroke: "var(--color-text-primary)", strokeDasharray: "3 4" }}
              content={<CustomTooltip />}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-text-primary)"
              strokeWidth={2.5}
              dot={false}
              activeDot={<ActiveDot />}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthReportChart;

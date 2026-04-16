import { useMemo, useState } from "react";
import { format, subMonths } from "date-fns";
import { Link, useParams } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useReportData } from "@/features/report/hooks/useReportData";
import type { DateRangePreset } from "@/features/report/types/report.dto";
import type { ICalendarDay } from "@/features/report/types/report.model";
import TimeSegmentControl from "@/features/report/components/time-segment-control";
import RevenueCard from "@/features/report/components/revenue-card";
import MetricRow from "@/features/report/components/metric-row";
import ReportContextCard from "@/features/report/components/report-context-card";
import MonthReportPanel from "@/features/report/components/month-report-panel";
import DayDetailDialog from "@/features/report/components/day-detail-dialog";

function getSubtitle(preset: DateRangePreset): string {
  switch (preset) {
    case "today":
      return format(new Date(), "MMM d");
    case "week":
      return "Last 7 Days";
    case "month":
      return format(new Date(), "MMMM yyyy");
  }
}

function buildMonthOptions(count: number): { value: string; label: string }[] {
  return Array.from({ length: count }, (_, index) => {
    const monthDate = subMonths(new Date(), index);
    return {
      value: format(monthDate, "yyyy-MM"),
      label: format(monthDate, "MMMM yyyy"),
    };
  });
}

function getRevenueLabel(preset: DateRangePreset): string {
  switch (preset) {
    case "today":
      return "Revenue Today";
    case "week":
      return "Revenue (7 days)";
    case "month":
      return "Revenue (Month)";
  }
}

function getTopProductsTitle(preset: DateRangePreset): string {
  switch (preset) {
    case "today":
      return "Top Products";
    case "week":
      return "Top Products (7 days)";
    case "month":
      return "Top Products";
  }
}

const ReportPage = () => {
  const { id } = useParams<{ id: string }>();
  const [preset, setPreset] = useState<DateRangePreset>("today");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [selectedDay, setSelectedDay] = useState<ICalendarDay | null>(null);
  const monthOptions = useMemo(() => buildMonthOptions(12), []);
  const { data, isLoading, error } = useReportData(preset, selectedMonth);

  const subtitle =
    preset === "month"
      ? monthOptions.find((option) => option.value === selectedMonth)?.label ??
        getSubtitle(preset)
      : getSubtitle(preset);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to={`/store/${id}`}
              className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)]"
            >
              <LuArrowLeft size={20} />
            </Link>
            <h1 className="text-heading font-[var(--weight-bold)] text-[var(--color-text-primary)]">
              Report
            </h1>
          </div>
        </div>
        <div className="bg-[var(--color-danger-bg)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6 text-center">
          <p className="text-[var(--color-danger)]">
            Failed to load report data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to={`/store/${id}`}
              className="w-10 h-10 flex items-center justify-center rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-all duration-[var(--motion-fast)] shrink-0"
            >
              <LuArrowLeft size={20} />
            </Link>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Report
              </h1>
              <p className="text-label text-[var(--color-text-secondary)]">
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <TimeSegmentControl
              value={preset}
              onChange={(nextPreset) => {
                setPreset(nextPreset);
                setSelectedDay(null);
              }}
            />
          </div>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="space-y-4">
          <SkeletonCard className="h-24" />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard className="h-40" />
        </div>
      ) : (
        <>
          <RevenueCard
            value={String(data.summary.totalRevenue)}
            subtitle={getRevenueLabel(preset)}
          />

          <MetricRow
            orders={data.summary.totalOrders}
            averageOrderValue={data.summary.averageOrderValue}
          />

          {preset === "month" && data.calendarDays ? (
            <>
              <MonthReportPanel
                calendarDays={data.calendarDays}
                selectedMonth={selectedMonth}
                monthOptions={monthOptions}
                onChangeMonth={(month) => {
                  setSelectedMonth(month);
                  setSelectedDay(null);
                }}
                onSelectDay={(day) => setSelectedDay(day)}
              />
              <DayDetailDialog
                day={selectedDay}
                open={selectedDay !== null}
                onClose={() => setSelectedDay(null)}
              />
            </>
          ) : (
            <ReportContextCard
              products={data.topProducts}
              paymentBreakdown={data.paymentBreakdown}
              title={getTopProductsTitle(preset)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReportPage;

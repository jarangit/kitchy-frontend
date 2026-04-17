import { useMemo, useState } from "react";
import { format, subMonths } from "date-fns";
import { useParams } from "react-router-dom";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useReportData } from "@/features/report/hooks/useReportData";
import type { DateRangePreset } from "@/features/report/types/report.dto";
import type { ICalendarDay } from "@/features/report/types/report.model";
import TimeSegmentControl from "@/features/report/components/time-segment-control";
import RevenueCard from "@/features/report/components/revenue-card";
import MetricRow from "@/features/report/components/metric-row";
import ReportContextCard from "@/features/report/components/report-context-card";
import MonthReportPanel from "@/features/report/components/month-report-panel";
import DayDetailDialog from "@/features/report/components/day-detail-dialog";

function buildMonthOptions(count: number): { value: string; label: string }[] {
  return Array.from({ length: count }, (_, index) => {
    const monthDate = subMonths(new Date(), index);
    return {
      value: format(monthDate, "yyyy-MM"),
      label: format(monthDate, "MMMM yyyy"),
    };
  });
}

const ReportPage = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const [preset, setPreset] = useState<DateRangePreset>("today");
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "yyyy-MM"));
  const [selectedDay, setSelectedDay] = useState<ICalendarDay | null>(null);
  const monthOptions = useMemo(() => buildMonthOptions(12), []);
  const { data, isLoading, error } = useReportData(preset, selectedMonth);

  const getSubtitle = (): string => {
    switch (preset) {
      case "today":
        return t("report.subtitle.today", { date: format(new Date(), "MMM d") });
      case "week":
        return t("report.subtitle.week");
      case "month": {
        const monthLabel =
          monthOptions.find((option) => option.value === selectedMonth)?.label ??
          format(new Date(), "MMMM yyyy");
        return t("report.subtitle.month", { month: monthLabel });
      }
    }
  };

  const getRevenueLabel = (): string => {
    switch (preset) {
      case "today":
        return t("report.revenue.today");
      case "week":
        return t("report.revenue.week");
      case "month":
        return t("report.revenue.month");
    }
  };

  const getTopProductsTitle = (): string => {
    switch (preset) {
      case "today":
        return t("report.topProducts.today");
      case "week":
        return t("report.topProducts.week");
      case "month":
        return t("report.topProducts.month");
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader backTo={`/store/${id}`} title={t("report.title")} />
        <div className="rounded-card border border-card-border bg-danger-bg p-card-padding text-center">
          <p className="text-danger">{t("report.error")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageHeader
        backTo={`/store/${id}`}
        title={t("report.title")}
        subtitle={getSubtitle()}
        action={
          <TimeSegmentControl
            value={preset}
            onChange={(nextPreset) => {
              setPreset(nextPreset);
              setSelectedDay(null);
            }}
          />
        }
      />

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
            subtitle={getRevenueLabel()}
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
              title={getTopProductsTitle()}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ReportPage;

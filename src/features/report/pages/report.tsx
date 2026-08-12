import { useMemo, useState } from "react";
import { format, subMonths } from "date-fns";
import { useParams } from "react-router-dom";
import TimeSegmentControl from "@/features/report/components/time-segment-control";
import RevenueCard from "@/features/report/components/revenue-card";
import MetricRow from "@/features/report/components/metric-row";
import ReportContextCard from "@/features/report/components/report-context-card";
import MonthReportPanel from "@/features/report/components/month-report-panel";
import DayDetailDialog from "@/features/report/components/day-detail-dialog";
import { useReportData } from "@/features/report/hooks/useReportData";
import type { DateRangePreset } from "@/features/report/types/report.dto";
import type { ICalendarDay } from "@/features/report/types/report.model";
import { PageHeader } from "@/shared/components/ui/page-header";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useLocalSetting } from "@/shared/hooks/use-local-setting";

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
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [preset, setPreset] = useState<DateRangePreset>("month");
  const [selectedMonth, setSelectedMonth] = useState(
    format(new Date(), "yyyy-MM"),
  );
  const [selectedDay, setSelectedDay] = useState<ICalendarDay | null>(null);
  const [dailyRevenueTargetRaw] = useLocalSetting(
    `store.${id}.dailyRevenueTarget`,
    "",
  );
  const monthOptions = useMemo(() => buildMonthOptions(12), []);
  const { data, isLoading, error } = useReportData(preset, selectedMonth);
  const dailyRevenueTarget =
    dailyRevenueTargetRaw.trim().length > 0
      ? Number(dailyRevenueTargetRaw)
      : null;

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

  const subtitle =
    preset === "today"
      ? t("report.subtitle.today", { date: format(new Date(), "d MMM yyyy") })
      : preset === "week"
        ? t("report.subtitle.week")
        : t("report.subtitle.month", {
            month:
              monthOptions.find((option) => option.value === selectedMonth)
                ?.label ?? selectedMonth,
          });

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("report.title")}
        subtitle={subtitle}
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

      {error ? (
        <div className="rounded-card border border-card-border bg-danger-bg p-card-padding text-center">
          <p className="text-danger">{t("report.error")}</p>
        </div>
      ) : isLoading || !data ? (
        <div className="space-y-4">
          <SkeletonCard className="h-24" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <SkeletonCard className="h-40" />
        </div>
      ) : (
        <>
          {preset === "month" && data.calendarDays ? (
            <>
              <MonthReportPanel
                calendarDays={data.calendarDays}
                selectedMonth={selectedMonth}
                monthOptions={monthOptions}
                selectedDay={selectedDay}
                dailyRevenueTarget={dailyRevenueTarget}
                onChangeMonth={(month) => {
                  setSelectedMonth(month);
                  setSelectedDay(null);
                }}
                onSelectDay={(day) => setSelectedDay(day)}
              />
              <RevenueCard
                value={String(data.summary.totalRevenue)}
                subtitle={getRevenueLabel()}
              />
              <MetricRow
                orders={data.summary.totalOrders}
                averageOrderValue={data.summary.averageOrderValue}
              />
              <DayDetailDialog
                day={selectedDay}
                open={selectedDay !== null}
                onClose={() => setSelectedDay(null)}
              />
            </>
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

              <ReportContextCard
                products={data.topProducts}
                paymentBreakdown={data.paymentBreakdown}
                deliveryRevenue={data.summary.deliveryRevenue}
                title={getTopProductsTitle()}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ReportPage;

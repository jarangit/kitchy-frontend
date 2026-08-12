import { useMemo } from "react";
import { format, getDay, getDaysInMonth, parse, startOfMonth } from "date-fns";
import type { ICalendarDay } from "@/features/report/types/report.model";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  calendarDays: ICalendarDay[];
  selectedMonth: string;
  selectedDay: ICalendarDay | null;
  dailyRevenueTarget: number | null;
  onSelectDay: (day: ICalendarDay) => void;
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatCurrency = (value: number): string =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

const MonthReportCalendar = ({
  calendarDays,
  selectedMonth,
  selectedDay,
  dailyRevenueTarget,
  onSelectDay,
}: Props) => {
  const { t } = useTranslation();
  const dayLookup = useMemo(
    () => new Map(calendarDays.map((day) => [day.date, day])),
    [calendarDays],
  );

  const monthStart = startOfMonth(parse(selectedMonth, "yyyy-MM", new Date()));
  const totalDays = getDaysInMonth(monthStart);
  const leadingEmptyCells = getDay(monthStart);
  const todayKey = format(new Date(), "yyyy-MM-dd");

  const cells = Array.from(
    { length: leadingEmptyCells + totalDays },
    (_, index) => {
      if (index < leadingEmptyCells) return null;

      const dayNumber = index - leadingEmptyCells + 1;
      const date = new Date(monthStart);
      date.setDate(dayNumber);
      const dateKey = format(date, "yyyy-MM-dd");

      return {
        dayNumber,
        dateKey,
        data: dayLookup.get(dateKey) ?? null,
        isSelected: selectedDay?.date === dateKey,
        isToday: todayKey === dateKey,
      };
    },
  );

  if (calendarDays.length === 0) {
    return (
      <div className="p-5 text-body-sm text-text-secondary">
        {t("report.monthly.noData")}
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-card bg-info-bg/55 p-3 sm:p-4">
      <div className="grid grid-cols-7 gap-2">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="px-1 text-center text-caption font-medium text-text-tertiary sm:px-2"
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, index) => {
          if (!cell) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-[112px] rounded-card"
              />
            );
          }

          if (!cell.data) {
            return (
              <div
                key={cell.dateKey}
                className="flex min-h-[112px] flex-col rounded-card bg-surface p-2 text-left opacity-60 sm:p-3"
              >
                <div className="text-label font-medium text-text-secondary">
                  {cell.dayNumber}
                </div>
              </div>
            );
          }

          const dayData = cell.data;
          const hasTarget =
            typeof dailyRevenueTarget === "number" && dailyRevenueTarget > 0;
          const variancePercent = hasTarget
            ? ((dayData.revenue - dailyRevenueTarget) / dailyRevenueTarget) *
              100
            : null;
          const varianceLabel =
            variancePercent === null
              ? t("report.monthly.noTarget")
              : `${variancePercent >= 0 ? "+" : ""}${Math.round(variancePercent)}%`;
          const varianceClassName =
            variancePercent === null
              ? "text-text-tertiary"
              : variancePercent >= 0
                ? "text-success"
                : "text-danger";

          return (
            <button
              key={cell.dateKey}
              type="button"
              onClick={() => onSelectDay(dayData)}
              className={
                cell.isSelected
                  ? "flex min-h-[112px] flex-col rounded-card bg-card-bg p-2 text-left shadow-sm ring-1 ring-accent/40 transition-colors sm:p-3"
                  : "flex min-h-[112px] flex-col rounded-card bg-card-bg p-2 text-left shadow-sm transition-colors hover:bg-surface-hover sm:p-3"
              }
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-label font-semibold text-text-primary">
                  {cell.dayNumber}
                </span>
                {cell.isToday && (
                  <span className="rounded-full bg-info-bg px-2 py-0.5 text-[10px] font-medium text-info">
                    {t("report.monthly.today")}
                  </span>
                )}
              </div>

              <div className="mt-3 text-[11px] text-text-tertiary sm:text-caption">
                {t("report.monthly.revenue")}
              </div>
              <div
                className={`truncate text-body font-semibold sm:text-title leading-tight ${varianceClassName}`}
              >
                {formatCurrency(dayData.revenue)}
              </div>

              <div className="mt-2 text-[11px] text-text-tertiary sm:text-caption">
                {t("report.monthly.orders", {
                  count: dayData.orders.toLocaleString(),
                })}
              </div>

              <div
                className={`mt-auto truncate pt-2 text-caption font-medium ${varianceClassName}`}
              >
                {varianceLabel}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MonthReportCalendar;

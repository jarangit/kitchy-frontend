import { useState } from "react";
import type { ICalendarDay } from "@/features/report/types/report.model";
import { Select } from "@/shared/components/ui/select";
import MonthReportTable from "@/features/report/components/month-report-table";
import MonthReportChart from "@/features/report/components/month-report-chart";

type MonthViewMode = "table" | "chart";

const viewOptions: { key: MonthViewMode; label: string }[] = [
  { key: "table", label: "Table View" },
  { key: "chart", label: "Line Chart" },
];

interface Props {
  calendarDays: ICalendarDay[];
  selectedMonth: string;
  monthOptions: { value: string; label: string }[];
  onChangeMonth: (month: string) => void;
  onSelectDay: (day: ICalendarDay) => void;
}

const formatCurrency = (value: number): string =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

const MonthReportPanel = ({
  calendarDays,
  selectedMonth,
  monthOptions,
  onChangeMonth,
  onSelectDay,
}: Props) => {
  const [viewMode, setViewMode] = useState<MonthViewMode>("table");
  const totalRevenue = calendarDays.reduce((sum, day) => sum + day.revenue, 0);
  const totalOrders = calendarDays.reduce((sum, day) => sum + day.orders, 0);

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-[var(--color-text-primary)]">
              Monthly Report
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-text-secondary)]">
              <span>{formatCurrency(totalRevenue)} revenue</span>
              <span className="text-[var(--color-text-tertiary)]">&middot;</span>
              <span>{totalOrders.toLocaleString()} orders</span>
              <span className="text-[var(--color-text-tertiary)]">&middot;</span>
              <span>{calendarDays.length} active days</span>
            </div>
          </div>

          <div className="w-full lg:w-[220px]">
            <Select
              aria-label="Filter report by month"
              value={selectedMonth}
              options={monthOptions}
              onChange={(event) => onChangeMonth(event.target.value)}
            />
          </div>
        </div>

        <div className="inline-flex w-full sm:w-auto bg-[var(--color-bg)] border border-[var(--color-border)] rounded-full p-1 overflow-x-auto">
          {viewOptions.map((option) => {
            const isActive = viewMode === option.key;

            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setViewMode(option.key)}
                className={`
                  h-8 px-4 rounded-full text-sm font-medium whitespace-nowrap flex-1 sm:flex-none
                  transition-all duration-[var(--motion-fast)]
                  ${
                    isActive
                      ? "bg-[var(--color-primary)] text-[var(--color-text-inverse)]"
                      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {viewMode === "table" ? (
        <MonthReportTable calendarDays={calendarDays} onSelectDay={onSelectDay} />
      ) : (
        <MonthReportChart calendarDays={calendarDays} onSelectDay={onSelectDay} />
      )}
    </div>
  );
};

export default MonthReportPanel;

import { type JSX, useState } from "react";
import { LuChartBar, LuList } from "react-icons/lu";
import type { ICalendarDay } from "@/features/report/types/report.model";
import { Card } from "@/shared/components/ui/card";
import { Select } from "@/shared/components/ui/select";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
import MonthReportTable from "@/features/report/components/month-report-table";
import MonthReportChart from "@/features/report/components/month-report-chart";

type MonthViewMode = "table" | "chart";

const viewOptions: {
  key: MonthViewMode;
  label: JSX.Element;
}[] = [
  { key: "table", label: <LuList size={16} /> },
  { key: "chart", label: <LuChartBar size={16} /> },
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
    <Card className="overflow-hidden p-0">
      <div className="border-b border-border p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <h3 className="text-body font-semibold text-text-primary">
              Monthly Report
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-label text-text-secondary">
              <span>{formatCurrency(totalRevenue)} revenue</span>
              <span className="text-text-tertiary">&middot;</span>
              <span>{totalOrders.toLocaleString()} orders</span>
              <span className="text-text-tertiary">&middot;</span>
              <span>{calendarDays.length} active days</span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:justify-end">
            <div className="min-w-0 flex-1 sm:min-w-[220px] sm:flex-none">
              <Select
                aria-label="Filter report by month"
                value={selectedMonth}
                options={monthOptions}
                onChange={(event) => onChangeMonth(event.target.value)}
              />
            </div>

            <Tabs
              value={viewMode}
              onChange={(v) => setViewMode(v as MonthViewMode)}
              variant="segmented"
              className="shrink-0 self-end sm:self-auto"
            >
              <TabList>
                {viewOptions.map((opt) => (
                  <Tab key={opt.key} value={opt.key}>
                    {opt.label}
                  </Tab>
                ))}
              </TabList>
            </Tabs>
          </div>
        </div>
      </div>

      {viewMode === "table" ? (
        <MonthReportTable calendarDays={calendarDays} onSelectDay={onSelectDay} />
      ) : (
        <MonthReportChart calendarDays={calendarDays} onSelectDay={onSelectDay} />
      )}
    </Card>
  );
};

export default MonthReportPanel;

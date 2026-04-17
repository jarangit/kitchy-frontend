import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import type { ICalendarDay } from "@/features/report/types/report.model";

type SortKey = "date" | "revenue" | "orders" | "averageOrderValue" | "topProduct";
type SortDirection = "asc" | "desc";

interface Props {
  calendarDays: ICalendarDay[];
  onSelectDay: (day: ICalendarDay) => void;
}

const formatCurrency = (value: number): string =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

const MonthReportTable = ({
  calendarDays,
  onSelectDay,
}: Props) => {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const sortedDays = useMemo(() => {
    const factor = sortDirection === "asc" ? 1 : -1;

    return [...calendarDays].sort((a, b) => {
      switch (sortKey) {
        case "date":
          return (parseISO(a.date).getTime() - parseISO(b.date).getTime()) * factor;
        case "revenue":
          return (a.revenue - b.revenue) * factor;
        case "orders":
          return (a.orders - b.orders) * factor;
        case "averageOrderValue": {
          const avgA = a.orders > 0 ? a.revenue / a.orders : 0;
          const avgB = b.orders > 0 ? b.revenue / b.orders : 0;
          return (avgA - avgB) * factor;
        }
        case "topProduct": {
          const nameA = a.topProducts[0]?.name ?? "";
          const nameB = b.topProducts[0]?.name ?? "";
          return nameA.localeCompare(nameB) * factor;
        }
      }
    });
  }, [calendarDays, sortDirection, sortKey]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("desc");
  };

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;

    return sortDirection === "asc" ? (
      <LuChevronUp size={14} className="text-text-tertiary" />
    ) : (
      <LuChevronDown size={14} className="text-text-tertiary" />
    );
  };

  return (
    <div>
      {calendarDays.length === 0 ? (
        <div className="p-5 text-body-sm text-text-secondary">
          No report data for this month.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="px-5 py-3 text-left text-caption font-[var(--weight-semibold)] uppercase tracking-wide text-text-tertiary">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
                    onClick={() => handleSort("date")}
                  >
                    <span>Date</span>
                    {renderSortIcon("date")}
                  </button>
                </th>
                <th className="px-5 py-3 text-left text-caption font-[var(--weight-semibold)] uppercase tracking-wide text-text-tertiary">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
                    onClick={() => handleSort("revenue")}
                  >
                    <span>Revenue</span>
                    {renderSortIcon("revenue")}
                  </button>
                </th>
                <th className="px-5 py-3 text-left text-caption font-[var(--weight-semibold)] uppercase tracking-wide text-text-tertiary">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
                    onClick={() => handleSort("orders")}
                  >
                    <span>Orders</span>
                    {renderSortIcon("orders")}
                  </button>
                </th>
                <th className="px-5 py-3 text-left text-caption font-[var(--weight-semibold)] uppercase tracking-wide text-text-tertiary">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
                    onClick={() => handleSort("averageOrderValue")}
                  >
                    <span>Avg / Order</span>
                    {renderSortIcon("averageOrderValue")}
                  </button>
                </th>
                <th className="px-5 py-3 text-left text-caption font-[var(--weight-semibold)] uppercase tracking-wide text-text-tertiary">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 transition-colors duration-[var(--motion-fast)] hover:text-text-primary"
                    onClick={() => handleSort("topProduct")}
                  >
                    <span>Top Product</span>
                    {renderSortIcon("topProduct")}
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDays.map((day) => {
                const avg = day.orders > 0 ? Math.round(day.revenue / day.orders) : 0;
                const topProduct = day.topProducts[0]?.name ?? "-";

                return (
                  <tr
                    key={day.date}
                    className="border-b border-border last:border-b-0 cursor-pointer transition-colors duration-[var(--motion-fast)] hover:bg-primary-bg"
                    onClick={() => onSelectDay(day)}
                  >
                    <td className="px-5 py-4 text-label text-text-primary whitespace-nowrap">
                      {format(parseISO(day.date), "d MMM yyyy")}
                    </td>
                    <td className="px-5 py-4 text-body-sm text-text-primary whitespace-nowrap">
                      {formatCurrency(day.revenue)}
                    </td>
                    <td className="px-5 py-4 text-body-sm text-text-primary whitespace-nowrap">
                      {day.orders.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 text-body-sm text-text-primary whitespace-nowrap">
                      {formatCurrency(avg)}
                    </td>
                    <td className="px-5 py-4 text-body-sm text-text-secondary max-w-[240px] truncate">
                      {topProduct}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MonthReportTable;

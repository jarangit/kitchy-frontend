import { useState } from "react";
import { format, parseISO } from "date-fns";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumn,
  type SortingState,
} from "@/shared/components/ui/data-table";
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

const MonthReportTable = ({ calendarDays, onSelectDay }: Props) => {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "date", desc: true },
  ]);

  const columns: DataTableColumn<ICalendarDay>[] = [
    {
      id: "date",
      accessorFn: (d) => parseISO(d.date).getTime(),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-label text-text-primary">
          {format(parseISO(row.original.date), "d MMM yyyy")}
        </span>
      ),
    },
    {
      id: "revenue",
      accessorFn: (d) => d.revenue,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Revenue" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-body-sm text-text-primary">
          {formatCurrency(row.original.revenue)}
        </span>
      ),
    },
    {
      id: "orders",
      accessorFn: (d) => d.orders,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Orders" />
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-body-sm text-text-primary">
          {row.original.orders.toLocaleString()}
        </span>
      ),
    },
    {
      id: "averageOrderValue",
      accessorFn: (d) => (d.orders > 0 ? d.revenue / d.orders : 0),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Avg / Order" />
      ),
      meta: { hideBelow: "md" },
      cell: ({ row }) => {
        const day = row.original;
        const avg = day.orders > 0 ? Math.round(day.revenue / day.orders) : 0;
        return (
          <span className="whitespace-nowrap text-body-sm text-text-primary">
            {formatCurrency(avg)}
          </span>
        );
      },
    },
    {
      id: "topProduct",
      accessorFn: (d) => d.topProducts[0]?.name ?? "",
      sortingFn: (a, b) =>
        (a.original.topProducts[0]?.name ?? "").localeCompare(
          b.original.topProducts[0]?.name ?? "",
        ),
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Top Product" />
      ),
      meta: { hideBelow: "lg" },
      cell: ({ row }) => (
        <span className="block max-w-[240px] truncate text-body-sm text-text-secondary">
          {row.original.topProducts[0]?.name ?? "-"}
        </span>
      ),
    },
  ];

  return (
    <DataTable<ICalendarDay>
      data={calendarDays}
      columns={columns}
      sorting={sorting}
      onSortingChange={setSorting}
      onRowClick={onSelectDay}
      getRowId={(d) => d.date}
      emptyState={
        <span className="text-body-sm text-text-secondary">
          No report data for this month.
        </span>
      }
    />
  );
};

export default MonthReportTable;

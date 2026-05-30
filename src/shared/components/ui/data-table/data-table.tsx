import type { ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type OnChangeFn,
  type Row,
} from "@tanstack/react-table";
import { cn } from "@/shared/utils/cn";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import type {
  DataTableColumn,
  DataTableColumnMeta,
  ResponsiveBreakpoint,
  SortingState,
} from "./data-table.types";

const hideBelowClass: Record<ResponsiveBreakpoint, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
};

function getMeta(
  col: { columnDef: { meta?: unknown } } | undefined,
): DataTableColumnMeta {
  if (!col) return {};
  return (col.columnDef.meta as DataTableColumnMeta | undefined) ?? {};
}

export interface DataTableProps<TData> {
  data: TData[];
  columns: DataTableColumn<TData>[];
  /** Controlled sorting state. If omitted, columns cannot be sorted. */
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  /** Click handler per row. Clicks inside columns with meta.preventRowClick are ignored. */
  onRowClick?: (row: TData) => void;
  /** Stable row id resolver (e.g. (r) => r.id). Helps TanStack reconcile rows. */
  getRowId?: (row: TData, index: number) => string;
  /** If true, renders skeleton rows instead of data. */
  isLoading?: boolean;
  loadingRowCount?: number;
  /** Rendered when data is empty and not loading. */
  emptyState?: ReactNode;
  className?: string;
  /** Reserved for future; currently renders no sticky styles to keep v1 simple. */
  stickyHeader?: boolean;
}

/**
 * Shared config-driven DataTable. Feature owns data + sorting state; this
 * component only renders. Use DataTableColumnHeader inside column.header for
 * consistent sort UI.
 */
export function DataTable<TData>({
  data,
  columns,
  sorting,
  onSortingChange,
  onRowClick,
  getRowId,
  isLoading = false,
  loadingRowCount = 5,
  emptyState,
  className,
}: DataTableProps<TData>) {
  const enableSorting = !!onSortingChange;

  const table = useReactTable({
    data,
    columns,
    state: sorting ? { sorting } : undefined,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getRowId,
    enableSorting,
  });

  const headerGroups = table.getHeaderGroups();
  const rows = table.getRowModel().rows;
  const columnCount = columns.length;

  const handleRowClick = (event: React.MouseEvent<HTMLTableRowElement>, row: Row<TData>) => {
    if (!onRowClick) return;
    // Ignore clicks that were targeted at interactive elements marked with data-stop-row-click
    const target = event.target as HTMLElement | null;
    if (target?.closest("[data-stop-row-click='true']")) return;
    onRowClick(row.original);
  };

  return (
    <Table className={className}>
      <TableHeader>
        {headerGroups.map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => {
              const meta = getMeta(header.column);
              const alignClass =
                meta.align === "right"
                  ? "text-right"
                  : meta.align === "center"
                    ? "text-center"
                    : "text-left";
              const wrapClass = meta.wrap ? "whitespace-normal" : "whitespace-nowrap";
              return (
                <TableHead
                  key={header.id}
                  align={meta.align}
                  className={cn(
                    alignClass,
                    wrapClass,
                    meta.className,
                    meta.hideBelow && hideBelowClass[meta.hideBelow],
                  )}
                  aria-sort={
                    header.column.getCanSort()
                      ? header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : "none"
                      : undefined
                  }
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: loadingRowCount }).map((_, i) => (
            <TableRow key={`skeleton-${i}`}>
              {columns.map((col, j) => {
                const meta = (col.meta as DataTableColumnMeta | undefined) ?? {};
                return (
                  <TableCell
                    key={j}
                    align={meta.align}
                    className={cn(
                      meta.wrap ? "whitespace-normal" : "whitespace-nowrap",
                      meta.className,
                      meta.hideBelow && hideBelowClass[meta.hideBelow],
                    )}
                  >
                    <Skeleton height="h-4" width="w-3/4" />
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        ) : rows.length === 0 ? (
          <tr>
            <td colSpan={columnCount} className="px-4 py-12 text-center">
              {emptyState ?? (
                <span className="text-body-sm text-text-secondary">No data</span>
              )}
            </td>
          </tr>
        ) : (
          rows.map((row) => (
            <TableRow
              key={row.id}
              clickable={!!onRowClick}
              onClick={onRowClick ? (e) => handleRowClick(e, row) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={
                onRowClick
                  ? (e) => {
                      if (e.key === "Enter") onRowClick(row.original);
                    }
                  : undefined
              }
            >
              {row.getVisibleCells().map((cell) => {
                const meta = getMeta(cell.column);
                return (
                  <TableCell
                    key={cell.id}
                    align={meta.align}
                    className={cn(
                      meta.wrap ? "whitespace-normal" : "whitespace-nowrap",
                      meta.className,
                      meta.hideBelow && hideBelowClass[meta.hideBelow],
                    )}
                    data-stop-row-click={meta.preventRowClick ? "true" : undefined}
                    onClick={
                      meta.preventRowClick
                        ? (e) => e.stopPropagation()
                        : undefined
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                );
              })}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}

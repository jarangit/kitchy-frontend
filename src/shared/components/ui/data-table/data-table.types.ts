import type { ColumnDef, SortingState } from "@tanstack/react-table";

export type ResponsiveBreakpoint = "sm" | "md" | "lg" | "xl";
export type CellAlign = "left" | "right" | "center";

export interface DataTableColumnMeta {
  /** Hide this column below the given breakpoint (applies to both <th> and <td>). */
  hideBelow?: ResponsiveBreakpoint;
  /** Text alignment for cell + header. */
  align?: CellAlign;
  /** Optional Tailwind class that controls width (e.g. "w-16", "w-28"). */
  className?: string;
  /** Allow content to wrap instead of forcing a single line. */
  wrap?: boolean;
  /** If true, clicks on cells in this column do not trigger row click. */
  preventRowClick?: boolean;
}

/** A column definition for the shared DataTable. Wraps TanStack's ColumnDef with our meta. */
export type DataTableColumn<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  meta?: DataTableColumnMeta;
};

export type { SortingState };

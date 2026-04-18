import type { Column } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { LuChevronDown, LuChevronUp, LuChevronsUpDown } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import type { CellAlign } from "./data-table.types";

interface DataTableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>;
  title: ReactNode;
  align?: CellAlign;
  className?: string;
}

/**
 * Sortable header button bound to a TanStack `Column`. If the column is not
 * sortable, it just renders the plain title.
 */
export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  align = "left",
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const sortable = column.getCanSort();

  if (!sortable) {
    return (
      <span
        className={cn(
          "text-label font-[var(--weight-medium)] text-text-secondary",
          className,
        )}
      >
        {title}
      </span>
    );
  }

  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      onClick={() => column.toggleSorting()}
      className={cn(
        "inline-flex items-center gap-1.5 cursor-pointer",
        "text-label font-[var(--weight-medium)] text-text-secondary",
        "hover:text-text-primary transition-colors duration-[var(--motion-fast)]",
        align === "right" && "flex-row-reverse",
        className,
      )}
    >
      <span>{title}</span>
      {sorted === "asc" ? (
        <LuChevronUp className="h-3.5 w-3.5" />
      ) : sorted === "desc" ? (
        <LuChevronDown className="h-3.5 w-3.5" />
      ) : (
        <LuChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
      )}
    </button>
  );
}

import type {
  HTMLAttributes,
  ReactNode,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { LuChevronDown, LuChevronUp, LuChevronsUpDown } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";

export function Table({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-card border border-card-border bg-card-bg">
      <table
        className={cn("w-full border-collapse text-left", className)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function TableHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn(
        "bg-surface-muted/40 border-b border-card-border",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn("divide-y divide-card-border", className)} {...props}>
      {children}
    </tbody>
  );
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  clickable?: boolean;
}

export function TableRow({
  clickable = false,
  className,
  children,
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors duration-[var(--motion-fast)]",
        clickable &&
          "cursor-pointer hover:bg-surface-muted/40 focus-within:bg-surface-muted/40",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

type SortDirection = "asc" | "desc" | null;

interface TableHeadProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sortDirection?: SortDirection;
  onSort?: () => void;
  align?: "left" | "right" | "center";
}

export function TableHead({
  sortable = false,
  sortDirection = null,
  onSort,
  align = "left",
  className,
  children,
  ...props
}: TableHeadProps) {
  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";

  const content: ReactNode = sortable ? (
    <button
      type="button"
      onClick={onSort}
      className={cn(
        "inline-flex items-center gap-1.5 cursor-pointer",
        "text-label font-[var(--weight-medium)] text-text-secondary",
        "hover:text-text-primary transition-colors duration-[var(--motion-fast)]",
        align === "right" && "flex-row-reverse",
      )}
    >
      <span>{children}</span>
      {sortDirection === "asc" ? (
        <LuChevronUp className="h-3.5 w-3.5" />
      ) : sortDirection === "desc" ? (
        <LuChevronDown className="h-3.5 w-3.5" />
      ) : (
        <LuChevronsUpDown className="h-3.5 w-3.5 opacity-60" />
      )}
    </button>
  ) : (
    <span className="text-label font-[var(--weight-medium)] text-text-secondary">
      {children}
    </span>
  );

  return (
    <th
      scope="col"
      className={cn("px-4 py-3 whitespace-nowrap", alignClass, className)}
      aria-sort={
        sortable
          ? sortDirection === "asc"
            ? "ascending"
            : sortDirection === "desc"
              ? "descending"
              : "none"
          : undefined
      }
      {...props}
    >
      {content}
    </th>
  );
}

interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement> {
  align?: "left" | "right" | "center";
}

export function TableCell({
  align = "left",
  className,
  children,
  ...props
}: TableCellProps) {
  const alignClass =
    align === "right"
      ? "text-right"
      : align === "center"
        ? "text-center"
        : "text-left";
  return (
    <td
      className={cn(
        "px-4 py-3 text-body text-text-primary align-middle",
        alignClass,
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}

import { Link } from "react-router-dom";
import { LuChevronRight } from "react-icons/lu";
import { Badge } from "@/shared/components/ui/badge";
import { cn } from "@/shared/utils/cn";

export type OperationsRowTone = "default" | "warning" | "success";

export interface OperationsStatusRowProps {
  orderNumber: string;
  timeLabel: string;
  itemCountLabel?: string;
  badgeLabel?: string;
  badgeTone?: OperationsRowTone;
  trailingLabel?: string;
  trailingVariant?: "chevron" | "text";
  to?: string;
}

const badgeVariantMap: Record<
  OperationsRowTone,
  "default" | "warning" | "success"
> = {
  default: "default",
  warning: "warning",
  success: "success",
};

export function OperationsStatusRow({
  orderNumber,
  timeLabel,
  itemCountLabel,
  badgeLabel,
  badgeTone = "default",
  trailingLabel,
  trailingVariant = "text",
  to,
}: OperationsStatusRowProps) {
  const content = (
    <>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold leading-5 text-text-primary">
            #{orderNumber}
          </p>
          <p className="text-caption leading-4 text-text-tertiary">
            {timeLabel}
          </p>
        </div>
        {itemCountLabel ? (
          <p className="shrink-0 pt-0.5 text-caption leading-5 text-text-tertiary">
            {itemCountLabel}
          </p>
        ) : null}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {badgeLabel ? (
          <Badge
            variant={badgeVariantMap[badgeTone]}
            size="sm"
            className="shrink-0"
          >
            {badgeLabel}
          </Badge>
        ) : null}
        {trailingVariant === "chevron" ? (
          <span className="inline-flex h-6 w-6 items-center justify-center text-text-tertiary">
            <LuChevronRight size={16} aria-hidden="true" />
          </span>
        ) : trailingLabel ? (
          <span className="min-w-12 text-right text-caption leading-5 text-text-tertiary">
            {trailingLabel}
          </span>
        ) : null}
      </div>
    </>
  );

  const rowClass = cn(
    "flex w-full items-center justify-between gap-3 border-b border-border/60 px-1 py-3 last:border-b-0",
    to && "transition-colors duration-fast hover:bg-surface-muted/60",
  );

  if (to) {
    return (
      <Link to={to} className={cn(rowClass, "rounded-segment")}>
        {content}
      </Link>
    );
  }

  return <div className={rowClass}>{content}</div>;
}

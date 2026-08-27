import { Link } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import {
  OperationsStatusRow,
  type OperationsStatusRowProps,
} from "./operations-status-row";

export type OperationsColumnTone = "default" | "warning" | "success";

export interface OperationsStatusColumnProps {
  title: string;
  count: number;
  tone: OperationsColumnTone;
  rows: OperationsStatusRowProps[];
  viewAllTo?: string;
  viewAllLabel?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}

const toneTopBorder: Record<OperationsColumnTone, string> = {
  default: "border-t-border",
  warning: "border-t-warning-border",
  success: "border-t-success-border",
};

export function OperationsStatusColumn({
  title,
  count,
  tone,
  rows,
  viewAllTo,
  viewAllLabel,
  emptyTitle,
  emptyDescription,
  className,
}: OperationsStatusColumnProps) {
  const { t } = useTranslation();
  const label = viewAllLabel ?? t("dashboard.operations.viewAll");

  return (
    <Card
      padding="none"
      className={cn(
        "flex min-h-64 flex-col overflow-hidden border-t-2 shadow-sm",
        toneTopBorder[tone],
        className,
      )}
    >
      <div className="border-b border-border/70 px-4 py-3">
        <h3 className="text-body font-semibold leading-6 text-text-primary">
          {title} ({count})
        </h3>
      </div>

      <div className="flex flex-1 flex-col px-4">
        {rows.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 py-10 text-center">
            <p className="text-body-sm font-medium text-text-secondary">
              {emptyTitle ?? t("dashboard.operations.emptyTitle")}
            </p>
            <p className="max-w-48 text-caption leading-5 text-text-tertiary">
              {emptyDescription ?? t("dashboard.operations.emptyDescription")}
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {rows.map((row) => (
              <OperationsStatusRow
                key={row.orderNumber + row.timeLabel}
                {...row}
              />
            ))}
          </div>
        )}
      </div>

      {viewAllTo ? (
        <div className="px-4 pb-3 pt-3">
          <Link
            to={viewAllTo}
            className="flex w-full justify-center rounded-full px-3 py-2 text-body-sm font-medium text-info transition-colors duration-fast hover:bg-surface-muted"
          >
            {label}
          </Link>
        </div>
      ) : null}
    </Card>
  );
}

import { useId, useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";
import { Button } from "@/shared/components/ui/button";
import {
  OperationsProgressStrip,
  type OperationsProgressStage,
} from "./operations-progress-strip";
import {
  OperationsStatusColumn,
  type OperationsStatusColumnProps,
} from "./operations-status-column";

export interface StoreOperationsOverviewProps {
  stages: OperationsProgressStage[];
  columns: OperationsStatusColumnProps[];
  defaultExpanded?: boolean;
}

export function StoreOperationsOverview({
  stages,
  columns,
  defaultExpanded = false,
}: StoreOperationsOverviewProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const contentId = useId();

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-caption font-medium tracking-wide text-text-tertiary">
            {t("dashboard.operations.eyebrow")}
          </p>
          <h2 className="text-heading font-semibold tracking-tight text-text-primary">
            {t("dashboard.operations.title")}
          </h2>
        </div>

        <Button
          variant="ghost"
          size="sm"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          onClick={() => setIsExpanded((prev) => !prev)}
          className="shrink-0 gap-1.5"
        >
          {isExpanded ? (
            <LuChevronUp size={16} aria-hidden="true" />
          ) : (
            <LuChevronDown size={16} aria-hidden="true" />
          )}
          <span>
            {isExpanded
              ? t("dashboard.operations.collapse")
              : t("dashboard.operations.expand")}
          </span>
        </Button>
      </div>

      <OperationsProgressStrip stages={stages} />

      {isExpanded ? (
        <div id={contentId} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {columns.map((col) => (
            <OperationsStatusColumn key={col.title} {...col} />
          ))}
        </div>
      ) : null}
    </section>
  );
}

import { useTranslation } from "@/shared/i18n/use-translation";
import {
  OperationsProgressStrip,
  type OperationsProgressStage,
} from "./operations-progress-strip";

export interface StoreOperationsOverviewProps {
  stages: OperationsProgressStage[];
}

export function StoreOperationsOverview({
  stages,
}: StoreOperationsOverviewProps) {
  const { t } = useTranslation();

  return (
    <section className="space-y-4">
      <div className="space-y-1">
        <p className="text-caption font-medium tracking-wide text-text-tertiary">
          {t("dashboard.operations.eyebrow")}
        </p>
        <h2 className="text-heading font-semibold tracking-tight text-text-primary">
          {t("dashboard.operations.title")}
        </h2>
      </div>

      <OperationsProgressStrip stages={stages} />
    </section>
  );
}

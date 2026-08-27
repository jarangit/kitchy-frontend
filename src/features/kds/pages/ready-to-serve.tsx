import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuChefHat } from "react-icons/lu";
import Layout from "@/shared/components/layout/layout";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useReadyToServeItems } from "@/features/kds/hooks/use-ready-to-serve";
import { ReadyToServeList } from "@/features/kds/components/ready-to-serve-list";
import { useReadyToServeActions } from "@/features/kds/hooks/use-ready-to-serve-actions";
import {
  readReadyToServeDismissed,
  writeReadyToServeDismissed,
} from "@/features/kds/utils/ready-to-serve-dismissed";
import { appBus } from "@/shared/events/app-events";

function ReadyToServePageContent() {
  const navigate = useNavigate();
  const { id: storeId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { items, count } = useReadyToServeItems();
  const [dismissed, setDismissed] = useState<Set<string>>(() =>
    readReadyToServeDismissed(storeId),
  );

  useEffect(() => {
    setDismissed(readReadyToServeDismissed(storeId));
  }, [storeId]);

  const visibleItems = useMemo(
    () => items.filter((item) => !dismissed.has(item.id)),
    [dismissed, items],
  );

  const dismissItem = (itemId: string) => {
    setDismissed((prev) => {
      const next = new Set(prev);
      next.add(itemId);
      writeReadyToServeDismissed(storeId, next);
      appBus.emit("ui:readyToServeDismissed", { itemId });
      return next;
    });
  };

  const { servingIds, markServed } = useReadyToServeActions(dismissItem);

  return (
    <div className="space-y-5">
      <PageHeader
        backTo={storeId ? `/store/${storeId}/kds` : true}
        title={t("serve.drawer.title")}
        subtitle={t("serve.page.subtitle", {
          count: String(visibleItems.length),
        })}
      />

      <Card className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-warning-bg text-warning">
          <LuChefHat size={18} />
        </span>
        <div>
          <p className="text-body font-medium text-text-primary">
            {t("serve.page.summaryTitle")}
          </p>
          <p className="text-body-sm text-text-secondary">
            {t("serve.page.summaryDescription", {
              count: String(visibleItems.length),
              total: String(count),
            })}
          </p>
        </div>
      </Card>

      <ReadyToServeList
        items={visibleItems}
        servingIds={servingIds}
        onServed={(item) => void markServed(item)}
        onOpenKds={() => {
          if (storeId) navigate(`/store/${storeId}/kds`);
        }}
      />
    </div>
  );
}

export default function ReadyToServePage() {
  return (
    <Layout>
      <ReadyToServePageContent />
    </Layout>
  );
}

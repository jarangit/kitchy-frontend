import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/shared/components/layout/layout";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useReadyToServeItems } from "@/features/kds/hooks/use-ready-to-serve";
import { ReadyToServeGrid } from "@/features/kds/components/ready-to-serve-grid";
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
  const { items } = useReadyToServeItems();
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
    <div className="space-y-6">
      <PageHeader
        backTo={storeId ? `/store/${storeId}/kds` : true}
        title={t("serve.drawer.title")}
        subtitle={t("serve.page.subtitle", {
          count: String(visibleItems.length),
        })}
      />

      <ReadyToServeGrid
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

import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "@/shared/components/layout/layout";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useServeBoardItems } from "@/features/kds/hooks/use-ready-to-serve";
import { ReadyToServeGrid } from "@/features/kds/components/ready-to-serve-grid";
import { useReadyToServeActions } from "@/features/kds/hooks/use-ready-to-serve-actions";
import { readReadyToServeDismissed } from "@/features/kds/utils/ready-to-serve-dismissed";

function ReadyToServePageContent() {
  const { id: storeId } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { items } = useServeBoardItems();
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

  const readyCount = useMemo(
    () => visibleItems.filter((item) => item.status === "READY").length,
    [visibleItems],
  );

  // Served items stay visible with their SERVED status (no auto-dismiss),
  // so every item shows its own state on this board.
  const { servingIds, markServed } = useReadyToServeActions();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 p-card-padding">
      <PageHeader title={`${t("serve.drawer.title")} (${readyCount})`} />

      <ReadyToServeGrid
        items={visibleItems}
        servingIds={servingIds}
        onServed={(item) => void markServed(item)}
        storeId={storeId}
      />
    </div>
  );
}

export default function ReadyToServePage() {
  return (
    <Layout noPadding fullViewport>
      <ReadyToServePageContent />
    </Layout>
  );
}

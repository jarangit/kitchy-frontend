import { LuCheck, LuExternalLink } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { Card } from "@/shared/components/ui/card";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { ReadyToServeItem } from "@/features/kds/hooks/use-ready-to-serve";

const getItemContext = (item: ReadyToServeItem) => {
  if (item.orderType === "DINE_IN" && item.tableNumber) {
    return `Table ${item.tableNumber}`;
  }
  if (item.orderType === "DELIVERY") {
    return item.deliveryPlatform ?? "Delivery";
  }
  return `#${item.orderNumber}`;
};

const getWaitingMinutes = (createdAt: string) => {
  const diffMs = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(diffMs / 60000));
};

interface Props {
  items: ReadyToServeItem[];
  servingIds: Set<string>;
  onServed: (item: ReadyToServeItem) => void;
  onOpenKds: () => void;
}

export function ReadyToServeList({
  items,
  servingIds,
  onServed,
  onOpenKds,
}: Props) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-title text-text-primary">{t("serve.empty.title")}</p>
        <p className="mt-1 text-body-sm text-text-secondary">
          {t("serve.empty.body")}
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card as="article" key={item.id} padding="none" className="px-3 py-3">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-body font-medium text-text-primary">
                {getItemContext(item)}
              </p>
              <p className="truncate text-body-sm text-text-secondary">
                {t("serve.item.meta", {
                  order: item.orderNumber,
                  station: item.stationName,
                })}
              </p>
            </div>
            <Badge variant="warning" className="shrink-0">
              {t("serve.item.waiting", {
                minutes: String(getWaitingMinutes(item.createdAt)),
              })}
            </Badge>
          </div>
          <InsetPanel className="rounded-md px-3 py-1.5">
            <p className="text-body-sm text-text-primary">
              {item.productName} x{item.quantity}
            </p>
            {item.note && (
              <p className="mt-0.5 truncate text-body-sm text-text-secondary">
                {item.note}
              </p>
            )}
          </InsetPanel>
          <div className="mt-2.5 flex gap-2">
            <Button
              size="sm"
              className="h-9 px-3 text-button-sm"
              onClick={() => onServed(item)}
              disabled={servingIds.has(item.id)}
            >
              <LuCheck size={15} />
              {servingIds.has(item.id)
                ? t("serve.action.serving")
                : t("serve.action.served")}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-9 px-3 text-button-sm"
              onClick={onOpenKds}
            >
              <LuExternalLink size={15} />
              {t("serve.action.openKds")}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

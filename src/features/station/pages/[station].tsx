import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStationService } from "@/features/station/hooks/useStation";
import { useParams } from "react-router-dom";
import { PageHeader } from "@/shared/components/ui/page-header";
import { Card } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/i18n/use-translation";
import { LuInbox, LuClock } from "react-icons/lu";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
}

interface StationOrder {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

const StationPage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string; storeId: string }>();
  const { stationFinOneQuery } = useStationService({ stationId: id });
  const { orderByStation, orderFindByStationIdQuery } = useOrderService({
    stationId: id,
  });

  const isLoading =
    stationFinOneQuery.isLoading || orderFindByStationIdQuery.isLoading;

  const station = stationFinOneQuery.data;
  const orders = (orderByStation ?? []) as StationOrder[];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="space-y-2">
          <div className="skeleton-shimmer h-8 w-64 rounded-md" />
          <div className="skeleton-shimmer h-4 w-40 rounded-md" />
        </div>
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        backTo={true}
        title={t("station.page.title", { name: station?.name ?? "" })}
        subtitle={station?.id}
      />

      <section className="space-y-4">
        <h2 className="text-subtitle font-[var(--weight-semibold)] text-text-primary">
          {t("station.page.currentOrders")}
        </h2>

        {orders.length === 0 ? (
          <EmptyState
            icon={<LuInbox size={32} />}
            title={t("station.page.emptyTitle")}
            description={t("station.page.emptyDescription")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order) => (
              <Card key={order.id} className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-title font-[var(--weight-semibold)] text-text-primary">
                      #{order.orderNumber}
                    </p>
                    <p className="flex items-center gap-1 text-caption text-text-tertiary">
                      <LuClock size={12} />
                      {new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Badge variant="warning">{order.status}</Badge>
                </div>

                <ul className="space-y-1 border-t border-card-border pt-3">
                  {order.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between text-body-sm text-text-primary"
                    >
                      <span>{item.name}</span>
                      <span className="tabular-nums text-text-secondary">
                        ×{item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StationPage;

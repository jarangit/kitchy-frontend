import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { stationServiceApi } from "@/features/station/services/station";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuShoppingCart,
  LuMonitor,
  LuReceipt,
  LuSettings,
  LuPackage,
  LuMapPin,
  LuChefHat,
} from "react-icons/lu";

const StoreDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { storeFinOneQuery, storeFinOneLoading, storeFinOneQueryError } =
    useStoreService({});
  const { ordersQuery } = useOrderService({});
  const navigate = useNavigate();
  const [stations, setStations] = useState<
    { id: string; name: string; createdAt: string }[]
  >([]);

  const onGetStations = async (storeId: string) => {
    try {
      const response = await stationServiceApi.getByStoreId(storeId);
      if (response && response.data.length > 0) {
        setStations(response.data);
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  useEffect(() => {
    if (id) {
      onGetStations(id);
    }
  }, [id]);

  if (storeFinOneLoading) {
    return (
    <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }
  if (storeFinOneQueryError) {
    return <div>Error: {storeFinOneQueryError}</div>;
  }

  const pendingOrders =
    ordersQuery?.filter(
      (o: { status: string }) => o.status === "PENDING"
    )?.length || 0;
  const completedOrders =
    ordersQuery?.filter(
      (o: { status: string }) => o.status === "COMPLETED"
    )?.length || 0;

  const formatRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "success" as const;
      case "PENDING":
        return "warning" as const;
      case "CANCELLED":
        return "danger" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <Link
            to="/dashboard"
            className="min-h-11 px-2 inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
          >
            <LuArrowLeft size={16} />
            Back to stores
          </Link>
          <h1 className="text-2xl font-bold mt-1">
            {storeFinOneQuery?.name}
          </h1>
          <p className="text-[var(--color-text-secondary)]">Store Dashboard</p>
        </div>
        <Button
          onClick={() => navigate(`/store/${id}/pos`)}
          className="h-12 px-6 gap-2"
        >
          <LuShoppingCart size={20} />
          Open POS
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-info-bg)] flex items-center justify-center shrink-0">
              <LuPackage size={20} className="text-[var(--color-info)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                {ordersQuery?.length || 0}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">Total Orders</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-warning-bg)] flex items-center justify-center shrink-0">
              <LuPackage size={20} className="text-[var(--color-warning)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                {pendingOrders}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">Pending</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center shrink-0">
              <LuPackage size={20} className="text-[var(--color-success)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                {completedOrders}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">Completed</div>
            </div>
          </div>
        </div>
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary-bg)] flex items-center justify-center shrink-0">
              <LuMapPin size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                {stations?.length || 0}
              </div>
              <div className="text-sm text-[var(--color-text-secondary)]">Stations</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Link
          to={`/store/${id}/pos`}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-border-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center mb-3">
            <LuMonitor size={24} className="text-[var(--color-success)]" />
          </div>
          <div className="font-semibold text-[var(--color-text-primary)]">POS</div>
          <div className="text-sm text-[var(--color-text-secondary)]">Create new orders</div>
        </Link>
        <Link
          to={`/store/${id}/transactions`}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-border-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-info-bg)] flex items-center justify-center mb-3">
            <LuReceipt size={24} className="text-[var(--color-info)]" />
          </div>
          <div className="font-semibold text-[var(--color-text-primary)]">Transactions</div>
          <div className="text-sm text-[var(--color-text-secondary)]">View order history</div>
        </Link>
        <Link
          to={`/store/${id}/settings`}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-border-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-surface)] flex items-center justify-center mb-3">
            <LuSettings size={24} className="text-[var(--color-text-secondary)]" />
          </div>
          <div className="font-semibold text-[var(--color-text-primary)]">Settings</div>
          <div className="text-sm text-[var(--color-text-secondary)]">Manage store settings</div>
        </Link>
        <Link
          to={`/store/${id}/kds`}
          className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-border-hover)] transition-all duration-[var(--motion-fast)] active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-[var(--color-warning-bg)] flex items-center justify-center mb-3">
            <LuChefHat size={24} className="text-[var(--color-warning)]" />
          </div>
          <div className="font-semibold text-[var(--color-text-primary)]">KDS</div>
          <div className="text-sm text-[var(--color-text-secondary)]">Kitchen order board</div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Orders</h2>
          <Link
            to={`/store/${id}/transactions`}
            className="min-h-11 px-2 inline-flex items-center text-sm text-[var(--color-info)] hover:underline active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
          >
            View all
          </Link>
        </div>
        {ordersQuery && ordersQuery.length > 0 ? (
          <div className="space-y-2">
            {ordersQuery
              .slice(0, 5)
              .map(
                (order: {
                  id: string;
                  orderNumber: string;
                  status: string;
                  createdAt: string;
                  totalAmount?: number;
                }) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b border-[var(--color-border)] last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-medium text-[var(--color-text-primary)]">
                        {order.orderNumber}
                      </span>
                      <Badge variant={getBadgeVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      {order.totalAmount != null && (
                        <span className="font-medium text-[var(--color-text-primary)]">
                          ฿{order.totalAmount.toFixed(2)}
                        </span>
                      )}
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        {formatRelativeTime(order.createdAt)}
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <EmptyState
            icon={<LuReceipt size={32} />}
            title="No orders yet"
            description="Orders will appear here when you start using the POS"
          />
        )}
      </div>

      {/* Stations */}
      {stations && stations.length > 0 && (
        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Stations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stations.map((station) => (
              <Link
                to={`/store/${id}/station/${station.id}`}
                key={station.id}
                className="border border-[var(--color-border)] rounded-lg p-4 hover:border-[var(--color-border-hover)] transition-all active:scale-[0.98]"
              >
                <h3 className="font-semibold text-[var(--color-text-primary)]">{station.name}</h3>
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  Created{" "}
                  {new Date(station.createdAt).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreDashboardPage;

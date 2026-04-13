import { Button } from "@/shared/components/ui/button";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { stationServiceApi } from "@/features/station/services/station";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LuShoppingCart, LuHistory, LuSettings } from "react-icons/lu";

const StoreDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { storeFinOneQuery, storeFinOneLoading, storeFinOneQueryError } =
    useStoreService({
      storeId: id ? +id : undefined,
    });
  const { ordersQuery } = useOrderService({
    storeId: id ? +id : undefined,
  });
  const navigate = useNavigate();
  const [stations, setStations] = useState<
    { id: number; name: string; createdAt: string }[]
  >([]);

  const onGetStations = async (storeId: number) => {
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
      onGetStations(+id);
    }
  }, [id]);

  if (storeFinOneLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <Link
            to="/dashboard"
            className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors active:scale-[0.98]"
          >
            &larr; Back to stores
          </Link>
          <h1 className="text-2xl font-bold mt-1">
            {storeFinOneQuery?.name}
          </h1>
          <p className="text-[var(--color-text-secondary)]">Store Dashboard</p>
        </div>
        <Button
          onClick={() => navigate(`/store/${id}/pos`)}
          className="h-12 px-6 bg-[var(--button-primary-bg)] hover:bg-[var(--button-primary-bg-hover)] text-base font-bold"
        >
          <LuShoppingCart className="mr-2" size={20} />
          Open POS
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to={`/store/${id}/pos`}
          className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-border-hover)] transition-all active:scale-[0.98]"
        >
          <LuShoppingCart size={28} className="text-[var(--color-success)] mb-2" />
          <div className="font-semibold text-[var(--color-text-primary)]">POS</div>
          <div className="text-sm text-[var(--color-text-secondary)]">Create new orders</div>
        </Link>
        <Link
          to={`/store/${id}/transactions`}
          className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-border-hover)] transition-all active:scale-[0.98]"
        >
          <LuHistory size={28} className="text-[var(--color-info)] mb-2" />
          <div className="font-semibold text-[var(--color-text-primary)]">Transactions</div>
          <div className="text-sm text-[var(--color-text-secondary)]">View order history</div>
        </Link>
        <Link
          to={`/store/${id}/settings`}
          className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-5 hover:border-[var(--color-border-hover)] transition-all active:scale-[0.98]"
        >
          <LuSettings size={28} className="text-[var(--color-text-secondary)] mb-2" />
          <div className="font-semibold text-[var(--color-text-primary)]">Settings</div>
          <div className="text-sm text-[var(--color-text-secondary)]">Manage store settings</div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="text-2xl font-bold text-[var(--color-text-primary)]">
            {ordersQuery?.length || 0}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">Total Orders</div>
        </div>
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="text-2xl font-bold text-[var(--color-warning)]">
            {pendingOrders}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">Pending</div>
        </div>
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="text-2xl font-bold text-[var(--color-success)]">
            {completedOrders}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">Completed</div>
        </div>
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="text-2xl font-bold text-[var(--color-info)]">
            {stations?.length || 0}
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">Stations</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[var(--color-text-primary)]">Recent Orders</h2>
          <Link
            to={`/store/${id}/transactions`}
            className="text-sm text-[var(--color-info)] hover:underline"
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
                  id: number;
                  orderNumber: string;
                  status: string;
                  createdAt: string;
                }) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
                  >
                    <div>
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "COMPLETED"
                            ? "bg-[var(--color-success-bg)] text-[var(--color-success)]"
                            : "bg-[var(--color-warning-bg)] text-[var(--color-warning)]"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-[var(--color-text-tertiary)]">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <div className="text-center text-[var(--color-text-tertiary)] py-8">
            No orders yet. Open POS to create your first order!
          </div>
        )}
      </div>

      {/* Stations */}
      {stations && stations.length > 0 && (
        <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-6">
          <h2 className="font-bold text-[var(--color-text-primary)] mb-4">Stations</h2>
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

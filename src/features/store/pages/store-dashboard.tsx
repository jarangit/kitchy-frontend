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
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            &larr; Back to stores
          </Link>
          <h1 className="text-2xl font-bold mt-1">
            {storeFinOneQuery?.name}
          </h1>
          <p className="text-gray-500">Store Dashboard</p>
        </div>
        <Button
          onClick={() => navigate(`/store/${id}/pos`)}
          className="h-12 px-6 bg-green-600 hover:bg-green-700 text-base font-bold"
        >
          <LuShoppingCart className="mr-2" size={20} />
          Open POS
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to={`/store/${id}/pos`}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-green-400 transition-all"
        >
          <LuShoppingCart size={28} className="text-green-600 mb-2" />
          <div className="font-semibold text-gray-800">POS</div>
          <div className="text-sm text-gray-500">Create new orders</div>
        </Link>
        <Link
          to={`/store/${id}/transactions`}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-blue-400 transition-all"
        >
          <LuHistory size={28} className="text-blue-600 mb-2" />
          <div className="font-semibold text-gray-800">Transactions</div>
          <div className="text-sm text-gray-500">View order history</div>
        </Link>
        <Link
          to={`/store/${id}/settings`}
          className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-all"
        >
          <LuSettings size={28} className="text-gray-600 mb-2" />
          <div className="font-semibold text-gray-800">Settings</div>
          <div className="text-sm text-gray-500">Manage store settings</div>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-gray-800">
            {ordersQuery?.length || 0}
          </div>
          <div className="text-sm text-gray-500">Total Orders</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {pendingOrders}
          </div>
          <div className="text-sm text-gray-500">Pending</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600">
            {completedOrders}
          </div>
          <div className="text-sm text-gray-500">Completed</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600">
            {stations?.length || 0}
          </div>
          <div className="text-sm text-gray-500">Stations</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-800">Recent Orders</h2>
          <Link
            to={`/store/${id}/transactions`}
            className="text-sm text-blue-600 hover:underline"
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
                    className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
                  >
                    <div>
                      <span className="font-medium text-gray-800">
                        {order.orderNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )
              )}
          </div>
        ) : (
          <div className="text-center text-gray-400 py-8">
            No orders yet. Open POS to create your first order!
          </div>
        )}
      </div>

      {/* Stations */}
      {stations && stations.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="font-bold text-gray-800 mb-4">Stations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stations.map((station) => (
              <Link
                to={`/store/${id}/station/${station.id}`}
                key={station.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all"
              >
                <h3 className="font-semibold text-gray-800">{station.name}</h3>
                <p className="text-xs text-gray-400">
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

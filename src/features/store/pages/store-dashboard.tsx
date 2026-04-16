import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useOrderService } from "@/features/order/hooks/useOrder";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { stationServiceApi } from "@/features/station/services/station";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  LuArrowLeft,
  LuArrowRight,
  LuChefHat,
  LuMonitor,
  LuReceipt,
  LuSettings,
  LuShoppingCart,
} from "react-icons/lu";

interface DashboardOrder {
  createdAt?: string;
  totalAmount?: number;
}

const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);

const isSameCalendarDay = (dateValue: string | undefined, targetDate: Date): boolean => {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;

  return (
    date.getFullYear() === targetDate.getFullYear() &&
    date.getMonth() === targetDate.getMonth() &&
    date.getDate() === targetDate.getDate()
  );
};

const StoreDashboardPage = () => {
  const { id } = useParams<{ id: string }>();
  const { storeFinOneQuery, storeFinOneLoading, storeFinOneQueryError } =
    useStoreService({});
  const { ordersQuery } = useOrderService({});
  const [stations, setStations] = useState<
    { id: string; name: string; createdAt: string }[]
  >([]);

  useEffect(() => {
    const onGetStations = async (storeId: string) => {
      try {
        const response = await stationServiceApi.getByStoreId(storeId);
        setStations(response?.data ?? []);
      } catch (error) {
        console.error("Error fetching stations:", error);
        setStations([]);
      }
    };

    if (id) {
      onGetStations(id);
    }
  }, [id]);

  const today = new Date();
  const todayLabel = useMemo(
    () =>
      today.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [today],
  );

  const todayOrders = useMemo(
    () =>
      (ordersQuery as DashboardOrder[]).filter((order) =>
        isSameCalendarDay(order.createdAt, today),
      ),
    [ordersQuery, today],
  );

  const todayOrderCount = todayOrders.length;
  const todayRevenue = todayOrders.reduce(
    (sum, order) => sum + (typeof order.totalAmount === "number" ? order.totalAmount : 0),
    0,
  );

  if (storeFinOneLoading) {
    return (
      <div className="space-y-5">
        <div className="space-y-2">
          <SkeletonCard className="h-14" />
        </div>
        <SkeletonCard className="h-36" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <SkeletonCard className="h-24" />
          <SkeletonCard className="h-24" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
          <SkeletonCard className="h-28" />
        </div>
      </div>
    );
  }

  if (storeFinOneQueryError) {
    return <div>Error: {storeFinOneQueryError}</div>;
  }

  const quickActions = [
    {
      label: "Transactions",
      description: "Order history",
      icon: <LuReceipt size={20} />,
      to: `/store/${id}/transactions`,
    },
    {
      label: "KDS",
      description: "Kitchen board",
      icon: <LuChefHat size={20} />,
      to: `/store/${id}/kds`,
    },
    {
      label: "Settings",
      description: "Manage store",
      icon: <LuSettings size={20} />,
      to: `/store/${id}/settings`,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link
          to="/dashboard"
          className="min-h-11 px-2 inline-flex items-center gap-2 text-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] active:scale-[0.98] transition-all duration-[var(--motion-fast)]"
        >
          <LuArrowLeft size={16} />
          Back to stores
        </Link>

        <div>
          <h1 className="text-heading font-[var(--weight-bold)] text-[var(--color-text-primary)]">
            {storeFinOneQuery?.name}
          </h1>
          <p className="text-label text-[var(--color-text-secondary)]">{todayLabel}</p>
        </div>
      </div>

      <Link
        to={`/store/${id}/pos`}
        className="block rounded-[var(--radius-lg)] border border-[var(--color-primary)] bg-[var(--color-primary)] p-8 text-[var(--color-text-inverse)] transition-all duration-[var(--motion-fast)] hover:opacity-95 active:scale-[0.99]"
      >
          <div className="flex items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-radius-full bg-[rgba(255,255,255,0.16)] text-[var(--color-text-inverse)] shrink-0">
              <LuShoppingCart size={24} />
            </div>
            <div className="min-w-0 text-left">
              <div className="text-heading font-[var(--weight-semibold)]">Open POS</div>
              <div className="mt-1 text-label text-[rgba(255,255,255,0.78)]">
                Start taking orders
              </div>
            </div>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-radius-full border border-[rgba(255,255,255,0.22)] bg-[rgba(255,255,255,0.08)] text-[var(--color-text-inverse)] shrink-0">
            <LuArrowRight size={18} />
          </div>
        </div>
      </Link>

      <section className="space-y-4">
        <h2 className="text-label font-[var(--weight-semibold)] text-[var(--color-text-secondary)] uppercase tracking-[0.04em]">
          Status
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-radius-full bg-[var(--color-success-bg)] text-[var(--color-success)]">
                <LuMonitor size={18} />
              </div>
              <div>
                <div className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
                  POS Ready
                </div>
                <div className="text-label text-[var(--color-text-secondary)]">
                  Ready to start shift
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
              {stations.length} {stations.length === 1 ? "Station" : "Stations"}
            </div>
            <div className="mt-1 text-label text-[var(--color-text-secondary)]">
              Connected to this store
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-label font-[var(--weight-semibold)] text-[var(--color-text-secondary)] uppercase tracking-[0.04em]">
          Today
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="text-heading font-[var(--weight-bold)] text-[var(--color-text-primary)]">
              ฿ {formatCurrency(todayRevenue)}
            </div>
            <div className="mt-1 text-label text-[var(--color-text-secondary)]">Revenue</div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
            <div className="text-heading font-[var(--weight-bold)] text-[var(--color-text-primary)]">
              {todayOrderCount} Orders
            </div>
            <div className="mt-1 text-label text-[var(--color-text-secondary)]">Today</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-label font-[var(--weight-semibold)] text-[var(--color-text-secondary)] uppercase tracking-[0.04em]">
          More
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all duration-[var(--motion-fast)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)] active:scale-[0.99]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-radius-full bg-[var(--color-bg)] text-[var(--color-text-secondary)]">
                {action.icon}
              </div>
              <div className="font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
                {action.label}
              </div>
              <div className="mt-1 text-label text-[var(--color-text-secondary)]">
                {action.description}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StoreDashboardPage;

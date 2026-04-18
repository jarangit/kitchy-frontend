import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import TransactionCard, {
  type FlowStatus,
} from "@/features/transaction/components/transaction-card";
import TransactionFilter, {
  type TransactionFilterStatus,
} from "@/features/transaction/components/transaction-filter";
import { PageHeader } from "@/shared/components/ui/page-header";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { useTranslation } from "@/shared/i18n/use-translation";
import { LuReceipt } from "react-icons/lu";

interface TransactionProduct {
  name?: string;
  quantity?: number;
  price?: number;
}

interface TransactionListItem {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  totalAmount?: number;
  products?: TransactionProduct[];
}

const DONE_STATUSES = ["READY", "COMPLETED"];

const getFlowStatus = (status: string): FlowStatus => {
  if (status === "CANCELLED") return "CANCELLED";
  if (DONE_STATUSES.includes(status)) return "DONE";
  return "IN_PROGRESS";
};

const matchesStatusFilter = (
  status: string,
  filterStatus: TransactionFilterStatus,
) => {
  if (filterStatus === "ALL") return true;
  return getFlowStatus(status) === filterStatus;
};

type TimelineBucket = "today" | "yesterday" | "earlier";

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

const getBucket = (createdAt: string, now: Date): TimelineBucket => {
  const today = startOfDay(now);
  const yesterday = today - 86400000;
  const ts = startOfDay(new Date(createdAt));
  if (ts === today) return "today";
  if (ts === yesterday) return "yesterday";
  return "earlier";
};

const BUCKET_ORDER: TimelineBucket[] = ["today", "yesterday", "earlier"];
const BUCKET_LABEL_KEY: Record<TimelineBucket, `transaction.list.timeline.${TimelineBucket}`> = {
  today: "transaction.list.timeline.today",
  yesterday: "transaction.list.timeline.yesterday",
  earlier: "transaction.list.timeline.earlier",
};

const TransactionListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { transactions, isLoading, updateTransaction, isUpdating } =
    useTransactionService();

  const [filter, setFilter] = useState<{
    search: string;
    status: TransactionFilterStatus;
  }>({ search: "", status: "ALL" });
  const [pendingId, setPendingId] = useState<string | null>(null);

  const allTransactions = useMemo(
    () => (transactions as TransactionListItem[] | undefined) ?? [],
    [transactions],
  );

  const counts = useMemo(() => {
    let inProgress = 0;
    let done = 0;
    let cancelled = 0;
    for (const tx of allTransactions) {
      const flow = getFlowStatus(tx.status);
      if (flow === "IN_PROGRESS") inProgress++;
      else if (flow === "DONE") done++;
      else cancelled++;
    }
    return {
      all: allTransactions.length,
      inProgress,
      done,
      cancelled,
    };
  }, [allTransactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((tx) => {
      const matchSearch =
        !filter.search ||
        tx.orderNumber.toLowerCase().includes(filter.search.toLowerCase());
      const matchStatus = matchesStatusFilter(tx.status, filter.status);
      return matchSearch && matchStatus;
    });
  }, [allTransactions, filter]);

  const grouped = useMemo(() => {
    const now = new Date();
    const map: Record<TimelineBucket, TransactionListItem[]> = {
      today: [],
      yesterday: [],
      earlier: [],
    };
    for (const tx of filteredTransactions) {
      map[getBucket(tx.createdAt, now)].push(tx);
    }
    for (const key of BUCKET_ORDER) {
      map[key].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
    return map;
  }, [filteredTransactions]);

  const handleQuickAction = async (
    tx: TransactionListItem,
    action: "READY" | "CANCELLED",
  ) => {
    setPendingId(tx.id);
    try {
      await updateTransaction({
        id: tx.id,
        payload: { status: action },
      });
    } finally {
      setPendingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 skeleton-shimmer rounded-card" />
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  const hasAny = filteredTransactions.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("transaction.title")}
        subtitle={t("transaction.subtitle")}
      />

      <TransactionFilter counts={counts} onFilterChange={setFilter} />

      {!hasAny ? (
        <div className="overflow-hidden rounded-card border border-card-border bg-card-bg">
          <EmptyState
            icon={<LuReceipt size={32} />}
            title={t("transaction.empty.title")}
            description={t("transaction.empty.description")}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {BUCKET_ORDER.filter((bucket) => grouped[bucket].length > 0).map(
            (bucket) => {
              const items = grouped[bucket];
              return (
                <section key={bucket} className="space-y-2">
                  <h2 className="px-1 text-caption font-semibold uppercase tracking-wider text-text-tertiary">
                    {t(BUCKET_LABEL_KEY[bucket])}
                  </h2>
                  <div className="overflow-hidden rounded-card border border-card-border bg-card-bg">
                    {items.map((tx, index) => {
                      const flowStatus = getFlowStatus(tx.status);
                      return (
                        <TransactionCard
                          key={tx.id}
                          order={tx}
                          flowStatus={flowStatus}
                          isLast={index === items.length - 1}
                          isPending={pendingId === tx.id && isUpdating}
                          onClick={() =>
                            navigate(`/store/${id}/transactions/${tx.id}`)
                          }
                          onQuickAction={
                            flowStatus === "IN_PROGRESS"
                              ? (action) => handleQuickAction(tx, action)
                              : undefined
                          }
                        />
                      );
                    })}
                  </div>
                </section>
              );
            },
          )}
        </div>
      )}
    </div>
  );
};

export default TransactionListPage;

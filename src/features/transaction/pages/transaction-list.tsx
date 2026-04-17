import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import TransactionCard from "@/features/transaction/components/transaction-card";
import TransactionFilter from "@/features/transaction/components/transaction-filter";
import { PageHeader } from "@/shared/components/ui/page-header";
import { StatCard } from "@/shared/components/ui/stat-card";
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

const IN_PROGRESS_STATUSES = ["NEW", "PREPARING", "PENDING", "COOKING"];
const DONE_STATUSES = ["READY", "COMPLETED"];

const matchesStatusFilter = (status: string, filterStatus: string) => {
  if (filterStatus === "ALL") return true;
  if (filterStatus === "IN_PROGRESS") return IN_PROGRESS_STATUSES.includes(status);
  if (filterStatus === "DONE") return DONE_STATUSES.includes(status);
  if (filterStatus === "CANCELLED") return status === "CANCELLED";
  return status === filterStatus;
};

const TransactionListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { transactions, isLoading } = useTransactionService();

  const [filter, setFilter] = useState({ search: "", status: "ALL" });

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return (transactions as TransactionListItem[]).filter((tx) => {
      const matchSearch =
        !filter.search ||
        tx.orderNumber.toLowerCase().includes(filter.search.toLowerCase());
      const matchStatus = matchesStatusFilter(tx.status, filter.status);
      return matchSearch && matchStatus;
    });
  }, [transactions, filter]);

  const allTransactions = transactions ?? [];
  const inProgressCount = allTransactions.filter((tx: { status: string }) =>
    IN_PROGRESS_STATUSES.includes(tx.status)
  ).length;
  const doneCount = allTransactions.filter((tx: { status: string }) =>
    DONE_STATUSES.includes(tx.status)
  ).length;
  const cancelledCount = allTransactions.filter(
    (tx: { status: string }) => tx.status === "CANCELLED"
  ).length;

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

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("transaction.title")}
        subtitle={t("transaction.subtitle")}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label={t("transaction.stat.inProgress")} value={inProgressCount} />
        <StatCard
          label={t("transaction.stat.done")}
          value={doneCount}
          tone="success"
        />
        <StatCard
          label={t("transaction.stat.cancelled")}
          value={cancelledCount}
          tone="danger"
        />
      </div>

      <TransactionFilter onFilterChange={setFilter} />

      <div className="overflow-hidden rounded-card border border-card-border bg-card-bg">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon={<LuReceipt size={32} />}
            title={t("transaction.empty.title")}
            description={t("transaction.empty.description")}
          />
        ) : (
          filteredTransactions.map((tx, index) => (
            <TransactionCard
              key={tx.id}
              order={tx}
              isLast={index === filteredTransactions.length - 1}
              onClick={() => navigate(`/store/${id}/transactions/${tx.id}`)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionListPage;

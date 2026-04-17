import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import TransactionCard from "@/features/transaction/components/transaction-card";
import TransactionFilter from "@/features/transaction/components/transaction-filter";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
import { LuReceipt } from "react-icons/lu";

const TransactionListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { transactions, isLoading } = useTransactionService();

  const [filter, setFilter] = useState({ search: "", status: "ALL" });

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];
    return transactions.filter(
      (tx: { orderNumber: string; status: string }) => {
        const matchSearch =
          !filter.search ||
          tx.orderNumber.toLowerCase().includes(filter.search.toLowerCase());
        const matchStatus =
          filter.status === "ALL" || tx.status === filter.status;
        return matchSearch && matchStatus;
      }
    );
  }, [transactions, filter]);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="h-8 w-48 skeleton-shimmer rounded-radius-md" />
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-heading font-[var(--weight-semibold)] text-text-primary">Transaction History</h1>

      <TransactionFilter onFilterChange={setFilter} />

      <div className="space-y-4">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon={<LuReceipt size={32} />}
            title="No transactions found"
            description="Transactions will appear here when orders are placed"
          />
        ) : (
          filteredTransactions.map(
              (tx: {
                id: string;
                orderNumber: string;
              status: string;
              createdAt: string;
              totalAmount?: number;
              products?: { name?: string; quantity?: number; price?: number }[];
            }) => (
              <TransactionCard
                key={tx.id}
                order={tx}
                onClick={() =>
                  navigate(`/store/${id}/transactions/${tx.id}`)
                }
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default TransactionListPage;

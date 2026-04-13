import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import TransactionCard from "@/features/transaction/components/transaction-card";
import TransactionFilter from "@/features/transaction/components/transaction-filter";

const TransactionListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const storeId = Number(id);

  const { transactions, isLoading } = useTransactionService(storeId);

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
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Transaction History</h1>

      <TransactionFilter onFilterChange={setFilter} />

      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center text-[var(--color-text-tertiary)] py-12">
            No transactions found
          </div>
        ) : (
          filteredTransactions.map(
            (tx: {
              id: number;
              orderNumber: string;
              status: string;
              createdAt: string;
              products?: { name?: string; quantity?: number }[];
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

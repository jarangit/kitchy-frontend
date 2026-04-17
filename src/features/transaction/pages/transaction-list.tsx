import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import TransactionCard from "@/features/transaction/components/transaction-card";
import TransactionFilter from "@/features/transaction/components/transaction-filter";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SkeletonCard } from "@/shared/components/ui/skeleton";
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
        <div className="h-8 w-48 skeleton-shimmer rounded-md" />
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
      <div className="space-y-1">
        <h1 className="text-heading font-[var(--weight-semibold)] text-text-primary">
          จัดการออเดอร์
        </h1>
        <p className="text-label text-text-tertiary">
          อัปเดตสถานะ แก้ไขโต๊ะ และยกเลิกรายการได้ทันที
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-card border border-card-border bg-card-bg px-4 py-3">
          <p className="text-caption text-text-tertiary">กำลังทำ</p>
          <p className="text-title font-[var(--weight-semibold)] tabular-nums text-text-primary">
            {inProgressCount}
          </p>
        </div>
        <div className="rounded-card border border-card-border bg-card-bg px-4 py-3">
          <p className="text-caption text-text-tertiary">เสร็จแล้ว</p>
          <p className="text-title font-[var(--weight-semibold)] tabular-nums text-text-primary">
            {doneCount}
          </p>
        </div>
        <div className="rounded-card border border-card-border bg-card-bg px-4 py-3">
          <p className="text-caption text-text-tertiary">ยกเลิก</p>
          <p className="text-title font-[var(--weight-semibold)] tabular-nums text-text-primary">
            {cancelledCount}
          </p>
        </div>
      </div>

      <TransactionFilter onFilterChange={setFilter} />

      <div className="overflow-hidden rounded-card border border-card-border bg-card-bg">
        {filteredTransactions.length === 0 ? (
          <EmptyState
            icon={<LuReceipt size={32} />}
            title="ไม่พบรายการออเดอร์"
            description="ลองเปลี่ยนตัวกรองหรือค้นหาด้วยเลขออเดอร์"
          />
        ) : (
          filteredTransactions.map((tx, index) => (
              <TransactionCard
                key={tx.id}
                order={tx}
                isLast={index === filteredTransactions.length - 1}
                onClick={() =>
                  navigate(`/store/${id}/transactions/${tx.id}`)
                }
              />
            ))
        )}
      </div>
    </div>
  );
};

export default TransactionListPage;

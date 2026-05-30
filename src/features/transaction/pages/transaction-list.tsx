import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { LuReceipt } from "react-icons/lu";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import { type FlowStatus } from "@/features/transaction/components/transaction-card";
import TransactionFilter, {
  type TransactionFilterStatus,
} from "@/features/transaction/components/transaction-filter";
import { PageHeader } from "@/shared/components/ui/page-header";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumn,
  type SortingState,
} from "@/shared/components/ui/data-table";
import { useTranslation } from "@/shared/i18n/use-translation";

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

const formatCurrency = (value: number) =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

const flowVariant = (
  flow: FlowStatus,
): "default" | "success" | "warning" | "danger" => {
  switch (flow) {
    case "DONE":
      return "success";
    case "IN_PROGRESS":
      return "warning";
    case "CANCELLED":
      return "danger";
    default:
      return "default";
  }
};

const TransactionListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { transactions, isLoading } = useTransactionService();

  const [filter, setFilter] = useState<{
    search: string;
    status: TransactionFilterStatus;
  }>({ search: "", status: "ALL" });

  const [sorting, setSorting] = useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

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

  const columns: DataTableColumn<TransactionListItem>[] = useMemo(
    () => [
      {
        id: "orderNumber",
        accessorFn: (tx) => tx.orderNumber,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("transaction.list.col.orderNumber")}
          />
        ),
        meta: { className: "min-w-[120px]" },
        cell: ({ row }) => (
          <span className="text-body font-[var(--weight-medium)] text-text-primary">
            #{row.original.orderNumber}
          </span>
        ),
      },
      {
        id: "status",
        accessorFn: (tx) => getFlowStatus(tx.status),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("transaction.list.col.status")}
          />
        ),
        meta: { className: "min-w-[132px]" },
        cell: ({ row }) => {
          const flow = getFlowStatus(row.original.status);
          return (
            <Badge variant={flowVariant(flow)} size="md">
              {t(
                flow === "DONE"
                  ? "transaction.filter.done"
                  : flow === "IN_PROGRESS"
                    ? "transaction.filter.inProgress"
                    : "transaction.filter.cancelled",
              )}
            </Badge>
          );
        },
      },
      {
        id: "createdAt",
        accessorFn: (tx) => new Date(tx.createdAt).getTime(),
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("transaction.list.col.createdAt")}
          />
        ),
        meta: { hideBelow: "sm", className: "min-w-[168px]", wrap: true },
        cell: ({ row }) => {
          const date = parseISO(row.original.createdAt);
          return (
            <div className="flex flex-col">
              <span className="text-body-sm text-text-primary">
                {formatDistanceToNow(date, { addSuffix: true })}
              </span>
              <span className="text-label text-text-tertiary">
                {format(date, "d MMM yyyy, HH:mm")}
              </span>
            </div>
          );
        },
      },
      {
        id: "items",
        header: () => <span>{t("transaction.list.col.items")}</span>,
        enableSorting: false,
        meta: { hideBelow: "md", className: "min-w-[180px]", wrap: true },
        cell: ({ row }) => {
          const items = row.original.products ?? [];
          const totalQty = items.reduce((sum, p) => sum + (p.quantity ?? 0), 0);
          const first = items[0]?.name;
          return (
            <span className="block text-body-sm leading-6 text-text-secondary">
              {first
                ? items.length > 1
                  ? `${first} +${items.length - 1}`
                  : first
                : "—"}
              {totalQty > 0 && (
                <span className="ml-1 text-text-tertiary">×{totalQty}</span>
              )}
            </span>
          );
        },
      },
      {
        id: "total",
        accessorFn: (tx) => tx.totalAmount ?? 0,
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("transaction.list.col.total")}
            align="right"
          />
        ),
        meta: { align: "right", className: "tabular-nums min-w-[128px]" },
        cell: ({ row }) => (
          <span className="text-body font-[var(--weight-medium)] text-text-primary">
            {formatCurrency(row.original.totalAmount ?? 0)}
          </span>
        ),
      },
    ],
    [t],
  );

  const hasAny = filteredTransactions.length > 0;

  return (
    <div className="space-y-5">
      <PageHeader
        title={t("transaction.title")}
        subtitle={t("transaction.subtitle")}
      />

      <TransactionFilter counts={counts} onFilterChange={setFilter} />

      {!isLoading && !hasAny ? (
        <div className="overflow-hidden rounded-card border border-card-border bg-card-bg">
          <EmptyState
            icon={<LuReceipt size={32} />}
            title={t("transaction.empty.title")}
            description={t("transaction.empty.description")}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-card border border-card-border bg-card-bg">
          <DataTable<TransactionListItem>
            data={filteredTransactions}
            columns={columns}
            sorting={sorting}
            onSortingChange={setSorting}
            onRowClick={(row) =>
              navigate(`/store/${id}/transactions/${row.id}`)
            }
            getRowId={(row) => row.id}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
};

export default TransactionListPage;

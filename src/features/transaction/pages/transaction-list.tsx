import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { LuArrowRight, LuReceipt } from "react-icons/lu";
import { useTransactionService } from "@/features/transaction/hooks/useTransaction";
import { type FlowStatus } from "@/features/transaction/components/transaction-card";
import TransactionFilter, {
  type TransactionFilterStatus,
} from "@/features/transaction/components/transaction-filter";
import { PageHeader } from "@/shared/components/ui/page-header";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumn,
  type SortingState,
} from "@/shared/components/ui/data-table";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { getPaymentMethodLabelKey } from "@/features/transaction/utils/transaction-formatters";

interface TransactionProduct {
  name?: string;
  quantity?: number;
  price?: number;
}

interface TransactionListItem {
  id: string;
  orderNumber: string;
  status: string;
  type?: string;
  orderType?: string;
  tableNumber?: string;
  customerName?: string;
  method?: string;
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

const flowLabelKey = (flow: FlowStatus): MessageKey => {
  switch (flow) {
    case "DONE":
      return "transaction.filter.done";
    case "IN_PROGRESS":
      return "transaction.filter.inProgress";
    case "CANCELLED":
      return "transaction.filter.cancelled";
  }
};

const orderTypeLabelKey = (value?: string): MessageKey => {
  switch (value) {
    case "DINE_IN":
      return "transaction.card.orderType.dineIn";
    case "TOGO":
      return "transaction.card.orderType.togo";
    case "DELIVERY":
      return "transaction.card.orderType.delivery";
    default:
      return "transaction.card.orderType.default";
  }
};

const getItemSummary = (tx: TransactionListItem) => {
  const items = tx.products ?? [];
  const totalQty = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const productCount = items.length;

  return { totalQty, productCount };
};

const MobileTransactionCard = ({
  tx,
  storeId,
  onMarkReady,
  onCancel,
  isUpdating,
}: {
  tx: TransactionListItem;
  storeId: string;
  onMarkReady: (tx: TransactionListItem) => void;
  onCancel: (tx: TransactionListItem) => void;
  isUpdating: boolean;
}) => {
  const { t } = useTranslation();
  const flow = getFlowStatus(tx.status);
  const date = parseISO(tx.createdAt);
  const { totalQty, productCount } = getItemSummary(tx);
  const itemSummary =
    productCount > 0
      ? t("transaction.list.itemsSuffix", {
          items: totalQty,
          products: productCount,
        })
      : t("transaction.card.itemCount", { count: totalQty });

  return (
    <Card padding="none" className="overflow-hidden">
      <div className="space-y-3 px-4 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-body font-semibold text-text-primary">
                #{tx.orderNumber}
              </p>
              <Badge variant={flowVariant(flow)} size="md">
                {t(flowLabelKey(flow))}
              </Badge>
            </div>
            <p className="mt-1 text-body-sm text-text-secondary">
              {t(orderTypeLabelKey(tx.type ?? tx.orderType))} · {itemSummary}
            </p>
            <p className="mt-0.5 text-label tabular-nums text-text-tertiary">
              {formatDistanceToNow(date, { addSuffix: true })}
            </p>
          </div>
          <p className="shrink-0 text-title font-semibold tabular-nums text-text-primary">
            {formatCurrency(tx.totalAmount ?? 0)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {flow === "IN_PROGRESS" && (
            <>
              <Button
                size="sm"
                onClick={() => onMarkReady(tx)}
                disabled={isUpdating}
              >
                {t("transaction.list.quickAction.markReady")}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onCancel(tx)}
                disabled={isUpdating}
                className="text-danger hover:text-danger"
              >
                {t("transaction.list.quickAction.cancel")}
              </Button>
            </>
          )}
          <Link
            to={`/store/${storeId}/transactions/${tx.id}`}
            className="ml-auto inline-flex min-h-9 items-center gap-1.5 rounded-button px-3 text-button-sm font-button text-text-primary transition-colors duration-fast hover:bg-button-ghost-bg-hover hover:text-accent-text focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          >
            {t("transaction.list.viewDetails")}
            <LuArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Card>
  );
};

const TransactionListPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { transactions, isLoading, updateTransaction, isUpdating, refetch } =
    useTransactionService();

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
          <span className="text-body font-medium text-text-primary">
            #{row.original.orderNumber}
          </span>
        ),
      },
      {
        id: "orderType",
        accessorFn: (tx) => tx.type ?? tx.orderType ?? "",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title={t("transaction.list.col.orderType")}
          />
        ),
        meta: { className: "min-w-[96px]" },
        cell: ({ row }) => (
          <Badge variant="default" size="md">
            {t(orderTypeLabelKey(row.original.type ?? row.original.orderType))}
          </Badge>
        ),
      },
      {
        id: "table",
        accessorFn: (tx) => tx.tableNumber ?? "",
        header: () => <span>{t("transaction.list.col.table")}</span>,
        enableSorting: false,
        meta: { hideBelow: "md", className: "min-w-[80px]" },
        cell: ({ row }) => (
          <span className="text-body-sm text-text-secondary">
            {row.original.tableNumber ?? "—"}
          </span>
        ),
      },
      {
        id: "customer",
        accessorFn: (tx) => tx.customerName ?? "",
        header: () => <span>{t("transaction.list.col.customer")}</span>,
        enableSorting: false,
        meta: { hideBelow: "lg", className: "min-w-[140px]", wrap: true },
        cell: ({ row }) => (
          <span className="text-body-sm text-text-secondary">
            {row.original.customerName ?? "—"}
          </span>
        ),
      },
      {
        id: "method",
        accessorFn: (tx) => tx.method ?? "",
        header: () => <span>{t("transaction.list.col.method")}</span>,
        enableSorting: false,
        meta: { hideBelow: "lg", className: "min-w-[120px]" },
        cell: ({ row }) => {
          const method = row.original.method;
          const methodKey = getPaymentMethodLabelKey(method);
          const label =
            methodKey === "transaction.method.viaPlatform"
              ? t(methodKey, { platform: method ?? "" })
              : methodKey
                ? t(methodKey)
                : "—";
          return (
            <span className="text-body-sm text-text-secondary">{label}</span>
          );
        },
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
          <span className="text-body font-medium text-text-primary">
            {formatCurrency(row.original.totalAmount ?? 0)}
          </span>
        ),
      },
    ],
    [t],
  );

  const hasAny = filteredTransactions.length > 0;
  const hasActiveFilters =
    filter.search.trim().length > 0 || filter.status !== "ALL";
  const emptyTitle = hasActiveFilters
    ? t("transaction.empty.filteredTitle")
    : t("transaction.empty.noOrdersTitle");
  const emptyDescription = hasActiveFilters
    ? t("transaction.empty.filteredDescription")
    : t("transaction.empty.noOrdersDescription");
  const storeId = id ?? "";

  const handleQuickStatusUpdate = async (
    tx: TransactionListItem,
    status: "READY" | "CANCELLED",
  ) => {
    await updateTransaction({ id: tx.id, payload: { status } });
    await refetch();
  };

  return (
    <div className="space-y-5">
      <PageHeader title={t("transaction.title")} />

      <TransactionFilter counts={counts} onFilterChange={setFilter} />

      {isLoading ? (
        <Card padding="none" className="overflow-hidden">
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
        </Card>
      ) : !hasAny ? (
        <Card padding="none" className="overflow-hidden">
          <EmptyState
            icon={<LuReceipt size={32} />}
            title={emptyTitle}
            description={emptyDescription}
          />
        </Card>
      ) : (
        <>
          <div className="space-y-3 md:hidden">
            {filteredTransactions.map((tx) => (
              <MobileTransactionCard
                key={tx.id}
                tx={tx}
                storeId={storeId}
                onMarkReady={(nextTx) =>
                  handleQuickStatusUpdate(nextTx, "READY")
                }
                onCancel={(nextTx) =>
                  handleQuickStatusUpdate(nextTx, "CANCELLED")
                }
                isUpdating={isUpdating}
              />
            ))}
          </div>
          <Card padding="none" className="hidden overflow-hidden md:block">
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
          </Card>
        </>
      )}
    </div>
  );
};

export default TransactionListPage;

import { LuPencil, LuTrash2 } from "react-icons/lu";
import type { OnChangeFn } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumn,
  type SortingState,
} from "@/shared/components/ui/data-table";
import { Button } from "@/shared/components/ui/button";
import { ColorDot } from "@/shared/components/atoms/color-dot";
import { useTranslation } from "@/shared/i18n/use-translation";

export interface StationRow {
  id: string;
  name: string;
  color: string;
  activeOrders: number;
}

interface Props {
  stations: StationRow[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function StationTable({
  stations,
  sorting,
  onSortingChange,
  onEdit,
  onDelete,
  isLoading,
  emptyState,
}: Props) {
  const { t } = useTranslation();

  const columns: DataTableColumn<StationRow>[] = [
    {
      id: "color",
      header: () => <span>{t("settings.stations.col.color")}</span>,
      enableSorting: false,
      meta: { className: "w-12" },
      cell: ({ row }) => <ColorDot color={row.original.color} size="md" />,
    },
    {
      id: "name",
      accessorFn: (s) => s.name,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.stations.col.name")}
        />
      ),
      cell: ({ row }) => (
        <span className="text-body font-[var(--weight-medium)] text-text-primary">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "activeOrders",
      accessorFn: (s) => s.activeOrders,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.stations.col.activeOrders")}
          align="right"
        />
      ),
      meta: { align: "right", className: "tabular-nums", hideBelow: "sm" },
      cell: ({ row }) => (
        <span className="text-body-sm text-text-primary">
          {row.original.activeOrders}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span>{t("settings.stations.col.actions")}</span>,
      enableSorting: false,
      meta: { align: "right", className: "w-36", preventRowClick: true },
      cell: ({ row }) => (
        <div className="inline-flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("common.edit")}
            onClick={() => onEdit(row.original.id)}
          >
            <LuPencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={t("common.delete")}
            onClick={() => onDelete(row.original.id)}
          >
            <LuTrash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable<StationRow>
      data={stations}
      columns={columns}
      sorting={sorting}
      onSortingChange={onSortingChange}
      onRowClick={(row) => onEdit(row.id)}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}

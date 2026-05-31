import { LuPencil, LuTrash2 } from "react-icons/lu";
import type { OnChangeFn } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumn,
  type SortingState,
} from "@/shared/components/ui/data-table";
import { Button } from "@/shared/components/ui/button";
import { Toggle } from "@/shared/components/ui/toggle";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { CategoryModel } from "@/features/category/types/category.model";

interface Props {
  categories: CategoryModel[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  togglingId?: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, next: boolean) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function CategoryTable({
  categories,
  sorting,
  onSortingChange,
  togglingId,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading,
  emptyState,
}: Props) {
  const { t } = useTranslation();

  const columns: DataTableColumn<CategoryModel>[] = [
    {
      id: "name",
      accessorFn: (c) => c.name,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.categories.col.name")}
        />
      ),
      meta: { className: "min-w-[180px]", wrap: true },
      cell: ({ row }) => (
        <span className="block text-body font-medium leading-7 text-text-primary">
          {row.original.name}
        </span>
      ),
    },
    {
      id: "sortOrder",
      accessorFn: (c) => c.sortOrder,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.categories.col.sortOrder")}
          align="right"
        />
      ),
      meta: { align: "right", className: "tabular-nums w-28 min-w-[112px]", hideBelow: "sm" },
      cell: ({ row }) => (
        <span className="text-body-sm text-text-primary">
          {row.original.sortOrder}
        </span>
      ),
    },
    {
      id: "status",
      header: () => <span>{t("settings.categories.col.status")}</span>,
      enableSorting: false,
      meta: { align: "center", className: "w-24 min-w-[96px]", preventRowClick: true },
      cell: ({ row }) => {
        const c = row.original;
        return (
          <div className="inline-flex">
            <Toggle
              checked={c.isActive}
              onChange={(next) => onToggleActive(c.id, next)}
              disabled={togglingId === c.id}
              label={
                c.isActive
                  ? t("settings.categories.active")
                  : t("settings.categories.inactive")
              }
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <span>{t("settings.categories.col.actions")}</span>,
      enableSorting: false,
      meta: { align: "right", className: "w-36 min-w-[112px]", preventRowClick: true },
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
    <DataTable<CategoryModel>
      data={categories}
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

import { LuPencil, LuPower } from "react-icons/lu";
import type { OnChangeFn } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumn,
  type SortingState,
} from "@/shared/components/ui/data-table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { AdminModifierGroupResponse } from "@/features/modifier/types/modifier.dto";

interface Props {
  groups: AdminModifierGroupResponse[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
}

export function ModifierGroupTable({
  groups,
  sorting,
  onSortingChange,
  onSelect,
  onEdit,
  onDelete,
  isLoading,
  emptyState,
}: Props) {
  const { t } = useTranslation();

  const columns: DataTableColumn<AdminModifierGroupResponse>[] = [
    {
      id: "name",
      accessorFn: (g) => g.name,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.modifiers.col.name")}
        />
      ),
      meta: { className: "min-w-[180px]", wrap: true },
      cell: ({ row }) => (
        <div className="block leading-7">
          <span className="block text-body font-medium text-text-primary">
            {row.original.name}
          </span>
          <span className="block text-caption text-text-tertiary">
            {t("settings.modifiers.optionCount", {
              count: String(row.original.options.length),
            })}
          </span>
        </div>
      ),
    },
    {
      id: "selectionType",
      accessorFn: (g) => g.selectionType,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.modifiers.col.type")}
        />
      ),
      meta: { className: "w-28 min-w-[112px]", hideBelow: "sm" },
      cell: ({ row }) => (
        <Badge
          variant={row.original.selectionType === "SINGLE" ? "info" : "accent"}
        >
          {row.original.selectionType === "SINGLE"
            ? t("settings.modifiers.typeSingleShort")
            : t("settings.modifiers.typeMultipleShort")}
        </Badge>
      ),
    },
    {
      id: "minMax",
      accessorFn: (g) => g.minSelect,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.modifiers.col.minMax")}
          align="right"
        />
      ),
      meta: {
        align: "right",
        className: "tabular-nums w-24 min-w-[96px]",
        hideBelow: "sm",
      },
      cell: ({ row }) => (
        <span className="text-body-sm tabular-nums text-text-primary">
          {row.original.minSelect}–{row.original.maxSelect}
        </span>
      ),
    },
    {
      id: "status",
      accessorFn: (g) => (g.isActive ? 1 : 0),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.modifiers.col.status")}
          align="center"
        />
      ),
      meta: { align: "center", className: "w-24 min-w-[96px]" },
      cell: ({ row }) => (
        <Badge variant={row.original.isActive ? "success" : "default"}>
          {row.original.isActive
            ? t("settings.modifiers.active")
            : t("settings.modifiers.inactive")}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: () => <span>{t("settings.modifiers.col.actions")}</span>,
      enableSorting: false,
      meta: {
        align: "right",
        className: "w-36 min-w-[112px]",
        preventRowClick: true,
      },
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
            aria-label={t("settings.modifiers.deleteGroup")}
            title={t("settings.modifiers.deleteGroup")}
            onClick={() => onDelete(row.original.id)}
            className="text-danger hover:bg-danger-bg hover:text-danger"
          >
            <LuPower className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <DataTable<AdminModifierGroupResponse>
      data={groups}
      columns={columns}
      sorting={sorting}
      onSortingChange={onSortingChange}
      onRowClick={(row) => onSelect(row.id)}
      getRowId={(row) => row.id}
      isLoading={isLoading}
      emptyState={emptyState}
    />
  );
}

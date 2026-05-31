import { LuImage, LuPencil, LuTrash2 } from "react-icons/lu";
import type { OnChangeFn } from "@tanstack/react-table";
import {
  DataTable,
  DataTableColumnHeader,
  type DataTableColumn,
  type SortingState,
} from "@/shared/components/ui/data-table";
import { Button } from "@/shared/components/ui/button";
import { Toggle } from "@/shared/components/ui/toggle";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { IMenu } from "@/features/product/types/product.model";

interface ProductTableProps {
  products: IMenu[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  togglingId?: string | null;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, next: boolean) => void;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductTable({
  products,
  sorting,
  onSortingChange,
  togglingId,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductTableProps) {
  const { t } = useTranslation();

  const columns: DataTableColumn<IMenu>[] = [
    {
      id: "image",
      header: () => <span>{t("settings.products.col.image")}</span>,
      enableSorting: false,
      meta: { className: "w-16 min-w-[64px]" },
      cell: ({ row }) => {
        const menu = row.original;
        const inactive = !menu.isActive;
        return (
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center overflow-hidden rounded-sm bg-surface-muted text-text-tertiary",
              inactive && "grayscale",
            )}
          >
            {menu.imageUrl ? (
              <img
                src={menu.imageUrl}
                alt={menu.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <LuImage size={18} />
            )}
          </div>
        );
      },
    },
    {
      id: "name",
      accessorFn: (row) => row.name,
      sortingFn: (a, b) => a.original.name.localeCompare(b.original.name),
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.products.col.name")}
        />
      ),
      cell: ({ row }) => {
        const menu = row.original;
        const secondary = menu.stationName
          ? `${menu.categoryName ?? t("settings.products.noCategory")} · ${menu.stationName}`
          : (menu.categoryName ?? t("settings.products.noCategory"));
        return (
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-body font-medium text-text-primary">
              {menu.name}
            </span>
            <span className="text-label text-text-secondary truncate md:hidden">
              {secondary}
            </span>
          </div>
        );
      },
    },
    {
      id: "category",
      header: () => <span>{t("settings.products.col.category")}</span>,
      enableSorting: false,
      meta: { hideBelow: "md", className: "min-w-[180px]", wrap: true },
      cell: ({ row }) => (
        <span className="block text-body-sm leading-6 text-text-secondary">
          {row.original.categoryName ?? t("settings.products.noCategory")}
        </span>
      ),
    },
    {
      id: "price",
      accessorFn: (row) => row.price ?? 0,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.products.col.price")}
          align="right"
        />
      ),
      meta: { align: "right", className: "tabular-nums min-w-[112px]" },
      cell: ({ row }) => {
        const menu = row.original;
        return menu.price == null ? (
          <span className="text-body-sm text-text-tertiary">
            {t("settings.products.noPrice")}
          </span>
        ) : (
          formatPrice(menu.price)
        );
      },
    },
    {
      id: "cost",
      accessorFn: (row) => row.cost ?? 0,
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={t("settings.products.col.cost")}
          align="right"
        />
      ),
      meta: { align: "right", hideBelow: "lg", className: "tabular-nums min-w-[112px]" },
      cell: ({ row }) => {
        const menu = row.original;
        return menu.cost == null ? (
          <span className="text-body-sm text-text-tertiary">—</span>
        ) : (
          formatPrice(menu.cost)
        );
      },
    },
    {
      id: "status",
      header: () => <span>{t("settings.products.col.status")}</span>,
      enableSorting: false,
      meta: { align: "center", className: "w-24 min-w-[96px]", preventRowClick: true },
      cell: ({ row }) => {
        const menu = row.original;
        const isToggling = togglingId === menu.id;
        return (
          <div className="inline-flex">
            <Toggle
              checked={menu.isActive}
              onChange={(next) => onToggleActive(menu.id, next)}
              disabled={isToggling}
              label={
                menu.isActive
                  ? t("settings.products.active")
                  : t("settings.products.inactive")
              }
            />
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <span>{t("settings.products.col.actions")}</span>,
      enableSorting: false,
      meta: { align: "right", className: "w-36 min-w-[112px]", preventRowClick: true },
      cell: ({ row }) => {
        const menu = row.original;
        return (
          <div className="inline-flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("common.edit")}
              onClick={() => onEdit(menu.id)}
            >
              <LuPencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("common.delete")}
              onClick={() => onDelete(menu.id)}
            >
              <LuTrash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <DataTable<IMenu>
      data={products}
      columns={columns}
      sorting={sorting}
      onSortingChange={onSortingChange}
      onRowClick={(row) => onEdit(row.id)}
      getRowId={(row) => row.id}
    />
  );
}

import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

const TABLE_OPTIONS = Array.from(
  { length: 20 },
  (_, index) => `T-${String(index + 1).padStart(2, "0")}`
);

interface Props {
  open: boolean;
  onClose: () => void;
  tableNumber: string | null;
  onSelect: (table: string) => void;
}

const TablePickerDialog = ({ open, onClose, tableNumber, onSelect }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog open={open} onClose={onClose} className="max-w-2xl p-6 sm:p-7">
      <DialogHeader className="mb-6">
        <DialogTitle>{t("pos.cart.selectTable")}</DialogTitle>
        <DialogDescription>{t("pos.cart.selectTableDescription")}</DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-4 gap-3">
        {TABLE_OPTIONS.map((table) => (
          <button
            key={table}
            onClick={() => {
              onSelect(table);
              onClose();
            }}
            className={cn(
              "flex h-20 items-center justify-center rounded-[var(--radius-md)] border bg-card-bg px-3 text-center transition-all duration-[var(--motion-fast)]",
              "font-mono text-title tabular-nums whitespace-nowrap text-text-secondary",
              "hover:-translate-y-[1px] hover:border-border-hover hover:text-text-primary",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
              tableNumber === table
                ? "border-accent bg-accent/5 text-accent shadow-[inset_0_0_0_1px_var(--color-accent)]"
                : "border-card-border"
            )}
            aria-pressed={tableNumber === table}
            type="button"
          >
            {table}
          </button>
        ))}
      </div>
    </Dialog>
  );
};

export default TablePickerDialog;

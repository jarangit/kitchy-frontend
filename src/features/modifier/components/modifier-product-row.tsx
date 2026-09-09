import { SelectionMark } from "@/shared/components/ui/selection-mark";
import { Spinner } from "@/shared/components/ui/spinner";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

export interface PickerProductItem {
  id: string;
  name: string;
  categoryName?: string;
  attached: boolean;
  sortOrder: number | null;
  pending: boolean;
}

interface Props {
  item: PickerProductItem;
  onToggle: (id: string, next: boolean) => void;
}

/** One product row with immediate attach/detach toggle. */
export function ModifierProductRow({ item, onToggle }: Props) {
  const { t } = useTranslation();

  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-card px-3 py-2 transition-colors duration-fast hover:bg-surface focus-within:ring-2 focus-within:ring-accent/40 focus-within:outline-none",
        item.pending && "pointer-events-none opacity-60",
      )}
    >
      <input
        type="checkbox"
        checked={item.attached}
        disabled={item.pending}
        onChange={() => onToggle(item.id, !item.attached)}
        className="sr-only"
        aria-label={item.name}
      />
      <SelectionMark shape="square" checked={item.attached} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-body text-text-primary">
          {item.name}
        </span>
        {(item.categoryName || item.attached) && (
          <span className="mt-0.5 block truncate text-caption text-text-tertiary">
            {item.categoryName}
            {item.attached &&
              item.sortOrder != null &&
              ` • ${t("settings.modifiers.assignedOrder", {
                order: String(item.sortOrder),
              })}`}
          </span>
        )}
      </span>
      {item.pending && (
        <Spinner size="sm" className="shrink-0 text-text-tertiary" />
      )}
    </label>
  );
}

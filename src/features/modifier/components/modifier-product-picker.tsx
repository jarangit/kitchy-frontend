import { LuSearchX } from "react-icons/lu";
import { Card } from "@/shared/components/ui/card";
import { DropdownSelect } from "@/shared/components/ui/dropdown-select";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { SearchInput } from "@/shared/components/ui/search-input";
import { useTranslation } from "@/shared/i18n/use-translation";
import {
  ModifierProductRow,
  type PickerProductItem,
} from "@/features/modifier/components/modifier-product-row";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  categoryId: string;
  onCategoryChange: (value: string) => void;
  categoryOptions: { value: string; label: string }[];
  items: PickerProductItem[];
  totalCount: number;
  onToggle: (id: string, next: boolean) => void;
  onClearFilters: () => void;
}

/** Search + category toolbar with the full toggleable product list. */
export function ModifierProductPicker({
  search,
  onSearchChange,
  categoryId,
  onCategoryChange,
  categoryOptions,
  items,
  totalCount,
  onToggle,
  onClearFilters,
}: Props) {
  const { t } = useTranslation();
  const hasActiveFilters = search.trim().length > 0 || categoryId !== "all";

  return (
    <Card className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          className="sm:flex-1"
          value={search}
          onValueChange={onSearchChange}
          placeholder={t("settings.modifiers.assignSearchPlaceholder")}
        />
        <DropdownSelect
          aria-label={t("settings.modifiers.assignFilterCategory")}
          value={categoryId}
          onValueChange={onCategoryChange}
          options={categoryOptions}
          className="sm:min-w-[160px]"
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-label text-text-secondary">
          {t("settings.modifiers.assignShowingCount", {
            shown: String(items.length),
            total: String(totalCount),
          })}
        </span>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="text-label text-text-primary hover:text-accent-text hover:underline"
          >
            {t("settings.modifiers.clearFilters")}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<LuSearchX size={32} />}
          title={t("settings.modifiers.assignNoResults")}
          description={t("settings.modifiers.assignNoResultsDescription")}
          className="py-6"
        />
      ) : (
        <div className="max-h-64 space-y-1 overflow-y-auto pr-1">
          {items.map((item) => (
            <ModifierProductRow key={item.id} item={item} onToggle={onToggle} />
          ))}
        </div>
      )}
    </Card>
  );
}

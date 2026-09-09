import { useEffect, useMemo, useState } from "react";
import { LuChevronRight, LuGripVertical, LuPlus } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { Toggle } from "@/shared/components/ui/toggle";
import { toast } from "@/shared/services/toast-service";
import { useTranslation } from "@/shared/i18n/use-translation";
import { formatPriceAdjustment } from "@/shared/utils/modifier-selection";
import { cn } from "@/shared/utils/cn";
import type {
  AdminModifierOptionResponse,
  CreateModifierOptionRequest,
  UpdateModifierOptionRequest,
} from "@/features/modifier/types/modifier.dto";
import { ModifierStepSection } from "@/features/modifier/components/modifier-step-section";
import { ModifierOptionDialog } from "@/features/modifier/components/modifier-option-dialog";

interface Props {
  options: AdminModifierOptionResponse[];
  minSelect: number;
  resetKey: string;
  onCreateOption: (data: CreateModifierOptionRequest) => void;
  onUpdateOption: (optionId: string, data: UpdateModifierOptionRequest) => void;
  onDeleteOption: (optionId: string) => void;
  isSubmitting?: boolean;
  togglingOptionId?: string | null;
}

const ModifierOptionEditor = ({
  options,
  minSelect,
  resetKey,
  onCreateOption,
  onUpdateOption,
  onDeleteOption,
  isSubmitting,
  togglingOptionId,
}: Props) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingOption, setEditingOption] =
    useState<AdminModifierOptionResponse | null>(null);

  // Reset local state when switching to another group.
  useEffect(() => {
    setIsAdding(false);
    setEditingOption(null);
  }, [resetKey]);

  const sortedOptions = useMemo(
    () =>
      [...(options ?? [])].sort(
        (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
      ),
    [options],
  );

  const handleCreate = (data: CreateModifierOptionRequest) => {
    onCreateOption({
      ...data,
      sortOrder: data.sortOrder ?? sortedOptions.length,
      isAvailable: true,
    });
    setIsAdding(false);
  };

  const handleSaveEdit = (data: CreateModifierOptionRequest) => {
    if (!editingOption) return;
    onUpdateOption(editingOption.id, {
      name: data.name,
      priceAdjustment: data.priceAdjustment,
      sortOrder: data.sortOrder,
    });
    setEditingOption(null);
  };

  const handleDeleteFromDialog = () => {
    if (!editingOption) return;
    // Mirror the backend guard: deleting must not drop available options
    // below minSelect. Warn up front instead of failing after confirm.
    if (editingOption.isAvailable) {
      const activeCount = sortedOptions.filter((o) => o.isAvailable).length;
      if (activeCount - 1 < minSelect) {
        toast.warning({
          title: t("settings.modifiers.optionsHealthWarning", {
            min: String(minSelect),
            active: String(activeCount - 1),
          }),
        });
        return;
      }
    }
    const id = editingOption.id;
    setEditingOption(null);
    onDeleteOption(id);
  };

  return (
    <>
      <ModifierStepSection
        step={3}
        title={t("settings.modifiers.optionsInGroup", {
          count: String(sortedOptions.length),
        })}
        subtitle={
          <>
            <span className="block">
              {t("settings.modifiers.optionSectionDescription")}
            </span>
            <span className="block">
              {t("settings.modifiers.optionsReorderHint")}
            </span>
          </>
        }
        action={
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <LuPlus className="h-4 w-4" />
            {t("settings.modifiers.addOption")}
          </Button>
        }
      >
        <div className="space-y-2">
          {sortedOptions.map((option) => {
            const adjustment = formatPriceAdjustment(
              Number(option.priceAdjustment ?? 0),
            );
            return (
              <InsetPanel
                key={option.id}
                padding="sm"
                className={cn(
                  "flex items-center gap-2 bg-card-bg px-3",
                  !option.isAvailable && "opacity-70",
                )}
              >
                <span
                  aria-hidden="true"
                  className="flex shrink-0 cursor-grab items-center text-text-tertiary"
                >
                  <LuGripVertical className="h-4 w-4" />
                </span>
                <button
                  type="button"
                  onClick={() => setEditingOption(option)}
                  title={t("settings.modifiers.optionDetailHint")}
                  className="min-w-0 flex-1 rounded-sm px-1 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <span className="block truncate text-body font-medium text-text-primary">
                    {option.name}
                  </span>
                  {adjustment && (
                    <span className="mt-0.5 block text-caption tabular-nums text-text-tertiary">
                      {adjustment}
                    </span>
                  )}
                </button>
                <Toggle
                  checked={option.isAvailable}
                  disabled={togglingOptionId === option.id}
                  onChange={(next) =>
                    onUpdateOption(option.id, { isAvailable: next })
                  }
                  label={
                    option.isAvailable
                      ? t("settings.modifiers.available")
                      : t("settings.modifiers.unavailable")
                  }
                />
                <button
                  type="button"
                  onClick={() => setEditingOption(option)}
                  aria-label={t("settings.modifiers.editOption")}
                  className="flex shrink-0 items-center rounded-sm p-1 text-text-tertiary transition-colors duration-fast hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                >
                  <LuChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </InsetPanel>
            );
          })}
        </div>
      </ModifierStepSection>

      <ModifierOptionDialog
        open={isAdding}
        isSubmitting={isSubmitting}
        onClose={() => setIsAdding(false)}
        onSubmit={handleCreate}
      />
      <ModifierOptionDialog
        open={editingOption != null}
        option={editingOption}
        isSubmitting={isSubmitting}
        onClose={() => setEditingOption(null)}
        onSubmit={handleSaveEdit}
        onDelete={handleDeleteFromDialog}
      />
    </>
  );
};

export default ModifierOptionEditor;

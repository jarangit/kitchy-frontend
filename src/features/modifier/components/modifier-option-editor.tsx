import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuPower } from "react-icons/lu";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { Toggle } from "@/shared/components/ui/toggle";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import { formatPriceAdjustment } from "@/shared/utils/modifier-selection";
import type {
  AdminModifierGroupResponse,
  AdminModifierOptionResponse,
  CreateModifierOptionRequest,
  UpdateModifierOptionRequest,
} from "@/features/modifier/types/modifier.dto";

interface Props {
  group: AdminModifierGroupResponse;
  onCreateOption: (data: CreateModifierOptionRequest) => void;
  onUpdateOption: (optionId: string, data: UpdateModifierOptionRequest) => void;
  onDeactivateOption: (optionId: string) => void;
  isSubmitting?: boolean;
  togglingOptionId?: string | null;
}

interface OptionDraft {
  name: string;
  priceAdjustment: string;
  sortOrder: string;
}

const toDraft = (option: AdminModifierOptionResponse): OptionDraft => ({
  name: option.name,
  priceAdjustment: String(option.priceAdjustment ?? 0),
  sortOrder: String(option.sortOrder ?? 0),
});

const ModifierOptionEditor = ({
  group,
  onCreateOption,
  onUpdateOption,
  onDeactivateOption,
  isSubmitting,
  togglingOptionId,
}: Props) => {
  const { t } = useTranslation();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("0");
  const [newSortOrder, setNewSortOrder] = useState("0");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<OptionDraft>({
    name: "",
    priceAdjustment: "0",
    sortOrder: "0",
  });

  // Reset local state when switching to another group.
  useEffect(() => {
    setIsAdding(false);
    setNewName("");
    setNewPrice("0");
    setNewSortOrder("0");
    setEditingId(null);
  }, [group.id]);

  const sortedOptions = [...(group.options ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  );
  const activeCount = sortedOptions.filter((o) => o.isAvailable).length;

  const handleCreate = () => {
    const name = newName.trim();
    if (!name) return;
    onCreateOption({
      name,
      priceAdjustment: Number(newPrice) || 0,
      sortOrder: Math.max(0, Number(newSortOrder) || 0),
      isAvailable: true,
    });
    setNewName("");
    setNewPrice("0");
    setNewSortOrder(String(sortedOptions.length));
    setIsAdding(false);
  };

  const startEdit = (option: AdminModifierOptionResponse) => {
    setEditingId(option.id);
    setDraft(toDraft(option));
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    const name = draft.name.trim();
    if (!name) return;
    onUpdateOption(editingId, {
      name,
      priceAdjustment: Number(draft.priceAdjustment) || 0,
      sortOrder: Math.max(0, Number(draft.sortOrder) || 0),
    });
    setEditingId(null);
  };

  return (
    <Card as="section">
      <div className="mb-1 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-title text-text-primary">
            {group.name}
          </h2>
          <p className="mt-1 text-body-sm text-text-secondary">
            {t("settings.modifiers.optionsSubtitle", {
              active: String(activeCount),
              total: String(sortedOptions.length),
              min: String(group.minSelect),
            })}
          </p>
        </div>
        {!group.isActive && (
          <Badge variant="default">{t("settings.modifiers.inactive")}</Badge>
        )}
      </div>

      {!group.isActive && (
        <InsetPanel className="mb-4 text-label leading-5 text-text-secondary">
          {t("settings.modifiers.inactiveGroupHint")}
        </InsetPanel>
      )}

      <div className="space-y-2">
        {sortedOptions.map((option) => {
          const isEditing = editingId === option.id;
          return (
            <InsetPanel
              key={option.id}
              className={cn(!option.isAvailable && "opacity-70")}
            >
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    id={`option-name-${option.id}`}
                    label={t("settings.modifiers.optionName")}
                    value={draft.name}
                    onChange={(e) =>
                      setDraft({ ...draft, name: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      id={`option-price-${option.id}`}
                      type="number"
                      step="0.01"
                      label={t("settings.modifiers.priceAdjustment")}
                      value={draft.priceAdjustment}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          priceAdjustment: e.target.value,
                        })
                      }
                    />
                    <Input
                      id={`option-sort-${option.id}`}
                      type="number"
                      min="0"
                      step="1"
                      label={t("settings.modifiers.sortOrder")}
                      value={draft.sortOrder}
                      onChange={(e) =>
                        setDraft({ ...draft, sortOrder: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditingId(null)}
                    >
                      {t("common.cancel")}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleSaveEdit}
                      disabled={isSubmitting || !draft.name.trim()}
                    >
                      {t("settings.modifiers.save")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body font-medium text-text-primary">
                      {option.name}
                    </p>
                    <p className="mt-0.5 text-caption tabular-nums text-text-tertiary">
                      {formatPriceAdjustment(
                        Number(option.priceAdjustment ?? 0),
                      ) || t("settings.modifiers.noPriceChange")}
                      {" • "}
                      {t("settings.modifiers.sortOrderShort", {
                        order: String(option.sortOrder ?? 0),
                      })}
                    </p>
                  </div>
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
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={t("common.edit")}
                    onClick={() => startEdit(option)}
                  >
                    <LuPencil className="h-4 w-4" />
                  </Button>
                  {option.isAvailable && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label={t("settings.modifiers.deactivateOption")}
                      title={t("settings.modifiers.deactivateOption")}
                      onClick={() => onDeactivateOption(option.id)}
                      className="text-danger hover:bg-danger-bg hover:text-danger"
                    >
                      <LuPower className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </InsetPanel>
          );
        })}
      </div>

      {isAdding ? (
        <InsetPanel className="mt-3 space-y-3">
          <Input
            id="new-option-name"
            label={t("settings.modifiers.optionName")}
            placeholder={t("settings.modifiers.optionNamePlaceholder")}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              id="new-option-price"
              type="number"
              step="0.01"
              label={t("settings.modifiers.priceAdjustment")}
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
            />
            <Input
              id="new-option-sort"
              type="number"
              min="0"
              step="1"
              label={t("settings.modifiers.sortOrder")}
              value={newSortOrder}
              onChange={(e) => setNewSortOrder(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsAdding(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCreate}
              disabled={isSubmitting || !newName.trim()}
            >
              {t("settings.modifiers.addOption")}
            </Button>
          </div>
        </InsetPanel>
      ) : (
        <Button
          type="button"
          variant="secondary"
          className="mt-3"
          onClick={() => {
            setNewSortOrder(String(sortedOptions.length));
            setIsAdding(true);
          }}
        >
          <LuPlus className="h-4 w-4" />
          {t("settings.modifiers.addOption")}
        </Button>
      )}
    </Card>
  );
};

export default ModifierOptionEditor;

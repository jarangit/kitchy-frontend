import { useEffect, useMemo, useState } from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import type {
  ModifierGroupView,
  ModifierSelection,
} from "@/shared/types/modifier";
import {
  calcFinalUnitPrice,
  calcModifierTotal,
  formatPriceAdjustment,
  validateModifierSelections,
  type ModifierGroupError,
} from "@/shared/utils/modifier-selection";
import { Button } from "@/shared/components/ui/button";
import { SelectionMark } from "@/shared/components/ui/selection-mark";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { InlineAlert } from "@/shared/components/ui/inline-alert";
import type { MessageKey } from "@/shared/i18n/messages";
import type { TranslationValues } from "@/shared/i18n/language-context-value";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

type Translate = (key: MessageKey, values?: TranslationValues) => string;

export interface ModifierDialogProduct {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  modifierGroups: ModifierGroupView[];
}

export interface ModifierDialogConfirm {
  selections: ModifierSelection[];
  quantity: number;
}

interface Props {
  product: ModifierDialogProduct | null;
  onClose: () => void;
  onConfirm: (payload: ModifierDialogConfirm) => void;
}

function groupHint(t: Translate, group: ModifierGroupView): string {
  if (group.selectionType === "SINGLE") {
    return group.minSelect > 0
      ? t("pos.modifier.chooseOne")
      : t("pos.modifier.chooseUpToOne");
  }
  if (group.maxSelect <= 0) {
    return t("pos.modifier.chooseAtLeast", { min: String(group.minSelect) });
  }
  if (group.minSelect <= 0) {
    return t("pos.modifier.chooseUpTo", { max: String(group.maxSelect) });
  }
  return t("pos.modifier.chooseRange", {
    min: String(group.minSelect),
    max: String(group.maxSelect),
  });
}

function errorMessage(
  t: Translate,
  group: ModifierGroupView,
  error: ModifierGroupError,
): string {
  switch (error.code) {
    case "required":
      return t("pos.modifier.errorRequired", { name: group.name });
    case "min":
      return t("pos.modifier.errorMin", {
        name: group.name,
        min: String(error.min),
      });
    case "max":
      return t("pos.modifier.errorMax", {
        name: group.name,
        max: String(error.max),
      });
  }
}

const ProductModifierDialog = ({ product, onClose, onConfirm }: Props) => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setSelected({});
    setQuantity(1);
  }, [product?.id]);

  const groups = useMemo(() => product?.modifierGroups ?? [], [product]);
  const selections: ModifierSelection[] = useMemo(
    () =>
      Object.entries(selected)
        .filter(([, optionIds]) => optionIds.length > 0)
        .map(([modifierGroupId, modifierOptionIds]) => ({
          modifierGroupId,
          modifierOptionIds,
        })),
    [selected],
  );

  const { valid, errors } = useMemo(
    () => validateModifierSelections(groups, selections),
    [groups, selections],
  );

  const basePrice = product?.price ?? 0;
  const modifierTotal = useMemo(
    () => calcModifierTotal(groups, selections),
    [groups, selections],
  );
  const finalUnitPrice = useMemo(
    () => calcFinalUnitPrice(basePrice, groups, selections),
    [basePrice, groups, selections],
  );

  const toggleOption = (group: ModifierGroupView, optionId: string) => {
    setSelected((prev) => {
      const current = prev[group.id] ?? [];
      if (group.selectionType === "SINGLE") {
        const next = current.includes(optionId) ? [] : [optionId];
        return { ...prev, [group.id]: next };
      }
      if (current.includes(optionId)) {
        return {
          ...prev,
          [group.id]: current.filter((id) => id !== optionId),
        };
      }
      if (group.maxSelect > 0 && current.length >= group.maxSelect) {
        return prev;
      }
      return { ...prev, [group.id]: [...current, optionId] };
    });
  };

  const handleConfirm = () => {
    if (!product || !valid) return;
    onConfirm({ selections, quantity });
    onClose();
  };

  return (
    <Dialog open={product != null} onClose={onClose} className="max-w-2xl">
      {product && (
        <>
          <DialogHeader>
            <DialogTitle>
              {t("pos.modifier.title", { name: product.name })}
            </DialogTitle>
            <DialogDescription>
              ฿{basePrice.toFixed(2)}
              {modifierTotal !== 0 &&
                ` + ฿${modifierTotal.toFixed(2)} = ฿${finalUnitPrice.toFixed(2)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[55dvh] space-y-5 overflow-y-auto pr-1">
            {groups.map((group) => {
              const chosen = selected[group.id] ?? [];
              const groupError = errors[group.id];
              const isRequired = group.minSelect > 0;

              return (
                <section key={group.id} aria-label={group.name}>
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <h3 className="text-body font-semibold text-text-primary">
                      {group.name}
                      <span
                        className={cn(
                          "ml-2 text-caption font-medium",
                          isRequired ? "text-danger" : "text-text-tertiary",
                        )}
                      >
                        {isRequired
                          ? t("pos.modifier.required")
                          : t("pos.modifier.optional")}
                      </span>
                    </h3>
                    <span className="shrink-0 text-caption text-text-tertiary">
                      {groupHint(t, group)}
                    </span>
                  </div>

                  <div
                    role={
                      group.selectionType === "SINGLE" ? "radiogroup" : "group"
                    }
                    aria-label={group.name}
                    className="space-y-2"
                  >
                    {group.options.map((option) => {
                      const isSelected = chosen.includes(option.id);
                      const isDisabled =
                        !isSelected &&
                        group.selectionType === "MULTIPLE" &&
                        group.maxSelect > 0 &&
                        chosen.length >= group.maxSelect;
                      const adjustment = formatPriceAdjustment(
                        Number(option.priceAdjustment ?? 0),
                      );

                      return (
                        <button
                          key={option.id}
                          type="button"
                          role={
                            group.selectionType === "SINGLE"
                              ? "radio"
                              : "checkbox"
                          }
                          aria-checked={isSelected}
                          disabled={isDisabled}
                          onClick={() => toggleOption(group, option.id)}
                          className={cn(
                            "flex w-full items-center justify-between gap-3 rounded-card border px-4 py-3 text-left transition-colors duration-fast",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                            isSelected
                              ? "border-transparent bg-accent-bg accent-inset-ring"
                              : "border-card-border bg-card-bg hover:bg-surface",
                            isDisabled && "cursor-not-allowed opacity-50",
                          )}
                        >
                          <span className="flex min-w-0 items-center gap-3">
                            <SelectionMark
                              shape={
                                group.selectionType === "SINGLE"
                                  ? "circle"
                                  : "square"
                              }
                              checked={isSelected}
                            />
                            <span className="truncate text-body text-text-primary">
                              {option.name}
                            </span>
                          </span>
                          {adjustment && (
                            <span className="shrink-0 text-body-sm font-medium tabular-nums text-text-secondary">
                              {adjustment}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {groupError && (
                    <p className="mt-1.5 text-label text-danger" role="alert">
                      {errorMessage(t, group, groupError)}
                    </p>
                  )}
                </section>
              );
            })}
          </div>

          <DialogFooter className="mt-6 flex-col items-stretch gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-0.5 self-start rounded-full border border-card-border bg-card-bg p-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="h-9 w-9 rounded-full"
                aria-label={t("pos.cart.decreaseQuantity")}
              >
                <LuMinus size={16} />
              </Button>
              <span className="min-w-8 text-center text-label font-semibold tabular-nums text-text-primary">
                {quantity}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                className="h-9 w-9 rounded-full"
                aria-label={t("pos.cart.increaseQuantity")}
              >
                <LuPlus size={16} />
              </Button>
            </div>

            <Button
              type="button"
              size="lg"
              className="flex-1"
              disabled={!valid}
              onClick={handleConfirm}
            >
              {t("pos.modifier.addToCart", {
                total: `฿${(finalUnitPrice * quantity).toFixed(2)}`,
              })}
            </Button>
          </DialogFooter>

          {!valid && (
            <InlineAlert tone="warning">
              {t("pos.modifier.completeRequired")}
            </InlineAlert>
          )}
        </>
      )}
    </Dialog>
  );
};

export default ProductModifierDialog;

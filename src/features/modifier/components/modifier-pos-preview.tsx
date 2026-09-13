import { useMemo, useState } from "react";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";
import { formatPriceAdjustment } from "@/shared/utils/modifier-selection";
import { SelectionMark } from "@/shared/components/ui/selection-mark";
import type { ModifierSelectionType } from "@/shared/types/modifier";

export interface PreviewOption {
  id: string;
  name: string;
  priceAdjustment: number;
  isAvailable: boolean;
}

interface Props {
  groupName: string;
  selectionType: ModifierSelectionType;
  minSelect: number;
  maxSelect: number;
  options: PreviewOption[];
}

function hintText(
  selectionType: ModifierSelectionType,
  minSelect: number,
  maxSelect: number,
  chooseOne: string,
  chooseUpToOne: string,
  chooseRange: (min: string, max: string) => string,
  chooseAtLeast: (min: string) => string,
  chooseUpTo: (max: string) => string,
): string {
  if (selectionType === "SINGLE") {
    return minSelect > 0 ? chooseOne : chooseUpToOne;
  }
  if (maxSelect <= 0) {
    return chooseAtLeast(String(minSelect));
  }
  if (minSelect <= 0) {
    return chooseUpTo(String(maxSelect));
  }
  return chooseRange(String(minSelect), String(maxSelect));
}

/** Read-only POS preview with local interactive selection. */
export function ModifierPosPreview({
  groupName,
  selectionType,
  minSelect,
  maxSelect,
  options,
}: Props) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<string[]>([]);

  const available = useMemo(
    () => options.filter((o) => o.isAvailable),
    [options],
  );

  const hint = hintText(
    selectionType,
    minSelect,
    maxSelect,
    t("pos.modifier.chooseOne"),
    t("pos.modifier.chooseUpToOne"),
    (min, max) => t("pos.modifier.chooseRange", { min, max }),
    (min) => t("pos.modifier.chooseAtLeast", { min }),
    (max) => t("pos.modifier.chooseUpTo", { max }),
  );

  const toggle = (id: string) => {
    setSelected((prev) => {
      if (selectionType === "SINGLE") {
        return prev.includes(id) ? [] : [id];
      }
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (maxSelect > 0 && prev.length >= maxSelect) return prev;
      return [...prev, id];
    });
  };

  return (
    <Card as="section" aria-label={t("settings.modifiers.posPreviewTitle")}>
      <h2 className="text-title text-text-primary">
        {t("settings.modifiers.posPreviewTitle")}
      </h2>
      <p className="mt-1 text-body-sm text-text-secondary">
        {t("settings.modifiers.posPreviewSubtitle")}
      </p>

      <div className="mt-4 rounded-card border border-border bg-surface-muted p-3">
        <div className="rounded-card border border-card-border bg-card-bg p-4">
          <p className="text-body font-semibold text-text-primary">
            {groupName || "—"}
          </p>
          <p className="mt-0.5 text-caption text-text-tertiary">{hint}</p>
          <div className="mt-3 space-y-3 border-t border-border pt-3">
            {available.length === 0 ? (
              <p className="py-2 text-center text-body-sm text-text-tertiary">
                {t("settings.modifiers.posPreviewEmpty")}
              </p>
            ) : (
              available.map((option) => {
                const checked = selected.includes(option.id);
                const adjustment = formatPriceAdjustment(
                  Number(option.priceAdjustment ?? 0),
                );
                return (
                  <button
                    key={option.id}
                    type="button"
                    role={selectionType === "SINGLE" ? "radio" : "checkbox"}
                    aria-checked={checked}
                    onClick={() => toggle(option.id)}
                    className="flex w-full items-center gap-3 py-1 text-left"
                  >
                    <SelectionMark
                      shape={selectionType === "SINGLE" ? "circle" : "square"}
                      checked={checked}
                    />
                    <span className="min-w-0 flex-1 truncate text-body text-text-primary">
                      {option.name}
                    </span>
                    {adjustment && (
                      <span className="shrink-0 text-body-sm tabular-nums text-text-secondary">
                        {adjustment}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

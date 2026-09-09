import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";
import { SelectionMark } from "@/shared/components/ui/selection-mark";
import type { SelectionPreset } from "@/features/modifier/utils/modifier-group-preset";

interface Props {
  value: SelectionPreset;
  onChange: (next: SelectionPreset) => void;
}

/** Three preset cards mapping to SINGLE/MULTIPLE + min/max. */
export function ModifierSelectionCards({ value, onChange }: Props) {
  const { t } = useTranslation();

  const cards: { key: SelectionPreset; title: string; desc: string }[] = [
    {
      key: "required_one",
      title: t("settings.modifiers.selectionRequiredOne"),
      desc: t("settings.modifiers.selectionRequiredOneDesc"),
    },
    {
      key: "optional_one",
      title: t("settings.modifiers.selectionOptionalOne"),
      desc: t("settings.modifiers.selectionOptionalOneDesc"),
    },
    {
      key: "multiple",
      title: t("settings.modifiers.selectionMultiple"),
      desc: t("settings.modifiers.selectionMultipleDesc"),
    },
  ];

  return (
    <div
      role="radiogroup"
      aria-label={t("settings.modifiers.stepSelectionType")}
      className="grid gap-3 sm:grid-cols-3"
    >
      {cards.map((card) => {
        const checked = value === card.key;
        return (
          <button
            key={card.key}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(card.key)}
            className={cn(
              "flex min-h-[96px] flex-col gap-2 rounded-card border p-4 text-left transition-colors duration-fast",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
              checked
                ? "border-transparent bg-accent-bg accent-inset-ring"
                : "border-card-border bg-card-bg hover:bg-surface",
            )}
          >
            <span className="flex items-center gap-2">
              <SelectionMark shape="circle" checked={checked} />
              <span className="text-body-sm font-semibold text-text-primary">
                {card.title}
              </span>
            </span>
            <span className="text-caption leading-5 text-text-secondary">
              {card.desc}
            </span>
          </button>
        );
      })}
    </div>
  );
}

import type { CartModifierSelection } from "@/shared/types/modifier";
import { cn } from "@/shared/utils/cn";

interface Props {
  selections: CartModifierSelection[];
  className?: string;
}

/** Compact "Group: opt1, opt2" lines for cart lines, summaries, and receipts. */
export function ModifierSummary({ selections, className }: Props) {
  if (selections.length === 0) return null;

  return (
    <div className={cn("space-y-0.5", className)}>
      {selections.map((selection) => (
        <p
          key={selection.modifierGroupId}
          className="truncate text-caption leading-5 text-text-tertiary"
          title={`${selection.modifierGroupName}: ${selection.modifierOptionNames.join(", ")}`}
        >
          <span className="font-medium">{selection.modifierGroupName}</span>
          {": "}
          {selection.modifierOptionNames.join(", ")}
        </p>
      ))}
    </div>
  );
}

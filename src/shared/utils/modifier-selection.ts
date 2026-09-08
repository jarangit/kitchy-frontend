import type {
  CartModifierSelection,
  ModifierGroupView,
  ModifierSelection,
} from "@/shared/types/modifier";

export type ModifierGroupError =
  | { code: "required" }
  | { code: "min"; min: number }
  | { code: "max"; max: number };

const normalizeSelections = (
  selections: ModifierSelection[],
): ModifierSelection[] =>
  [...selections]
    .map((selection) => ({
      modifierGroupId: selection.modifierGroupId,
      modifierOptionIds: [...selection.modifierOptionIds].sort(),
    }))
    .sort((a, b) => a.modifierGroupId.localeCompare(b.modifierGroupId));

/** Stable identity for a modifier configuration (cart-line merging). */
export function selectionsKey(selections: ModifierSelection[]): string {
  return JSON.stringify(normalizeSelections(selections));
}

export function areSelectionsEqual(
  a: ModifierSelection[],
  b: ModifierSelection[],
): boolean {
  return selectionsKey(a) === selectionsKey(b);
}

export function calcModifierTotal(
  groups: ModifierGroupView[],
  selections: ModifierSelection[],
): number {
  const optionPriceById = new Map<string, number>();
  for (const group of groups) {
    for (const option of group.options) {
      optionPriceById.set(option.id, Number(option.priceAdjustment ?? 0));
    }
  }

  return selections.reduce(
    (sum, selection) =>
      sum +
      selection.modifierOptionIds.reduce(
        (groupSum, optionId) => groupSum + (optionPriceById.get(optionId) ?? 0),
        0,
      ),
    0,
  );
}

export function calcFinalUnitPrice(
  basePrice: number,
  groups: ModifierGroupView[],
  selections: ModifierSelection[],
): number {
  return basePrice + calcModifierTotal(groups, selections);
}

export function validateModifierSelections(
  groups: ModifierGroupView[],
  selections: ModifierSelection[],
): { valid: boolean; errors: Record<string, ModifierGroupError> } {
  const errors: Record<string, ModifierGroupError> = {};
  const countByGroupId = new Map<string, number>();

  for (const selection of selections) {
    countByGroupId.set(
      selection.modifierGroupId,
      selection.modifierOptionIds.length,
    );
  }

  for (const group of groups) {
    const count = countByGroupId.get(group.id) ?? 0;
    if (count < group.minSelect) {
      errors[group.id] =
        group.minSelect <= 1 && group.maxSelect <= 1
          ? { code: "required" }
          : { code: "min", min: group.minSelect };
    } else if (count > group.maxSelect) {
      errors[group.id] = { code: "max", max: group.maxSelect };
    }
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Build a display snapshot (with names) from raw id selections. */
export function snapshotSelections(
  groups: ModifierGroupView[],
  selections: ModifierSelection[],
): CartModifierSelection[] {
  return selections.map((selection) => {
    const group = groups.find((g) => g.id === selection.modifierGroupId);
    const optionNames = selection.modifierOptionIds.map(
      (optionId) =>
        group?.options.find((option) => option.id === optionId)?.name ??
        optionId,
    );
    return {
      modifierGroupId: selection.modifierGroupId,
      modifierGroupName: group?.name ?? selection.modifierGroupId,
      modifierOptionIds: [...selection.modifierOptionIds],
      modifierOptionNames: optionNames,
    };
  });
}

export function formatPriceAdjustment(value: number): string {
  if (value === 0) return "";
  const formatted = `฿${Math.abs(value).toFixed(value % 1 === 0 ? 0 : 2)}`;
  return value > 0 ? `+${formatted}` : `-${formatted}`;
}

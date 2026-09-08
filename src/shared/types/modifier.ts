export type ModifierSelectionType = "SINGLE" | "MULTIPLE";

export interface ModifierOptionView {
  id: string;
  name: string;
  priceAdjustment: number;
  sortOrder: number;
  isAvailable: boolean;
}

export interface ModifierGroupView {
  id: string;
  name: string;
  selectionType: ModifierSelectionType;
  minSelect: number;
  maxSelect: number;
  sortOrder: number;
  options: ModifierOptionView[];
}

/** Option ids chosen for one group, as sent to POST /orders. */
export interface ModifierSelection {
  modifierGroupId: string;
  modifierOptionIds: string[];
}

/**
 * Cart-line snapshot: ids for the order payload plus names for display.
 * Names are snapshotted at add-to-cart time so the cart/receipt stays
 * stable even if the group/option is renamed later.
 */
export interface CartModifierSelection extends ModifierSelection {
  modifierGroupName: string;
  modifierOptionNames: string[];
}

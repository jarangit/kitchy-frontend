import type { ModifierSelectionType } from "@/shared/types/modifier";

export interface ModifierGroupFormData {
  name: string;
  selectionType: ModifierSelectionType;
  minSelect: number;
  maxSelect: number;
}

export interface ModifierOptionFormData {
  name: string;
  priceAdjustment: number;
  sortOrder: number;
  isAvailable: boolean;
}

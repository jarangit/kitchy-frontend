import type { ModifierGroupFormData } from "@/features/modifier/types/modifier.model";

export type SelectionPreset = "required_one" | "optional_one" | "multiple";

export const emptyGroupDefaults: ModifierGroupFormData = {
  name: "",
  selectionType: "SINGLE",
  minSelect: 1,
  maxSelect: 1,
};

export function presetFromValues(
  selectionType: "SINGLE" | "MULTIPLE",
  minSelect: number,
  maxSelect: number,
): SelectionPreset {
  if (selectionType === "SINGLE" && minSelect >= 1 && maxSelect === 1) {
    return "required_one";
  }
  if (selectionType === "SINGLE" && maxSelect <= 1) {
    return "optional_one";
  }
  return "multiple";
}

export function presetToValues(
  preset: SelectionPreset,
  current: ModifierGroupFormData,
): Pick<ModifierGroupFormData, "selectionType" | "minSelect" | "maxSelect"> {
  if (preset === "required_one") {
    return { selectionType: "SINGLE", minSelect: 1, maxSelect: 1 };
  }
  if (preset === "optional_one") {
    return { selectionType: "SINGLE", minSelect: 0, maxSelect: 1 };
  }
  return {
    selectionType: "MULTIPLE",
    minSelect: current.selectionType === "MULTIPLE" ? current.minSelect : 0,
    maxSelect: current.selectionType === "MULTIPLE" ? current.maxSelect : 0,
  };
}

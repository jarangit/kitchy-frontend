import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        // Composite typography utilities (@utility)
        "text-display",
        "text-heading",
        "text-title",
        "text-subtitle",
        "text-body",
        "text-body-sm",
        "text-label",
        "text-caption",
        // Component font-size tokens (Layer 3)
        "text-button-sm",
        "text-button-md",
        "text-button-lg",
        "text-card-title",
        "text-card-desc",
        "text-input",
        "text-badge",
        "text-chip",
        "text-segment",
        "text-selection",
        "text-dialog-title",
        "text-dialog-desc",
        "text-select",
        "text-label-comp",
      ],
    },
  },
});

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

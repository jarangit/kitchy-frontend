import {
  LuChartBar,
  LuChefHat,
  LuShieldCheck,
  LuShoppingCart,
  LuStore,
} from "react-icons/lu";
import type { MessageKey } from "@/shared/i18n/messages";

export type SectionId = "store" | "sales" | "kitchen" | "report" | "safety";

export const SETTINGS_SECTIONS = [
  // Ordered by frequency of use (most-used first) so the default landing
  // lands on what store owners touch the most: the menu (kitchen).
  { id: "kitchen", label: "settings.cp.section.kitchen", icon: LuChefHat },
  { id: "sales", label: "settings.cp.section.sales", icon: LuShoppingCart },
  { id: "report", label: "settings.cp.section.report", icon: LuChartBar },
  { id: "store", label: "settings.cp.section.store", icon: LuStore },
  { id: "safety", label: "settings.cp.section.safety", icon: LuShieldCheck },
] satisfies Array<{
  id: SectionId;
  label: MessageKey;
  icon: typeof LuStore;
}>;

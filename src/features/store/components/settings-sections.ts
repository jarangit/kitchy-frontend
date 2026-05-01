import {
  LuChefHat,
  LuCreditCard,
  LuMonitor,
  LuSettings,
  LuShieldCheck,
  LuShoppingCart,
  LuStore,
} from "react-icons/lu";
import type { MessageKey } from "@/shared/i18n/messages";

export type SectionId =
  | "store"
  | "payments"
  | "sales"
  | "kitchen"
  | "devices"
  | "safety"
  | "system";

export const SETTINGS_SECTIONS = [
  // Ordered by frequency of use (most-used first) so the default landing
  // lands on what store owners touch the most: the menu (kitchen).
  { id: "kitchen", label: "settings.cp.section.kitchen", icon: LuChefHat },
  { id: "sales", label: "settings.cp.section.sales", icon: LuShoppingCart },
  { id: "payments", label: "settings.cp.section.payments", icon: LuCreditCard },
  { id: "store", label: "settings.cp.section.store", icon: LuStore },
  { id: "devices", label: "settings.cp.section.devices", icon: LuMonitor },
  { id: "safety", label: "settings.cp.section.safety", icon: LuShieldCheck },
  { id: "system", label: "settings.cp.section.system", icon: LuSettings },
] satisfies Array<{
  id: SectionId;
  label: MessageKey;
  icon: typeof LuStore;
}>;

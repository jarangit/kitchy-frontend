import { type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  LuStore,
  LuCreditCard,
  LuShoppingCart,
  LuChefHat,
  LuMonitor,
  LuShieldCheck,
  LuSettings,
} from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";

type SectionId =
  | "store"
  | "payments"
  | "sales"
  | "kitchen"
  | "devices"
  | "safety"
  | "system";

const SECTIONS: {
  id: SectionId;
  label: MessageKey;
  icon: ReactNode;
}[] = [
  { id: "store", label: "settings.cp.section.store", icon: <LuStore size={20} /> },
  { id: "payments", label: "settings.cp.section.payments", icon: <LuCreditCard size={20} /> },
  { id: "sales", label: "settings.cp.section.sales", icon: <LuShoppingCart size={20} /> },
  { id: "kitchen", label: "settings.cp.section.kitchen", icon: <LuChefHat size={20} /> },
  { id: "devices", label: "settings.cp.section.devices", icon: <LuMonitor size={20} /> },
  { id: "safety", label: "settings.cp.section.safety", icon: <LuShieldCheck size={20} /> },
  { id: "system", label: "settings.cp.section.system", icon: <LuSettings size={20} /> },
];

export const SETTINGS_SECTIONS = SECTIONS;

interface Props {
  storeId: string;
  /** active section id for styling the horizontal chip rail */
  active?: SectionId;
}

/**
 * Desktop: vertical sidebar (Left Nav) — iPad-style, rounded cards.
 * Mobile (<md): use <SettingsNavChips /> instead for a horizontal scrollable rail.
 */
export function SettingsNavSidebar({ storeId }: Props) {
  const { t } = useTranslation();
  return (
    <nav className="flex flex-col gap-0.5">
      {SECTIONS.map((s) => (
        <NavLink
          key={s.id}
          to={`/store/${storeId}/settings/${s.id}`}
          end
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-card px-3 py-2.5 text-body text-text-secondary",
              "transition-colors duration-[var(--motion-fast)]",
              "hover:bg-surface-hover hover:text-text-primary",
              isActive && "bg-primary-bg text-text-primary font-medium",
            )
          }
        >
          <span className="flex h-7 w-7 items-center justify-center">
            {s.icon}
          </span>
          <span className="truncate">{t(s.label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

/** Horizontal chip rail for mobile. */
export function SettingsNavChips({ storeId }: Props) {
  const { t } = useTranslation();
  return (
    <nav className="flex gap-2 overflow-x-auto px-1 pb-2">
      {SECTIONS.map((s) => (
        <NavLink
          key={s.id}
          to={`/store/${storeId}/settings/${s.id}`}
          end
          className={({ isActive }) =>
            cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-body-sm",
              "transition-colors duration-[var(--motion-fast)]",
              isActive
                ? "bg-primary text-on-accent"
                : "bg-surface text-text-secondary hover:bg-surface-hover",
            )
          }
        >
          <span>{s.icon}</span>
          <span>{t(s.label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}

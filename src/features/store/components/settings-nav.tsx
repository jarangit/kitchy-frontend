import { NavLink } from "react-router-dom";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";
import { SETTINGS_SECTIONS, type SectionId } from "@/features/store/components/settings-sections";

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
    <nav className="flex flex-col gap-1.5">
      {SETTINGS_SECTIONS.map((s) => {
        const Icon = s.icon;
        return (
          <NavLink
            key={s.id}
            to={`/store/${storeId}/settings/${s.id}`}
            end
            className={({ isActive }) =>
              cn(
                "flex min-h-[56px] items-center gap-4 rounded-card px-4 py-3 text-body text-text-secondary",
                "transition-colors duration-[var(--motion-fast)]",
                "hover:bg-surface-hover hover:text-text-primary",
                isActive && "bg-primary-bg text-text-primary font-medium",
              )
            }
          >
            <span className="flex h-9 w-9 items-center justify-center">
              <Icon size={20} />
            </span>
            <span className="truncate">{t(s.label)}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

/** Horizontal chip rail for mobile. */
export function SettingsNavChips({ storeId }: Props) {
  const { t } = useTranslation();
  return (
    <nav className="flex gap-3 overflow-x-auto px-1 pb-2">
      {SETTINGS_SECTIONS.map((s) => {
        const Icon = s.icon;
        return (
          <NavLink
            key={s.id}
            to={`/store/${storeId}/settings/${s.id}`}
            end
            className={({ isActive }) =>
              cn(
                "flex min-h-[52px] shrink-0 items-center gap-3 rounded-full px-5 py-3 text-body",
                "transition-colors duration-[var(--motion-fast)]",
                isActive
                  ? "bg-primary text-on-accent"
                  : "bg-surface text-text-secondary hover:bg-surface-hover",
              )
            }
          >
            <span>
              <Icon size={20} />
            </span>
            <span>{t(s.label)}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

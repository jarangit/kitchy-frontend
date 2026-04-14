import { Link, useParams } from "react-router-dom";
import { LuBike, LuFileText, LuPackage, LuTags, LuStore, LuSun, LuMoon, LuChevronRight } from "react-icons/lu";
import { useTheme } from "@/shared/hooks/useTheme";
import { Toggle } from "@/shared/components/ui/toggle";
import { SettingsSectionCard, SettingsShell } from "@/features/store/components/settings-shell";

const settingsMenu = [
  {
    name: "Product Management",
    description: "Add, edit, and manage products",
    path: "products",
    icon: <LuPackage size={24} />,
  },
  {
    name: "Category Management",
    description: "Manage product categories",
    path: "categories",
    icon: <LuTags size={24} />,
  },
  {
    name: "Shop Settings",
    description: "Shop name, currency, and more",
    path: "shop",
    icon: <LuStore size={24} />,
  },
  {
    name: "Delivery Platforms",
    description: "Choose delivery apps available in POS",
    path: "delivery",
    icon: <LuBike size={24} />,
  },
  {
    name: "Quick Notes",
    description: "Manage note shortcuts available in POS",
    path: "quick-notes",
    icon: <LuFileText size={24} />,
  },
];

const SettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleTheme, isDark } = useTheme();

  return (
    <SettingsShell
      title="Settings"
      description="Manage products, categories, delivery apps, and display preferences for this store."
    >
      <SettingsSectionCard title="Management">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {settingsMenu.map((item) => (
            <Link
              key={item.path}
              to={`/store/${id}/settings/${item.path}`}
              className="flex min-h-40 flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-5 transition-all duration-[var(--motion-fast)] hover:border-[var(--color-border-hover)] active:scale-[0.98]"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
                  {item.icon}
                </div>
                <LuChevronRight size={20} className="shrink-0 text-[var(--color-text-tertiary)]" />
              </div>

              <div className="flex-1">
                <div className="font-semibold text-[var(--color-text-primary)]">{item.name}</div>
                <div className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                  {item.description}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Display">
        <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-5">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]">
              {isDark ? <LuMoon size={24} /> : <LuSun size={24} />}
            </div>
            <div>
              <div className="font-semibold text-[var(--color-text-primary)]">Dark Mode</div>
              <div className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">
                {isDark ? "Dark theme active" : "Light theme active"}
              </div>
            </div>
          </div>

          <Toggle
            checked={isDark}
            onChange={toggleTheme}
            label={`Switch to ${isDark ? "light" : "dark"} mode`}
          />
        </div>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsPage;

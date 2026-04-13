import { Link, useParams } from "react-router-dom";
import { LuPackage, LuTags, LuStore, LuSun, LuMoon } from "react-icons/lu";
import { useTheme } from "@/shared/hooks/useTheme";

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
];

const SettingsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { toggleTheme, isDark } = useTheme();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Settings</h1>

      {/* Navigation menu */}
      <div className="space-y-3">
        {settingsMenu.map((item) => (
          <Link
            key={item.path}
            to={`/store/${id}/settings/${item.path}`}
            className="flex items-center gap-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-border-hover)] transition-all active:scale-[0.98]"
          >
            <div className="text-[var(--color-text-secondary)]">{item.icon}</div>
            <div>
              <div className="font-semibold text-[var(--color-text-primary)]">{item.name}</div>
              <div className="text-sm text-[var(--color-text-secondary)]">{item.description}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Display section */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">Display</h2>

        <div className="flex items-center justify-between bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4">
          <div className="flex items-center gap-4">
            <div className="text-[var(--color-text-secondary)]">
              {isDark ? <LuMoon size={24} /> : <LuSun size={24} />}
            </div>
            <div>
              <div className="font-semibold text-[var(--color-text-primary)]">Dark Mode</div>
              <div className="text-sm text-[var(--color-text-secondary)]">
                {isDark ? "Dark theme active" : "Light theme active"}
              </div>
            </div>
          </div>

          {/* Toggle switch */}
          <button
            type="button"
            role="switch"
            aria-checked={isDark}
            aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
            onClick={toggleTheme}
            className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center rounded-full transition-all active:scale-[0.98]"
            style={{
              backgroundColor: isDark
                ? "var(--color-primary)"
                : "var(--color-border)",
            }}
          >
            <span
              className="pointer-events-none inline-block h-6 w-6 rounded-full bg-[var(--color-bg)] shadow-md transition-transform"
              style={{
                transform: isDark ? "translateX(28px)" : "translateX(4px)",
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

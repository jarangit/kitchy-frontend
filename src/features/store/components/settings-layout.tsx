import type { ReactNode } from "react";
import {
  SettingsNavSidebar,
  SettingsNavChips,
} from "@/features/store/components/settings-nav";

interface Props {
  storeId: string;
  children: ReactNode;
}

/**
 * Settings Control Panel shell.
 *
 * UX principles:
 *   - No redundant page title — section header inside content owns the "where am I" moment.
 *   - Flat sidebar — defers to content, just a nav surface.
 *   - Reading-width cap on content (~680px) — rows don't stretch awkwardly on wide screens.
 *   - Sidebar sticky with its own scroll so nav context is always reachable.
 *
 * Desktop (md+): 240px nav + max-w content column (justify-start).
 * Mobile: horizontal chip rail on top + content below.
 */
export function SettingsLayout({ storeId, children }: Props) {
  return (
    <div className="w-full">
      {/* Mobile: chip rail */}
      <div className="mb-5 md:hidden">
        <SettingsNavChips storeId={storeId} />
      </div>

      <div className="flex flex-col gap-5 md:flex-row md:gap-8 lg:gap-10">
        {/* Desktop: flat sidebar — stretches with row so the inner sticky
            element can travel the full scroll height of the content column. */}
        <aside className="hidden md:block md:w-[240px] md:shrink-0 md:self-stretch">
          <div className="sticky top-20 max-h-[calc(100vh-5rem)] overflow-y-auto">
            <SettingsNavSidebar storeId={storeId} />
          </div>
        </aside>

        <main className="min-w-0 flex-1 md:max-w-[880px] lg:max-w-[960px]">{children}</main>
      </div>
    </div>
  );
}

import { type ComponentType } from "react";
import { Navigate, useParams } from "react-router-dom";
import { SettingsFrame } from "@/features/store/components/settings-frame";
import { SettingsLayout } from "@/features/store/components/settings-layout";
import { SectionStore } from "@/features/store/components/settings/section-store";
import { SectionSales } from "@/features/store/components/settings/section-sales";
import { SectionKitchen } from "@/features/store/components/settings/section-kitchen";
import { SectionSafety } from "@/features/store/components/settings/section-safety";

const SECTIONS: Record<string, ComponentType> = {
  store: SectionStore,
  sales: SectionSales,
  kitchen: SectionKitchen,
  safety: SectionSafety,
};

/**
 * Legacy section slugs from before the settings consolidation.
 * They now live inside another section, so redirect instead of 404ing.
 */
const LEGACY_SECTION_REDIRECTS: Record<string, string> = {
  payments: "sales",
  devices: "store",
  system: "store",
};

const DEFAULT_SECTION = "kitchen";

const SettingsPage = () => {
  const { id, section } = useParams<{ id: string; section?: string }>();

  if (!id) return <Navigate to="/dashboard" replace />;

  if (!section) {
    return <Navigate to={`/store/${id}/settings/${DEFAULT_SECTION}`} replace />;
  }

  if (section === "report") {
    return <Navigate to={`/store/${id}/report`} replace />;
  }

  const legacyTarget = LEGACY_SECTION_REDIRECTS[section];
  if (legacyTarget) {
    return <Navigate to={`/store/${id}/settings/${legacyTarget}`} replace />;
  }

  const Section = SECTIONS[section];
  if (!Section) {
    return <Navigate to={`/store/${id}/settings/${DEFAULT_SECTION}`} replace />;
  }

  return (
    <SettingsFrame>
      <SettingsLayout storeId={id}>
        <Section />
      </SettingsLayout>
    </SettingsFrame>
  );
};

export default SettingsPage;

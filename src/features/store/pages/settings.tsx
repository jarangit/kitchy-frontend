import { Navigate, useParams } from "react-router-dom";
import { SettingsLayout } from "@/features/store/components/settings-layout";
import { SectionStore } from "@/features/store/components/settings/section-store";
import { SectionPayments } from "@/features/store/components/settings/section-payments";
import { SectionSales } from "@/features/store/components/settings/section-sales";
import { SectionKitchen } from "@/features/store/components/settings/section-kitchen";
import { SectionDevices } from "@/features/store/components/settings/section-devices";
import { SectionSafety } from "@/features/store/components/settings/section-safety";
import { SectionSystem } from "@/features/store/components/settings/section-system";

const SECTIONS: Record<string, () => JSX.Element> = {
  store: SectionStore,
  payments: SectionPayments,
  sales: SectionSales,
  kitchen: SectionKitchen,
  devices: SectionDevices,
  safety: SectionSafety,
  system: SectionSystem,
};

const DEFAULT_SECTION = "store";

const SettingsPage = () => {
  const { id, section } = useParams<{ id: string; section?: string }>();

  if (!id) return <Navigate to="/dashboard" replace />;

  if (!section) {
    return <Navigate to={`/store/${id}/settings/${DEFAULT_SECTION}`} replace />;
  }

  const Section = SECTIONS[section];
  if (!Section) {
    return <Navigate to={`/store/${id}/settings/${DEFAULT_SECTION}`} replace />;
  }

  return (
    <SettingsLayout storeId={id}>
      <Section />
    </SettingsLayout>
  );
};

export default SettingsPage;

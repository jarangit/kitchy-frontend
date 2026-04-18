import { useNavigate, useParams } from "react-router-dom";
import { LuShapes, LuTag, LuPackage } from "react-icons/lu";
import {
  SettingGroup,
  SettingRow,
} from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";

export function SectionKitchen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.kitchen")}
        description={t("settings.cp.section.kitchen.description")}
      />
      <SettingGroup>
        <SettingRow
          variant="link"
          icon={<LuPackage size={18} />}
          label={t("settings.cp.kitchen.products")}
          onClick={() => navigate(`/store/${id}/settings/products`)}
        />
        <SettingRow
          variant="link"
          icon={<LuTag size={18} />}
          label={t("settings.cp.kitchen.categories")}
          onClick={() => navigate(`/store/${id}/settings/categories`)}
        />
        <SettingRow
          variant="link"
          icon={<LuShapes size={18} />}
          label={t("settings.cp.kitchen.manage")}
          onClick={() => navigate(`/store/${id}/settings/stations`)}
        />
      </SettingGroup>
    </div>
  );
}

import { useNavigate, useParams } from "react-router-dom";
import { LuShapes, LuTag, LuPackage } from "react-icons/lu";
import {
  SettingGroup,
  SettingRow,
} from "@/shared/components/ui/setting-row";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { useTranslation } from "@/shared/i18n/use-translation";

const DEFAULT_ORDER_LIMIT = 20;

export function SectionKitchen() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const { t } = useTranslation();
  const { storeFinOneQuery, updateStore } = useStoreService({ userId });

  const orderLimit = storeFinOneQuery?.orderLimit ?? DEFAULT_ORDER_LIMIT;

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.kitchen")}
        description={t("settings.cp.section.kitchen.description")}
      />
      <SettingGroup>
        <SettingRow
          variant="editable"
          label={t("settings.cp.kitchen.orderLimit.label")}
          hint={t("settings.cp.kitchen.orderLimit.hint")}
          value={String(orderLimit)}
          placeholder={t("settings.cp.kitchen.orderLimit.placeholder")}
          type="number"
          onSave={(next) => {
            if (!storeFinOneQuery) return;
            const parsed = Number(next);
            if (!Number.isFinite(parsed) || parsed < 1 || parsed === orderLimit) return;
            updateStore({
              storeData: {
                name: storeFinOneQuery.name,
                orderLimit: parsed,
              },
            });
          }}
        />
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

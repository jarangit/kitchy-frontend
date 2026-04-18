import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  LuSunrise,
  LuPause,
  LuTrash2,
  LuSun,
  LuMoon,
  LuArrowLeftRight,
  LuTriangleAlert,
} from "react-icons/lu";
import {
  SettingGroup,
  SettingRow,
} from "@/shared/components/ui/setting-row";
import { Toggle } from "@/shared/components/ui/toggle";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useTheme } from "@/shared/hooks/useTheme";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { SettingsSectionHeader } from "../settings-section-header";

export function SectionSystem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const { deleteStore } = useStoreService({ userId });

  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = () => {
    if (id !== undefined) {
      deleteStore();
      navigate("/dashboard");
    }
    setDeleteOpen(false);
  };

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.system")}
        description={t("settings.cp.section.system.description")}
      />
      <SettingGroup title={t("settings.cp.section.display")}>
        <SettingRow
          variant="control"
          icon={isDark ? <LuMoon size={18} /> : <LuSun size={18} />}
          label={t("settings.theme.title")}
          hint={isDark ? t("settings.theme.dark") : t("settings.theme.light")}
          control={<Toggle checked={isDark} onChange={toggleTheme} />}
        />
        <SettingRow
          variant="control"
          label={t("settings.language.title")}
          hint={t("settings.language.description")}
          control={
            <div className="flex gap-2">
              <ChipTab
                size="sm"
                active={language === "th"}
                onClick={() => setLanguage("th")}
              >
                {t("settings.language.th")}
              </ChipTab>
              <ChipTab
                size="sm"
                active={language === "en"}
                onClick={() => setLanguage("en")}
              >
                {t("settings.language.en")}
              </ChipTab>
            </div>
          }
        />
      </SettingGroup>

      <SettingGroup title={t("settings.cp.system.title")}>
        <SettingRow
          variant="action"
          icon={<LuSunrise size={18} />}
          label={t("settings.cp.system.newDay")}
          hint={t("settings.cp.system.newDay.hint")}
        />
        <SettingRow
          variant="action"
          icon={<LuPause size={18} />}
          label={t("settings.cp.system.pause")}
          hint={t("settings.cp.system.pause.hint")}
        />
        <SettingRow
          variant="action"
          icon={<LuTrash2 size={18} />}
          label={t("settings.cp.system.clear")}
          hint={t("settings.cp.system.clear.hint")}
        />
      </SettingGroup>

      <SettingGroup
        title={t("settings.shop.dangerZone")}
        description={t("settings.shop.dangerDescription")}
      >
        <SettingRow
          variant="action"
          icon={<LuArrowLeftRight size={18} />}
          label={t("settings.shop.switchStore")}
          hint={t("settings.shop.switchStorePrompt")}
          onClick={() => navigate("/dashboard")}
        />
        <SettingRow
          variant="action"
          icon={
            <LuTriangleAlert size={18} className="text-danger" />
          }
          label={
            <span className="text-danger">
              {t("settings.shop.deleteStore")}
            </span>
          }
          onClick={() => setDeleteOpen(true)}
        />
      </SettingGroup>

      <Dialog open={deleteOpen} onClose={() => setDeleteOpen(false)}>
        <DialogHeader>
          <DialogTitle>{t("settings.shop.deleteDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("settings.shop.deleteDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
            {t("common.cancel")}
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            {t("settings.shop.deleteConfirm")}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

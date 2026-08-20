import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  LuSunrise,
  LuPause,
  LuTrash2,
  LuSun,
  LuMoon,
  LuArrowLeftRight,
  LuTriangleAlert,
  LuVolume2,
} from "react-icons/lu";
import { SettingGroup, SettingRow } from "@/shared/components/ui/setting-row";
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
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";
import { orderApiService } from "@/features/order/services/order";
import { toast } from "@/shared/services/toast-service";
import { useAppDispatch, useAppSelector } from "@/shared/hooks/hooks";
import { setSound } from "@/shared/store/slices/notice-slice";
import { SettingsSectionHeader } from "../settings-section-header";

const CLOSED_STATUSES = new Set(["COMPLETED", "CANCELLED"]);

export function SectionSystem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const { deleteStore } = useStoreService({ userId });
  const { settings, updateSettings } = useStoreSettings();
  const queryClient = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [newDayOpen, setNewDayOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [newDayLoading, setNewDayLoading] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);
  const dispatch = useAppDispatch();
  const isSoundOn = useAppSelector((state) => state.sound.isSoundOn);

  const invalidateStoreData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["orders", id] }),
      queryClient.invalidateQueries({ queryKey: ["transactions", id] }),
      queryClient.invalidateQueries({ queryKey: ["report"] }),
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] }),
    ]);
  };

  const handleDelete = () => {
    if (id !== undefined) {
      deleteStore();
      navigate("/dashboard");
    }
    setDeleteOpen(false);
  };

  const handleNewDay = async () => {
    setNewDayLoading(true);
    try {
      await invalidateStoreData();
      toast.success({ title: t("settings.cp.system.newDayDone") });
    } catch {
      toast.error({ title: t("settings.cp.system.actionFailed") });
    } finally {
      setNewDayLoading(false);
      setNewDayOpen(false);
    }
  };

  const handleClearStale = async () => {
    if (!id) {
      setClearOpen(false);
      return;
    }
    setClearLoading(true);
    try {
      const response = await orderApiService.getOrdersByStoreId(id);
      const list = Array.isArray(response?.data?.data)
        ? (response.data.data as { id: string; status?: string }[])
        : [];
      const open = list.filter(
        (order) => !CLOSED_STATUSES.has(order.status ?? ""),
      );
      for (const order of open) {
        await orderApiService.update(order.id, { status: "CANCELLED" });
      }
      await invalidateStoreData();
      toast.success({
        title: open.length
          ? t("settings.cp.system.clearDone", { count: open.length })
          : t("settings.cp.system.clearDoneZero"),
      });
    } catch {
      toast.error({ title: t("settings.cp.system.actionFailed") });
    } finally {
      setClearLoading(false);
      setClearOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.system")}
        description={t("settings.cp.section.system.description")}
      />
      <SettingGroup title={t("settings.sound.title")}>
        <SettingRow
          variant="control"
          icon={<LuVolume2 size={18} />}
          label={t("settings.sound.title")}
          hint={t("settings.sound.hint")}
          control={
            <Toggle
              checked={isSoundOn}
              onChange={(checked) => dispatch(setSound(checked))}
            />
          }
        />
      </SettingGroup>

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
            <div className="flex gap-3">
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
          onClick={() => setNewDayOpen(true)}
        />
        <SettingRow
          variant="control"
          icon={<LuPause size={18} />}
          label={t("settings.cp.system.pause")}
          hint={t("settings.cp.system.pause.hint")}
          control={
            <Toggle
              checked={settings.paused}
              onChange={(checked) => updateSettings({ paused: checked })}
            />
          }
        />
        <SettingRow
          variant="action"
          icon={<LuTrash2 size={18} />}
          label={t("settings.cp.system.clear")}
          hint={t("settings.cp.system.clear.hint")}
          onClick={() => setClearOpen(true)}
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
          icon={<LuTriangleAlert size={18} className="text-danger" />}
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

      <Dialog open={newDayOpen} onClose={() => setNewDayOpen(false)}>
        <DialogHeader>
          <DialogTitle>{t("settings.cp.system.newDayDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("settings.cp.system.newDayDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setNewDayOpen(false)}
            disabled={newDayLoading}
          >
            {t("common.cancel")}
          </Button>
          <Button onClick={handleNewDay} loading={newDayLoading}>
            {t("settings.cp.system.newDayConfirm")}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={clearOpen} onClose={() => setClearOpen(false)}>
        <DialogHeader>
          <DialogTitle>{t("settings.cp.system.clearDialogTitle")}</DialogTitle>
          <DialogDescription>
            {t("settings.cp.system.clearDialogDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setClearOpen(false)}
            disabled={clearLoading}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="danger"
            onClick={handleClearStale}
            loading={clearLoading}
          >
            {t("settings.cp.system.clearConfirm")}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

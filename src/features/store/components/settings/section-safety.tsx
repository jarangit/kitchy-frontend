import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LuLock, LuLockOpen, LuTrash2, LuTriangleAlert } from "react-icons/lu";
import { Toggle } from "@/shared/components/ui/toggle";
import { SettingGroup, SettingRow } from "@/shared/components/ui/setting-row";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreSettings } from "@/features/store/hooks/useStoreSettings";
import { SettingsPinDialog } from "@/features/store/components/settings-pin-dialog";
import {
  hasStorePin,
  isValidStorePin,
  setStorePinCache,
} from "@/features/store/utils/store-pin-cache";
import { useStorePin } from "@/features/store/hooks/useStorePin";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useStoreService } from "@/features/store/hooks/useStoreService";
import { orderApiService } from "@/features/order/services/order";
import { toast } from "@/shared/services/toast-service";
import { SettingsSectionHeader } from "../settings-section-header";

type PinFlow = "none" | "create" | "enter";

const CLOSED_STATUSES = new Set(["COMPLETED", "CANCELLED"]);

export function SectionSafety() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const storeId = useStoreRouteParam() ?? "";
  const { settings, updateSettings } = useStoreSettings();
  const safety = settings.safety;
  const cached = storeId ? hasStorePin(storeId) : false;
  const [flow, setFlow] = useState<PinFlow>("none");
  const { setPinFirstTime, changePin, getCachedPin } = useStorePin();
  // Real server-side PIN change: current PIN -> new PIN (entered twice).
  const [changeStep, setChangeStep] = useState<"none" | "current" | "new">(
    "none",
  );
  const [changeCurrentPin, setChangeCurrentPin] = useState("");
  const auth = useAuth();
  const userId = auth?.user?.id ? String(auth.user.id) : undefined;
  const { deleteStore, storeFinOneQuery } = useStoreService({ userId });
  // Server truth for whether the store has a PIN yet (cache alone can't tell).
  // Falls back to the local cache while the query is loading or in demo mode.
  const hasPinOnServer = storeFinOneQuery?.pinSet ?? cached;
  const queryClient = useQueryClient();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [clearLoading, setClearLoading] = useState(false);

  const closeFlow = () => setFlow("none");

  const handleCreateConfirm = async (pin: string) => {
    try {
      await setPinFirstTime(pin);
      closeFlow();
    } catch {
      // error handled inside hook with toast
    }
  };

  const handleEnterVerify = (pin: string) => {
    if (storeId) setStorePinCache(storeId, pin);
    closeFlow();
    return true;
  };

  const openChangeFlow = () => {
    // Skip asking for the current PIN when it's already cached on this device.
    const cachedPin = getCachedPin();
    if (cachedPin && isValidStorePin(cachedPin)) {
      setChangeCurrentPin(cachedPin);
      setChangeStep("new");
    } else {
      setChangeCurrentPin("");
      setChangeStep("current");
    }
  };

  const closeChangeFlow = () => {
    setChangeStep("none");
    setChangeCurrentPin("");
  };

  const handleChangeCurrentVerify = (pin: string) => {
    setChangeCurrentPin(pin);
    setChangeStep("new");
    return true;
  };

  const handleChangeNewConfirm = async (newPin: string) => {
    try {
      await changePin(changeCurrentPin, newPin);
      closeChangeFlow();
    } catch {
      // error handled inside hook with toast; keep dialog open for retry
    }
  };

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
        title={t("settings.cp.section.safety")}
        description={t("settings.cp.section.safety.description")}
      />
      <SettingGroup>
        <SettingRow
          variant="control"
          label={t("settings.cp.safety.confirmDelete")}
          control={
            <Toggle
              checked={safety.confirmDelete}
              onChange={(checked) =>
                updateSettings({ safety: { confirmDelete: checked } })
              }
            />
          }
        />
        <SettingRow
          variant="control"
          label={t("settings.cp.safety.confirmRefund")}
          control={
            <Toggle
              checked={safety.confirmRefund}
              onChange={(checked) =>
                updateSettings({ safety: { confirmRefund: checked } })
              }
            />
          }
        />
      </SettingGroup>

      <SettingGroup
        title={t("settings.cp.safety.settingsPin")}
        description={t("settings.cp.safety.settingsPin.hint")}
      >
        <SettingRow
          variant="display"
          icon={
            hasPinOnServer ? <LuLock size={18} /> : <LuLockOpen size={18} />
          }
          label={t("settings.cp.safety.settingsPin")}
          value={
            hasPinOnServer
              ? t("settings.cp.safety.settingsPin.set")
              : t("settings.cp.safety.settingsPin.notSet")
          }
        />
        {!hasPinOnServer ? (
          <SettingRow
            variant="action"
            label={t("settings.cp.safety.settingsPin.setPin")}
            onClick={() => setFlow("create")}
          />
        ) : !cached ? (
          <SettingRow
            variant="action"
            label={t("settings.pin.verify.title")}
            onClick={() => setFlow("enter")}
          />
        ) : (
          <SettingRow
            variant="action"
            label={t("settings.cp.safety.settingsPin.changePin")}
            onClick={openChangeFlow}
          />
        )}
      </SettingGroup>

      <SettingGroup
        title={t("settings.shop.dangerZone")}
        description={t("settings.shop.dangerDescription")}
      >
        <SettingRow
          variant="action"
          icon={<LuTrash2 size={18} />}
          label={t("settings.cp.system.clear")}
          hint={t("settings.cp.system.clear.hint")}
          onClick={() => setClearOpen(true)}
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

      <SettingsPinDialog
        open={flow === "create"}
        mode="create"
        onClose={closeFlow}
        onVerify={() => {}}
        onCreateConfirm={handleCreateConfirm}
      />

      <SettingsPinDialog
        open={flow === "enter"}
        mode="verify"
        onClose={closeFlow}
        onVerify={handleEnterVerify}
      />

      <SettingsPinDialog
        open={changeStep === "current"}
        mode="verify"
        onClose={closeChangeFlow}
        onVerify={handleChangeCurrentVerify}
      />

      <SettingsPinDialog
        open={changeStep === "new"}
        mode="create"
        onClose={closeChangeFlow}
        onVerify={() => {}}
        onCreateConfirm={handleChangeNewConfirm}
      />

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

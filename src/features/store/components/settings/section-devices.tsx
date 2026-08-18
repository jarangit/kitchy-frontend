import { useState, type KeyboardEvent } from "react";
import { useParams } from "react-router-dom";
import { LuCopy, LuMonitor, LuPencil, LuPlus, LuTrash2 } from "react-icons/lu";
import { SettingGroup } from "@/shared/components/ui/setting-row";
import { SettingsSectionHeader } from "@/features/store/components/settings-section-header";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { IconButton } from "@/shared/components/ui/icon-button";
import { Input } from "@/shared/components/ui/input";
import { Spinner } from "@/shared/components/ui/spinner";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useDeviceService } from "@/features/device/hooks/useDevice";
import { toDeviceModel } from "@/features/device/types/device.model";
import type { DeviceDto } from "@/features/device/types/device.dto";
import { cn } from "@/shared/utils/cn";

const rowBase =
  "flex items-center gap-4 px-5 py-4 min-h-[60px] text-body text-text-primary";

const STATUS_VARIANT = {
  PAIRED: "success",
  PENDING: "warning",
  UNPAIRED: "default",
  DISABLED: "danger",
} as const;

const STATUS_LABEL_KEY = {
  PAIRED: "settings.cp.devices.status.paired",
  PENDING: "settings.cp.devices.status.pending",
  UNPAIRED: "settings.cp.devices.status.unpaired",
  DISABLED: "settings.cp.devices.status.disabled",
} as const;

interface DeviceRowProps {
  device: DeviceDto;
  onRename: (alias: string) => void;
  onDelete: () => void;
}

function DeviceRow({ device, onRename, onDelete }: DeviceRowProps) {
  const { t } = useTranslation();
  const model = toDeviceModel(device);
  const statusLabel = t(STATUS_LABEL_KEY[model.status]);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(model.name);

  const commit = () => {
    const next = draft.trim();
    if (next && next !== model.name) onRename(next);
    setEditing(false);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") {
      setDraft(model.name);
      setEditing(false);
    }
  };

  return (
    <div className={rowBase}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-text-secondary">
        <LuMonitor size={20} />
      </span>

      <div className="min-w-0 flex-1">
        {editing ? (
          <Input
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKey}
            onBlur={commit}
            placeholder={t("settings.cp.devices.renamePlaceholder")}
          />
        ) : (
          <>
            <div className="truncate text-body text-text-primary">
              {model.name}
            </div>
            <div className="mt-0.5 truncate text-body-sm text-text-secondary">
              {statusLabel}
              {model.stationName
                ? ` · ${t("settings.cp.devices.station", { name: model.stationName })}`
                : ` · ${t("settings.cp.devices.noStation")}`}
              {model.online
                ? ` · ${t("settings.cp.devices.online")}`
                : ` · ${t("settings.cp.devices.offline")}`}
            </div>
          </>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Badge variant={STATUS_VARIANT[model.status] ?? "default"}>
          {statusLabel}
        </Badge>
        <IconButton
          aria-label={t("settings.cp.devices.renameLabel")}
          title={t("settings.cp.devices.renameLabel")}
          onClick={() => {
            setDraft(model.name);
            setEditing((value) => !value);
          }}
        >
          <LuPencil size={16} />
        </IconButton>
        <IconButton
          aria-label={t("settings.cp.devices.delete")}
          title={t("settings.cp.devices.delete")}
          onClick={onDelete}
        >
          <LuTrash2 size={16} />
        </IconButton>
      </div>
    </div>
  );
}

export function SectionDevices() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const {
    devices,
    isLoading,
    updateMutation,
    deleteMutation,
    createPairingMutation,
  } = useDeviceService({ storeId: id });

  const [pairOpen, setPairOpen] = useState(false);
  const [pairCode, setPairCode] = useState<string | null>(null);
  const [pairError, setPairError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAdd = () => {
    setPairError(false);
    setPairCode(null);
    setCopied(false);
    setPairOpen(true);
    createPairingMutation.mutate(undefined, {
      onSuccess: (result) => setPairCode(result.code),
      onError: () => setPairError(true),
    });
  };

  const handleCopy = async () => {
    if (!pairCode) return;
    try {
      await navigator.clipboard.writeText(pairCode);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const handleDelete = () => {
    if (!deleteId) return;
    deleteMutation.mutate(deleteId, {
      onSuccess: () => setDeleteId(null),
    });
  };

  return (
    <div className="space-y-6">
      <SettingsSectionHeader
        title={t("settings.cp.section.devices")}
        description={t("settings.cp.section.devices.description")}
      />
      <SettingGroup>
        {isLoading ? (
          <div className={cn(rowBase, "justify-center")}>
            <Spinner size="sm" />
          </div>
        ) : devices.length === 0 ? (
          <div className={rowBase}>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-text-secondary">
              <LuMonitor size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-body text-text-primary">
                {t("settings.cp.devices.empty")}
              </div>
            </div>
          </div>
        ) : (
          devices.map((device) => (
            <DeviceRow
              key={device.id}
              device={device}
              onRename={(alias) =>
                updateMutation.mutate({ id: device.id, data: { alias } })
              }
              onDelete={() => setDeleteId(device.id)}
            />
          ))
        )}

        <button
          type="button"
          onClick={handleAdd}
          className={cn(
            rowBase,
            "w-full cursor-pointer text-left transition-colors duration-fast hover:bg-surface-hover focus-visible:bg-surface-hover focus-visible:outline-none",
          )}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-text-secondary">
            <LuPlus size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-body text-text-primary">
              {t("settings.cp.devices.add")}
            </div>
          </div>
        </button>
      </SettingGroup>

      {/* Pairing code dialog */}
      <Dialog open={pairOpen} onClose={() => setPairOpen(false)}>
        <DialogHeader>
          <DialogTitle>{t("settings.cp.devices.addTitle")}</DialogTitle>
          <DialogDescription>
            {t("settings.cp.devices.addDescription")}
          </DialogDescription>
        </DialogHeader>

        {pairError ? (
          <p className="text-label text-danger">
            {t("settings.cp.devices.addError")}
          </p>
        ) : pairCode ? (
          <div className="space-y-4">
            <div className="rounded-card border border-border bg-surface px-4 py-5 text-center">
              <p className="font-mono text-3xl font-semibold tracking-[0.3em] text-text-primary">
                {pairCode}
              </p>
              <p className="mt-2 text-body-sm text-text-secondary">
                {t("settings.cp.devices.pairCodeHint")}
              </p>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => void handleCopy()}
            >
              <LuCopy size={16} />
              {copied
                ? t("settings.cp.devices.copied")
                : t("settings.cp.devices.copy")}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center py-6">
            <Spinner size="md" />
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setPairOpen(false)}
          >
            {t("settings.cp.row.cancel")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogHeader>
          <DialogTitle>
            {t("settings.cp.devices.deleteConfirmTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("settings.cp.devices.deleteConfirmDescription")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setDeleteId(null)}
          >
            {t("settings.cp.devices.cancel")}
          </Button>
          <Button
            type="button"
            variant="danger"
            loading={deleteMutation.isPending}
            onClick={handleDelete}
          >
            {t("settings.cp.devices.confirm")}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

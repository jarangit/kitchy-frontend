import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/use-translation";
import type {
  AdminModifierOptionResponse,
  CreateModifierOptionRequest,
} from "@/features/modifier/types/modifier.dto";

interface Props {
  open: boolean;
  option?: AdminModifierOptionResponse | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateModifierOptionRequest) => void;
  onDelete?: () => void;
}

/** Shared create/edit dialog for a modifier option. */
export function ModifierOptionDialog({
  open,
  option,
  isSubmitting,
  onClose,
  onSubmit,
  onDelete,
}: Props) {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("0");
  const [sortOrder, setSortOrder] = useState("0");

  useEffect(() => {
    if (!open) return;
    setName(option?.name ?? "");
    setPrice(String(option?.priceAdjustment ?? 0));
    setSortOrder(String(option?.sortOrder ?? 0));
  }, [open, option]);

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onSubmit({
      name: trimmed,
      priceAdjustment: Number(price) || 0,
      sortOrder: Math.max(0, Number(sortOrder) || 0),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} className="max-w-lg">
      <DialogHeader>
        <DialogTitle>
          {option
            ? t("settings.modifiers.editOption")
            : t("settings.modifiers.addOption")}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <Input
          id="modifier-option-dialog-name"
          label={t("settings.modifiers.optionName")}
          placeholder={t("settings.modifiers.optionNamePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="modifier-option-dialog-price"
            type="number"
            step="0.01"
            label={t("settings.modifiers.priceAdjustment")}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <Input
            id="modifier-option-dialog-sort"
            type="number"
            min="0"
            step="1"
            label={t("settings.modifiers.sortOrder")}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
      </div>
      <DialogFooter>
        {option && onDelete && (
          <Button
            type="button"
            variant="ghost"
            onClick={onDelete}
            className="mr-auto text-danger hover:bg-danger-bg hover:text-danger"
          >
            {t("settings.modifiers.deleteOption")}
          </Button>
        )}
        <Button type="button" variant="secondary" onClick={onClose}>
          {t("common.cancel")}
        </Button>
        <Button
          type="button"
          disabled={isSubmitting || !name.trim()}
          onClick={handleSubmit}
        >
          {option
            ? t("settings.modifiers.save")
            : t("settings.modifiers.addOption")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

import { useEffect, useState } from "react";
import type { ICartItem } from "@/features/pos/types/pos.model";
import { Dialog, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  item: ICartItem | null;
  onClose: () => void;
  onSave: (productId: string, note: string) => void;
  quickNotes: string[];
}

const ItemNoteDialog = ({ item, onClose, onSave, quickNotes }: Props) => {
  const { t } = useTranslation();
  const [draftNote, setDraftNote] = useState("");

  useEffect(() => {
    if (item) {
      setDraftNote(item.note ?? "");
    }
  }, [item]);

  const handleToggleCommonNote = (note: string) => {
    const parts = draftNote
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);

    if (parts.includes(note)) {
      setDraftNote(parts.filter((part) => part !== note).join(", "));
      return;
    }

    setDraftNote([...parts, note].join(", "));
  };

  const handleSave = () => {
    if (!item) return;
    onSave(item.productId, draftNote);
    onClose();
  };

  const handleClose = () => {
    setDraftNote("");
    onClose();
  };

  return (
    <Dialog open={item != null} onClose={handleClose}>
      <DialogHeader>
        <DialogTitle>
          {item
            ? t("pos.noteDialog.title", { name: item.name })
            : t("pos.noteDialog.fallbackTitle")}
        </DialogTitle>
        <DialogDescription>
          {t("pos.noteDialog.description")}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-label uppercase tracking-wide text-text-tertiary">
            {t("pos.noteDialog.quickNotes")}
          </p>
          <div className="flex flex-wrap gap-3">
            {quickNotes.map((note) => {
              const isActive = draftNote
                .split(",")
                .map((part) => part.trim())
                .filter(Boolean)
                .includes(note);

              return (
                <ChipTab
                  key={note}
                  active={isActive}
                  onClick={() => handleToggleCommonNote(note)}
                >
                  {note}
                </ChipTab>
              );
            })}
          </div>
        </div>

        <Input
          value={draftNote}
          onChange={(e) => setDraftNote(e.target.value)}
          placeholder={t("pos.noteDialog.placeholder")}
          maxLength={120}
        />

        <div className="flex gap-4">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={handleClose}
          >
            {t("common.cancel")}
          </Button>
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => setDraftNote("")}
          >
            {t("pos.noteDialog.clearNote")}
          </Button>
          <Button className="flex-1" onClick={handleSave}>
            {t("pos.noteDialog.saveNote")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default ItemNoteDialog;

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import {
  SettingsSectionCard,
  SettingsShell,
} from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";
import { getDefaultQuickNotes } from "@/shared/i18n/presets";
import { quickNoteServiceApi } from "@/shared/services/quick-note";
import { unwrapPayload } from "@/shared/services/unwrap-payload";
import type { QuickNote } from "@/shared/types/quick-note";

const SettingsQuickNotesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const defaultQuickNotes = useMemo(
    () => getDefaultQuickNotes(language),
    [language],
  );
  const [quickNotes, setQuickNotes] = useState<string[]>(defaultQuickNotes);
  const [savedNotes, setSavedNotes] = useState<QuickNote[]>([]);
  const [customNote, setCustomNote] = useState("");

  useEffect(() => {
    if (savedNotes.length === 0) {
      setQuickNotes(defaultQuickNotes);
    }
  }, [defaultQuickNotes, savedNotes.length]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    quickNoteServiceApi
      .getByStoreId(id)
      .then((response) => {
        const notes = unwrapPayload<QuickNote>(response);
        if (!cancelled && notes.length > 0) {
          setSavedNotes(notes);
          setQuickNotes(notes.map((note) => note.text));
        }
      })
      .catch(() => {
        // Fall back to defaults when the backend is unreachable
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleAddQuickNote = async () => {
    const nextNote = customNote.trim();
    if (!nextNote || !id || quickNotes.includes(nextNote)) {
      setCustomNote("");
      return;
    }

    try {
      const response = await quickNoteServiceApi.create({
        storeId: id,
        text: nextNote,
      });
      const created = response.data.data as QuickNote;
      setSavedNotes((prev) => [...prev, created]);
      setQuickNotes((prev) => [...prev, nextNote]);
      setCustomNote("");
    } catch {
      // Keep the input value so the user can retry
    }
  };

  const handleRemoveQuickNote = async (note: string) => {
    if (quickNotes.length === 1) return;

    const saved = savedNotes.find((item) => item.text === note);
    if (saved) {
      try {
        await quickNoteServiceApi.delete(saved.id);
      } catch {
        return;
      }
      setSavedNotes((prev) => prev.filter((item) => item.id !== saved.id));
    }
    setQuickNotes((prev) => prev.filter((item) => item !== note));
  };

  const handleResetDefault = async () => {
    if (!id) return;

    try {
      const response = await quickNoteServiceApi.replace(id, defaultQuickNotes);
      const replaced = unwrapPayload<QuickNote>(response);
      setSavedNotes(replaced);
      setQuickNotes(defaultQuickNotes);
    } catch {
      // Keep the current notes when the request fails
    }
  };

  return (
    <SettingsShell
      title={t("settings.quickNotes.title")}
      description={t("settings.quickNotes.description")}
      onBack={() => navigate(`/store/${id}/settings`)}
    >
      <SettingsSectionCard
        title={t("settings.quickNotes.presetNotes")}
        description={t("settings.quickNotes.presetNotesDescription")}
        action={
          <Button variant="secondary" size="sm" onClick={handleResetDefault}>
            {t("settings.quickNotes.resetDefault")}
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickNotes.map((note) => (
            <Card
              key={note}
              className="flex items-center justify-between gap-3 bg-bg px-4 py-4"
            >
              <span className="text-label text-text-primary">{note}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveQuickNote(note)}
                className="text-text-tertiary hover:bg-danger-bg hover:text-danger"
                aria-label={t("settings.quickNotes.removeAria", { note })}
                disabled={quickNotes.length === 1}
              >
                <LuTrash2 size={16} />
              </Button>
            </Card>
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title={t("settings.quickNotes.addQuickNote")}
        description={t("settings.quickNotes.addQuickNoteDescription")}
      >
        <Card className="bg-bg p-5 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-5">
            <div className="flex-1">
              <Input
                label={t("settings.quickNotes.quickNote")}
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder={t("settings.quickNotes.quickNotePlaceholder")}
                maxLength={60}
              />
            </div>
            <Button
              onClick={handleAddQuickNote}
              className="h-11 sm:min-w-44"
              disabled={customNote.trim().length === 0}
            >
              <LuPlus size={16} />
              {t("settings.quickNotes.addNote")}
            </Button>
          </div>
        </Card>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsQuickNotesPage;

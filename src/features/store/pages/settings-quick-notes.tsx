import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { SettingsSectionCard, SettingsShell } from "@/features/store/components/settings-shell";
import { useTranslation } from "@/shared/i18n/use-translation";
import { getDefaultQuickNotes } from "@/shared/i18n/presets";

const getQuickNotesSettingsKey = (storeId: string) =>
  `store:${storeId}:quick-notes`;

const SettingsQuickNotesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useTranslation();
  const defaultQuickNotes = useMemo(() => getDefaultQuickNotes(language), [language]);
  const [quickNotes, setQuickNotes] = useState<string[]>(defaultQuickNotes);
  const [customNote, setCustomNote] = useState("");
  const storageKey = useMemo(() => (id ? getQuickNotesSettingsKey(id) : ""), [id]);

  useEffect(() => {
    setQuickNotes(defaultQuickNotes);
  }, [defaultQuickNotes]);

  useEffect(() => {
    if (!storageKey) return;

    const stored = localStorage.getItem(storageKey);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored) as string[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setQuickNotes(parsed);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const persistQuickNotes = (nextQuickNotes: string[]) => {
    setQuickNotes(nextQuickNotes);
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(nextQuickNotes));
    }
  };

  const handleAddQuickNote = () => {
    const nextNote = customNote.trim();
    if (!nextNote || quickNotes.includes(nextNote)) {
      setCustomNote("");
      return;
    }

    persistQuickNotes([...quickNotes, nextNote]);
    setCustomNote("");
  };

  const handleRemoveQuickNote = (note: string) => {
    if (quickNotes.length === 1) {
      return;
    }

    persistQuickNotes(quickNotes.filter((item) => item !== note));
  };

  const handleResetDefault = () => {
    persistQuickNotes(defaultQuickNotes);
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
          <Button variant="secondary" size="sm" className="h-11" onClick={handleResetDefault}>
            {t("settings.quickNotes.resetDefault")}
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickNotes.map((note) => (
            <div
              key={note}
              className="flex items-center justify-between gap-3 rounded-radius-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4"
            >
              <span className="text-label font-[var(--weight-medium)] text-[var(--color-text-primary)]">
                {note}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveQuickNote(note)}
                className="flex h-9 w-9 items-center justify-center rounded-radius-full text-[var(--color-text-tertiary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)] active:scale-[0.98]"
                aria-label={t("settings.quickNotes.removeAria", { note })}
                disabled={quickNotes.length === 1}
              >
                <LuTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title={t("settings.quickNotes.addQuickNote")}
        description={t("settings.quickNotes.addQuickNoteDescription")}
      >
        <div className="rounded-radius-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
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
        </div>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsQuickNotesPage;

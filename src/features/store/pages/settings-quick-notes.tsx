import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuPlus, LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { SettingsSectionCard, SettingsShell } from "@/features/store/components/settings-shell";

const DEFAULT_QUICK_NOTES = [
  "ไม่หวาน",
  "ไม่เอาผัก",
  "ไม่ใส่หอม",
  "เผ็ดน้อย",
  "เผ็ดมาก",
  "ไม่ใส่น้ำแข็ง",
];

const getQuickNotesSettingsKey = (storeId: string) =>
  `store:${storeId}:quick-notes`;

const SettingsQuickNotesPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quickNotes, setQuickNotes] = useState<string[]>(DEFAULT_QUICK_NOTES);
  const [customNote, setCustomNote] = useState("");
  const storageKey = useMemo(() => (id ? getQuickNotesSettingsKey(id) : ""), [id]);

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
    persistQuickNotes(DEFAULT_QUICK_NOTES);
  };

  return (
    <SettingsShell
      title="Quick Notes"
      description="Manage the note shortcuts staff can tap quickly while taking orders in POS."
      onBack={() => navigate(`/store/${id}/settings`)}
    >
      <SettingsSectionCard
        title="Preset Notes"
        description="These quick notes appear in the POS note dialog. Keep the most common requests here for faster service."
        action={
          <Button variant="secondary" size="sm" className="h-11" onClick={handleResetDefault}>
            Reset Default
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {quickNotes.map((note) => (
            <div
              key={note}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-4"
            >
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {note}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveQuickNote(note)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--color-text-tertiary)] transition-all duration-[var(--motion-fast)] hover:bg-[var(--color-danger-bg)] hover:text-[var(--color-danger)] active:scale-[0.98]"
                aria-label={`Remove ${note}`}
                disabled={quickNotes.length === 1}
              >
                <LuTrash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard
        title="Add Quick Note"
        description="Add custom shortcuts for your store, such as special preparation requests or kitchen reminders."
      >
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:gap-6">
            <div className="flex-1">
              <Input
                label="Quick note"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Add quick note"
                maxLength={60}
              />
            </div>
            <Button
              onClick={handleAddQuickNote}
              className="h-11 sm:min-w-44"
              disabled={customNote.trim().length === 0}
            >
              <LuPlus size={16} />
              Add Note
            </Button>
          </div>
        </div>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsQuickNotesPage;

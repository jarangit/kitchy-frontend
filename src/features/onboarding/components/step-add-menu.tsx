import { LuTrash2 } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useOnboarding } from "@/features/onboarding/context/onboarding-hooks";

interface Props {
  onSubmit: () => void;
  submitting?: boolean;
  error?: string | null;
}

/**
 * Inline menu builder — no modal, always-visible list of rows.
 *
 * A row counts as "valid" when both name and a positive price are filled.
 * At least one valid row is required to continue.
 */
export function StepAddMenu({ onSubmit, submitting, error }: Props) {
  const { t } = useTranslation();
  const { draft, addMenu, updateMenu, removeMenu } = useOnboarding();

  const validCount = draft.menus.filter(
    (m) => m.name.trim().length > 0 && Number(m.price) > 0,
  ).length;
  const canSubmit = validCount > 0 && !submitting;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-6"
    >
      <div className="text-center">
        <h1 className="mb-2 text-title text-text-primary tracking-tight">
          {t("onboarding.menu.title")}
        </h1>
        <p className="text-body text-text-secondary">
          {t("onboarding.menu.subtitle")}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {draft.menus.map((menu, idx) => {
          const showRemove = draft.menus.length > 1;
          return (
            <div
              key={menu.localId}
              className="rounded-card border border-card-border bg-card-bg p-3"
            >
              <div className="flex items-start gap-2">
                <div className="flex flex-1 flex-col gap-2">
                  <Input
                    placeholder={t("onboarding.menu.namePlaceholder")}
                    value={menu.name}
                    onChange={(e) => updateMenu(menu.localId, { name: e.target.value })}
                    autoFocus={idx === 0 && !menu.name}
                    maxLength={80}
                    aria-label={t("onboarding.menu.nameLabel")}
                  />
                  <Input
                    placeholder={t("onboarding.menu.pricePlaceholder")}
                    value={menu.price}
                    onChange={(e) =>
                      updateMenu(menu.localId, {
                        price: e.target.value.replace(/[^0-9.]/g, ""),
                      })
                    }
                    inputMode="decimal"
                    aria-label={t("onboarding.menu.priceLabel")}
                  />
                </div>
                {showRemove ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMenu(menu.localId)}
                    aria-label={t("onboarding.menu.remove")}
                    className="mt-1"
                  >
                    <LuTrash2 size={18} />
                  </Button>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <Button type="button" variant="ghost" onClick={addMenu}>
        {t("onboarding.menu.addMore")}
      </Button>

      {validCount === 0 ? (
        <p className="text-caption text-text-secondary text-center">
          {t("onboarding.menu.minOneRequired")}
        </p>
      ) : null}

      {error ? (
        <p className="text-caption text-danger text-center">{error}</p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={!canSubmit}
        loading={submitting}
      >
        {t("onboarding.common.next")}
      </Button>
    </form>
  );
}

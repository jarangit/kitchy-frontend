import { LuLightbulb } from "react-icons/lu";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "@/shared/i18n/use-translation";

/** Static guidance panel shown beside the POS preview. */
export function ModifierTipsCard() {
  const { t } = useTranslation();
  const tips = [
    t("settings.modifiers.tipsLine1"),
    t("settings.modifiers.tipsLine2"),
    t("settings.modifiers.tipsLine3"),
  ];

  return (
    <Card
      as="aside"
      aria-label={t("settings.modifiers.tipsTitle")}
      className="border-success-border bg-success-bg"
    >
      <h2 className="flex items-center gap-2 text-title text-success">
        <LuLightbulb className="h-5 w-5" aria-hidden="true" />
        {t("settings.modifiers.tipsTitle")}
      </h2>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-body-sm leading-6 text-text-primary">
        {tips.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </Card>
  );
}

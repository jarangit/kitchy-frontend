import { Spinner } from "@/shared/components/ui/spinner";
import { useLoading } from "@/shared/hooks/useLoading";
import { useTranslation } from "@/shared/i18n/use-translation";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();
  const { t } = useTranslation();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dialog-overlay backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-4 text-text-inverse">
        <Spinner size="lg" label={t("common.loading")} />
        <p className="text-subtitle font-medium">
          {t("common.loadingLong")}
        </p>
      </div>
    </div>
  );
}

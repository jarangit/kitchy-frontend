import { LuActivity } from "react-icons/lu";
import { PageHeader } from "@/shared/components/ui/page-header";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  storeId: string;
  stationName?: string;
  isRefetching: boolean;
}

const KdsHeader = ({ storeId, stationName, isRefetching }: Props) => {
  const { t } = useTranslation();

  const subtitle = stationName
    ? t("kds.header.stationPrefix", { name: stationName })
    : t("kds.header.singleStation");

  return (
    <PageHeader
      backTo={`/store/${storeId}`}
      title={t("kds.header.title")}
      subtitle={subtitle}
      action={
        <span className="inline-flex items-center gap-2 rounded-chip border border-border bg-chip-inactive-bg px-3 py-1.5 text-label text-text-secondary">
          <LuActivity size={14} className={isRefetching ? "animate-pulse" : ""} />
          {isRefetching ? t("kds.header.updating") : t("kds.header.autoRefresh")}
        </span>
      }
    />
  );
};

export default KdsHeader;

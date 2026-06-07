import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useAppSelector } from "@/shared/hooks/hooks";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";

interface Props {
  groups: KdsOrderGroup[];
}

const KdsStatsBar = ({ groups }: Props) => {
  const { t } = useTranslation();
  const storeId = useAppSelector((state) => state.currentStore.storeId);

  const orderCount = groups.length;
  const itemCount = groups.reduce(
    (sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0),
    0
  );

  return (
    <div className="flex items-center justify-between rounded-card bg-primary px-4 py-2.5 text-text-inverse">
      <span className="flex items-center gap-3 text-caption font-semibold uppercase tracking-[0.08em]">
        <span className="text-text-inverse/60">{t("kds.stats.ordersLabel")}</span>
        <span className="font-mono text-title text-accent tabular-nums">{orderCount}</span>
        <span className="text-text-inverse/30">·</span>
        <span className="text-text-inverse/60">{t("kds.stats.itemsLabel")}</span>
        <span className="font-mono text-title text-accent tabular-nums">{itemCount}</span>
      </span>

      {storeId && (
        <Link
          to={`/store/${storeId}`}
          className="flex items-center gap-1.5 text-caption font-semibold uppercase tracking-[0.08em] transition-colors hover:text-text-inverse/60"
        >
          <LuArrowLeft size={15} />
          {t("kds.header.back")}
        </Link>
      )}
    </div>
  );
};

export default KdsStatsBar;

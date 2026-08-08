import { Link } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";
import { BusyProgress } from "@/shared/components/ui/busy-progress";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useAppSelector } from "@/shared/hooks/hooks";
import type { KdsOrderGroup } from "@/features/kds/types/kds.model";

interface Props {
  groups: KdsOrderGroup[];
  orderLimit: number;
}

const KdsStatsBar = ({ groups, orderLimit }: Props) => {
  const { t } = useTranslation();
  const storeId = useAppSelector((state) => state.currentStore.storeId);

  const itemCount = groups.reduce(
    (sum, g) => sum + g.items.reduce((s, i) => s + i.quantity, 0),
    0,
  );

  return (
    <div className="rounded-card bg-primary px-4 py-2.5 text-on-primary">
      <div className="flex flex-col gap-2.5 sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,340px)_minmax(0,1fr)] sm:items-center sm:gap-3">
        <span className="flex items-center gap-2 text-caption font-medium tracking-[0.06em] text-on-primary/80 sm:justify-self-start">
          <span className="text-on-primary/60">
            {t("kds.stats.itemsLabel")}
          </span>
          <span className="font-mono tabular-nums text-on-primary">
            {itemCount}
          </span>
          <span className="text-on-primary/30">/</span>
          <span className="font-mono tabular-nums text-on-primary/70">
            {orderLimit}
          </span>
        </span>

        <BusyProgress
          count={itemCount}
          limit={orderLimit}
          className="w-full justify-self-center"
        />

        {storeId ? (
          <Link
            to={`/store/${storeId}`}
            className="flex items-center gap-1.5 text-caption font-medium tracking-[0.06em] text-on-primary/70 transition-colors hover:text-on-primary/55 sm:justify-self-end"
          >
            <LuArrowLeft size={15} />
            {t("kds.header.back")}
          </Link>
        ) : (
          <span className="hidden sm:block" aria-hidden="true" />
        )}
      </div>
    </div>
  );
};

export default KdsStatsBar;

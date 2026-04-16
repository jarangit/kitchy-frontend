import type { KdsCard, KdsStatus } from "@/features/kds/types/kds.model";
import KdsOrderCard from "@/features/kds/components/kds-order-card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { LuUtensilsCrossed } from "react-icons/lu";

interface Props {
  title: string;
  status: KdsStatus;
  cards: KdsCard[];
  onMove: (card: KdsCard, status: KdsStatus) => void;
  disabled?: boolean;
}

const KdsColumn = ({ title, status, cards, onMove, disabled }: Props) => {
  return (
    <section className="min-w-[320px] flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-subtitle font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
          {title}
        </h2>
        <span className="text-label font-[var(--weight-medium)] text-[var(--color-text-secondary)]">
          {cards.length}
        </span>
      </div>

      {cards.length === 0 ? (
        <EmptyState
          icon={<LuUtensilsCrossed size={28} />}
          title={`No ${status.toLowerCase()} items`}
          description="Items will appear automatically"
        />
      ) : (
        <div className="space-y-3 overflow-y-auto pr-1">
          {cards.map((card) => (
            <KdsOrderCard
              key={card.orderStationItemId}
              card={card}
              onMove={onMove}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default KdsColumn;

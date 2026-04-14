import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { ICalendarDay } from "@/features/report/types/report.model";

interface Props {
  day: ICalendarDay | null;
  open: boolean;
  onClose: () => void;
}

const formatCurrency = (value: number): string =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

const DayDetailDialog = ({ day, open, onClose }: Props) => {
  if (!day) return null;

  const avg = day.orders > 0 ? Math.round(day.revenue / day.orders) : 0;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>
          {format(parseISO(day.date), "d MMM yyyy")}
        </DialogTitle>
      </DialogHeader>

      {/* Revenue */}
      <div className="text-center mb-5">
        <div className="text-[28px] font-bold text-[var(--color-text-primary)] leading-tight">
          {formatCurrency(day.revenue)}
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">
          Revenue
        </div>
      </div>

      {/* Orders + Avg */}
      <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)] mb-5">
        <span className="font-medium text-[var(--color-text-primary)]">
          {day.orders}
        </span>
        <span>Orders</span>
        <span className="text-[var(--color-text-tertiary)]">&middot;</span>
        <span>Avg</span>
        <span className="font-medium text-[var(--color-text-primary)]">
          {formatCurrency(avg)}
        </span>
      </div>

      {/* Top Products */}
      {day.topProducts.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-[var(--color-text-primary)] mb-3">
            Top Products
          </h4>
          <div className="space-y-2">
            {day.topProducts.map((product, idx) => (
              <div
                key={product.productId}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-5 h-5 rounded-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-[var(--color-text-primary)] truncate">
                    {product.name}
                  </span>
                </div>
                <span className="text-xs text-[var(--color-text-tertiary)] shrink-0 ml-2">
                  {product.quantitySold}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default DayDetailDialog;

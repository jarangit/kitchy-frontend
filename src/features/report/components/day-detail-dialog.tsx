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

      <div className="space-y-6">
        <div>
          <div className="text-label text-text-secondary">Revenue</div>
          <div className="mt-1 text-heading font-semibold text-text-primary leading-tight">
            {formatCurrency(day.revenue)}
          </div>
        </div>

        <div className="flex items-center gap-3 text-label text-text-secondary">
          <span>
            Orders <span className="font-semibold text-text-primary">{day.orders}</span>
          </span>
          <span className="text-text-tertiary">|</span>
          <span>
            Avg <span className="font-semibold text-text-primary">{formatCurrency(avg)}</span>
          </span>
        </div>

        <div>
          <h4 className="text-label font-semibold text-text-primary mb-3">
            Top products
          </h4>
          <div className="space-y-2.5">
            {day.topProducts.map((product, idx) => (
              <div
                key={product.productId}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="text-label text-text-secondary shrink-0">
                    {idx + 1}.
                  </span>
                  <span className="text-body-sm text-text-primary truncate">
                    {product.name}
                  </span>
                </div>
                <span className="text-label text-text-secondary shrink-0">
                  {product.quantitySold}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-label font-semibold text-text-primary mb-3">
            Payment
          </h4>
          <div className="space-y-2.5">
            {day.paymentBreakdown.map((payment) => (
              <div
                key={payment.method}
                className="flex items-center justify-between gap-3"
              >
                <span className="text-body-sm text-text-primary">
                  {payment.method}
                </span>
                <span className="text-label text-text-secondary shrink-0">
                  {formatCurrency(payment.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default DayDetailDialog;

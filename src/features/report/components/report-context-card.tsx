import type {
  IPaymentBreakdown,
  ITopProduct,
} from "@/features/report/types/report.model";

interface Props {
  products: ITopProduct[];
  paymentBreakdown: IPaymentBreakdown[];
  title?: string;
}

const formatCurrency = (value: number): string =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

const ReportContextCard = ({
  products,
  paymentBreakdown,
  title = "Top Products",
}: Props) => {
  if (products.length === 0 && paymentBreakdown.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface border border-border rounded-radius-lg p-5">
      <div className="grid gap-5 md:grid-cols-[minmax(0,1.5fr)_minmax(220px,1fr)] md:items-start">
        {products.length > 0 && (
          <div>
            <h3 className="text-subtitle text-text-primary mb-4">
              {title}
            </h3>
            <div className="space-y-2.5">
              {products.map((product, idx) => (
                <div
                  key={product.productId}
                  className="flex items-center justify-between gap-3 py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 h-6 rounded-radius-full bg-primary text-text-inverse text-caption font-[var(--weight-semibold)] flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-body-sm font-[var(--weight-medium)] text-text-primary truncate">
                      {product.name}
                    </span>
                  </div>
                  <span className="text-caption text-text-tertiary shrink-0 ml-2 whitespace-nowrap">
                    {product.quantitySold} sold
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {paymentBreakdown.length > 0 && (
          <div className="md:border-l md:border-border md:pl-5">
            <h4 className="text-label font-[var(--weight-semibold)] text-text-primary mb-3 md:mt-1">
              Payment
            </h4>
            <div className="space-y-2.5">
              {paymentBreakdown.map((payment) => (
                <div
                  key={payment.method}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-body-sm text-text-primary">
                    {payment.method}
                  </span>
                  <span className="text-label text-text-secondary shrink-0 whitespace-nowrap">
                    {formatCurrency(payment.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportContextCard;

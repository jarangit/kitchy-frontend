import type { ITopProduct } from "@/features/report/types/report.model";

interface Props {
  products: ITopProduct[];
  title?: string;
}

const formatCurrency = (value: number): string =>
  `฿${new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)}`;

const TopProductsList = ({ products, title = "Top Products" }: Props) => {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-5">
      <h3 className="text-subtitle text-[var(--color-text-primary)] mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {products.map((product, idx) => (
          <div
            key={product.productId}
            className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 h-6 rounded-radius-full bg-[var(--color-primary)] text-[var(--color-text-inverse)] text-caption font-[var(--weight-bold)] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span className="text-body-sm font-[var(--weight-medium)] text-[var(--color-text-primary)] truncate">
                {product.name}
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-caption text-[var(--color-text-tertiary)]">
                {product.quantitySold} sold
              </span>
              <span className="text-body-sm font-[var(--weight-medium)] text-[var(--color-text-primary)] w-20 text-right">
                {formatCurrency(product.revenue)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProductsList;

import type { ITopProduct } from "@/features/report/types/report.model";
import { Card } from "@/shared/components/ui/card";

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
    <Card className="p-5">
      <h3 className="text-subtitle text-text-primary mb-4">
        {title}
      </h3>
      <div className="space-y-3">
        {products.map((product, idx) => (
          <div
            key={product.productId}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-6 h-6 rounded-radius-full bg-primary text-text-inverse text-caption font-[var(--weight-semibold)] flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <span className="text-body-sm font-[var(--weight-medium)] text-text-primary truncate">
                {product.name}
              </span>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-caption text-text-tertiary">
                {product.quantitySold} sold
              </span>
              <span className="text-body-sm font-[var(--weight-medium)] text-text-primary w-20 text-right">
                {formatCurrency(product.revenue)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TopProductsList;

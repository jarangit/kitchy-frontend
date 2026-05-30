import { LuPackage } from "react-icons/lu";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
  quantityByProductId: Record<string, number>;
}

/** Deterministic tonal swatch for the initial circle — keeps POS visually sortable */
const nameColors = [
  "bg-success-bg text-success",
  "bg-info-bg text-info",
  "bg-warning-bg text-warning",
  "bg-danger-bg text-danger",
];

function getColorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return nameColors[Math.abs(hash) % nameColors.length];
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

const ProductGrid = ({ products, onAddToCart, quantityByProductId }: Props) => {
  const { t } = useTranslation();

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<LuPackage size={40} />}
        title={t("pos.grid.emptyTitle")}
        description={t("pos.grid.emptyDescription")}
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => {
        const quantity = quantityByProductId[product.id] ?? 0;
        const isSelected = quantity > 0;

        return (
          <button
            key={product.id}
            onClick={() => onAddToCart(product)}
            data-onboarding-target={`product-card-${product.id}`}
            className={cn(
              "relative flex min-h-[176px] cursor-pointer flex-col items-center justify-center rounded-card bg-card-bg p-5 transition-all duration-[var(--motion-fast)]",
              "border border-card-border",
              "hover:border-border-hover hover:-translate-y-[1px]",
              isSelected && "border-accent shadow-[inset_0_0_0_1px_var(--color-accent)]",
            )}
          >
            {isSelected && (
              <span className="absolute right-2 top-2 inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-accent px-2 text-label font-semibold text-on-accent tabular-nums">
                {quantity}
              </span>
            )}
            <div
              className={cn(
                "mb-5 flex h-16 w-16 items-center justify-center rounded-full text-title",
                getColorForName(product.name),
              )}
            >
              {product.name.charAt(0).toUpperCase()}
            </div>
            <span className="line-clamp-2 text-center text-body font-medium leading-tight text-text-primary">
              {product.name}
            </span>
            <span className="mt-3 text-title tabular-nums text-text-primary">
              {formatPrice(product.price)}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default ProductGrid;

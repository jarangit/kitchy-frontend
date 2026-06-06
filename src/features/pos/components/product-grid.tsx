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
  onDecreaseQuantity: (productId: string) => void;
  quantityByProductId: Record<string, number>;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

const ProductGrid = ({
  products,
  onAddToCart,
  onDecreaseQuantity,
  quantityByProductId,
}: Props) => {
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
    <div className="flex min-h-0 flex-1 max-h-[calc(100dvh-14rem)] flex-col overflow-y-auto pr-1">
      <div className="page-grid grid flex-none content-start grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => {
          const quantity = quantityByProductId[product.id] ?? 0;
          const isSelected = quantity > 0;

          return (
            <div key={product.id} className="relative">
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                data-onboarding-target={`product-card-${product.id}`}
                className={cn(
                  "relative flex min-h-[156px] w-full cursor-pointer flex-col items-center justify-center rounded-card bg-card-bg p-4 transition-all duration-[var(--motion-fast)]",
                  "border border-card-border",
                  "hover:border-border-hover hover:-translate-y-[1px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  isSelected && "accent-inset-ring border-accent",
                )}
                aria-label={`${product.name} ${formatPrice(product.price)}`}
              >
                {isSelected && (
                  <span className="absolute right-2 top-2 inline-flex min-h-8 min-w-8 items-center justify-center rounded-full bg-accent px-2 text-label font-semibold text-on-accent shadow-xs tabular-nums">
                    {quantity}
                  </span>
                )}
                <div
                  className={cn(
                    "mb-4 flex h-16 w-16 items-center justify-center rounded-full text-title",
                    isSelected ? "bg-accent/10 text-accent" : "bg-surface text-text-secondary",
                  )}
                >
                  {product.name.charAt(0).toUpperCase()}
                </div>
                <span className="line-clamp-2 text-center text-body font-medium leading-tight text-text-primary">
                  {product.name}
                </span>
                <span className="mt-2 text-title tabular-nums text-text-primary">
                  {formatPrice(product.price)}
                </span>
              </button>
              {isSelected && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDecreaseQuantity(product.id);
                  }}
                  className="absolute left-2 top-2 z-10 inline-flex min-h-8 min-w-8 items-center justify-center rounded-full border border-card-border bg-bg px-2 text-label font-bold leading-none text-text-primary shadow-xs transition-all duration-[var(--motion-fast)] hover:scale-[1.03] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.97]"
                  aria-label={t("pos.cart.decreaseQuantity")}
                  title={t("pos.cart.decreaseQuantity")}
                >
                  -
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductGrid;

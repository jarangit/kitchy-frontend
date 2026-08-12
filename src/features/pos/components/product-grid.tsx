import { LuPackage } from "react-icons/lu";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
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
      <div className="page-grid grid auto-rows-fr flex-none content-start grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {products.map((product) => {
          const quantity = quantityByProductId[product.id] ?? 0;
          const isSelected = quantity > 0;

          return (
            <div key={product.id} className="relative h-full">
              <button
                type="button"
                onClick={() => onAddToCart(product)}
                data-onboarding-target={`product-card-${product.id}`}
                className={cn(
                  "relative flex h-full min-h-[156px] w-full cursor-pointer flex-col overflow-hidden rounded-card transition-all duration-fast",
                  "hover:-translate-y-[1px]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
                  isSelected ? "accent-inset-ring bg-accent-bg" : "bg-card-bg",
                )}
                aria-label={`${product.name} ${formatPrice(product.price)}`}
              >
                {isSelected && (
                  <span className="absolute right-2 top-2 inline-flex min-h-8 min-w-8 items-center justify-center rounded-full bg-accent px-2 text-label font-semibold text-on-accent shadow-xs tabular-nums">
                    {quantity}
                  </span>
                )}
                <div className="flex aspect-square w-full items-center justify-center overflow-hidden border-b border-card-border bg-surface">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={cn(
                        "flex h-full w-full items-center justify-center text-title",
                        isSelected ? "text-accent-text" : "text-text-secondary",
                      )}
                    >
                      {product.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col items-center justify-center px-3 py-3">
                  <span className="line-clamp-2 text-center text-body-sm font-medium leading-tight text-text-primary">
                    {product.name}
                  </span>
                  <span className="mt-1.5 text-subtitle tabular-nums text-text-primary">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </button>
              {isSelected && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDecreaseQuantity(product.id);
                  }}
                  className="absolute left-2 top-2 z-10 inline-flex min-h-8 min-w-8 items-center justify-center rounded-full border border-card-border bg-bg px-2 text-label font-bold leading-none text-text-primary shadow-xs transition-all duration-fast hover:scale-[1.03] hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30 focus-visible:ring-offset-2 focus-visible:ring-offset-bg active:scale-[0.97]"
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

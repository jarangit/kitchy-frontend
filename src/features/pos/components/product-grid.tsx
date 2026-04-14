import { LuPackage } from "react-icons/lu";
import { EmptyState } from "@/shared/components/ui/empty-state";

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

/** Deterministic color from product name for the initial circle */
const nameColors = [
  "bg-[var(--color-success-bg)] text-[var(--color-success)]",
  "bg-[var(--color-info-bg)] text-[var(--color-info)]",
  "bg-[var(--color-warning-bg)] text-[var(--color-warning)]",
  "bg-[var(--color-danger-bg)] text-[var(--color-danger)]",
];

function getColorForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return nameColors[Math.abs(hash) % nameColors.length];
}

const ProductGrid = ({ products, onAddToCart, quantityByProductId }: Props) => {
  if (products.length === 0) {
    return (
      <EmptyState
        icon={<LuPackage size={40} />}
        title="No products found"
        description="Try selecting a different category"
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddToCart(product)}
          className={`relative flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-xl bg-[var(--color-bg)] p-5 transition-all duration-[var(--motion-fast)] hover:shadow-md active:scale-[0.98] ${
            (quantityByProductId[product.id] ?? 0) > 0
              ? "border-2 border-[var(--color-primary)]"
              : "border border-[var(--color-border)] hover:border-[var(--color-text-primary)]"
          }`}
        >
          {(quantityByProductId[product.id] ?? 0) > 0 && (
            <span className="absolute top-2 right-2 inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-[var(--color-primary)] px-1.5 text-sm font-semibold text-[var(--color-text-inverse)] tabular-nums">
              {quantityByProductId[product.id]}
            </span>
          )}
          <div
            className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold ${getColorForName(product.name)}`}
          >
            {product.name.charAt(0).toUpperCase()}
          </div>
          <span className="line-clamp-2 text-center text-base font-medium leading-tight text-[var(--color-text-primary)]">
            {product.name}
          </span>
          <span className="mt-1.5 text-lg font-semibold text-[var(--color-success)]">
            ฿{product.price.toFixed(2)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ProductGrid;

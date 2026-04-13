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

const ProductGrid = ({ products, onAddToCart }: Props) => {
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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddToCart(product)}
          className="flex flex-col items-center justify-center bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 min-h-[120px] hover:border-[var(--color-text-primary)] hover:shadow-md transition-all duration-[var(--motion-fast)] cursor-pointer active:scale-[0.98]"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 text-lg font-bold ${getColorForName(product.name)}`}
          >
            {product.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)] text-center leading-tight line-clamp-2">
            {product.name}
          </span>
          <span className="text-base font-bold text-[var(--color-success)] mt-1">
            ฿{product.price.toFixed(2)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ProductGrid;

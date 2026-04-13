interface Product {
  id: number;
  name: string;
  price: number;
}

interface Props {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ products, onAddToCart }: Props) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {products.map((product) => (
        <button
          key={product.id}
          onClick={() => onAddToCart(product)}
          className="flex flex-col items-center justify-center bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-text-primary)] hover:shadow-md transition-all cursor-pointer active:scale-95"
        >
          <div className="w-12 h-12 bg-[var(--color-surface)] rounded-lg flex items-center justify-center mb-2">
            <span className="text-2xl">🍽</span>
          </div>
          <span className="text-sm font-medium text-[var(--color-text-primary)] text-center leading-tight">
            {product.name}
          </span>
          <span className="text-sm font-bold text-[var(--color-success)] mt-1">
            ฿{product.price.toFixed(2)}
          </span>
        </button>
      ))}
    </div>
  );
};

export default ProductGrid;

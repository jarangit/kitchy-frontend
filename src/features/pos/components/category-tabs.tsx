interface Props {
  categories: { id: string; name: string }[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryTabs = ({ categories, selected, onSelect }: Props) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <button
        onClick={() => onSelect("ALL")}
        className={`h-12 whitespace-nowrap rounded-full px-6 py-3 text-base font-medium transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
          selected === "ALL"
            ? "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]"
            : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`h-12 whitespace-nowrap rounded-full px-6 py-3 text-base font-medium transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
            selected === cat.id
              ? "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]"
              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;

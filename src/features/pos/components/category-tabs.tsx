interface Props {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryTabs = ({ categories, selected, onSelect }: Props) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect("ALL")}
        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
          selected === "ALL"
            ? "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]"
            : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
            selected === cat
              ? "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]"
              : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;

import { ChipTab } from "@/shared/components/ui/chip-tab";

interface Props {
  categories: { id: string; name: string }[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryTabs = ({ categories, selected, onSelect }: Props) => {
  return (
    <div className="flex gap-3 overflow-x-auto pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <ChipTab
        size="lg"
        active={selected === "ALL"}
        onClick={() => onSelect("ALL")}
      >
        All
      </ChipTab>
      {categories.map((cat) => (
        <ChipTab
          key={cat.id}
          size="lg"
          active={selected === cat.id}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </ChipTab>
      ))}
    </div>
  );
};

export default CategoryTabs;

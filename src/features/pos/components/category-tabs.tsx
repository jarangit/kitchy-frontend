import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";

interface Props {
  categories: { id: string; name: string }[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryTabs = ({ categories, selected, onSelect }: Props) => {
  return (
    <Tabs value={selected} onChange={onSelect} variant="chip" size="lg">
      <TabList
        scrollable
        className="gap-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <Tab value="ALL">All</Tab>
        {categories.map((cat) => (
          <Tab key={cat.id} value={cat.id}>
            {cat.name}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default CategoryTabs;

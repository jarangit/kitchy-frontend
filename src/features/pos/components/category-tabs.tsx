import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
import { useTranslation } from "@/shared/i18n/use-translation";

interface Props {
  categories: { id: string; name: string }[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryTabs = ({ categories, selected, onSelect }: Props) => {
  const { t } = useTranslation();

  return (
    <Tabs value={selected} onChange={onSelect} variant="chip" size="lg">
      <TabList
        aria-label={t("pos.cart.categoriesLabel")}
        scrollable
        className="gap-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <Tab value="ALL">{t("pos.cart.allCategories")}</Tab>
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

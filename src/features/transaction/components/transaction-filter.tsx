import { useState } from "react";
import { SearchInput } from "@/shared/components/ui/search-input";
import { ChipTab } from "@/shared/components/ui/chip-tab";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";

interface Props {
  onFilterChange: (filter: { search: string; status: string }) => void;
}

const STATUS_OPTIONS: ReadonlyArray<{ value: string; labelKey: MessageKey }> = [
  { value: "ALL", labelKey: "transaction.filter.all" },
  { value: "IN_PROGRESS", labelKey: "transaction.filter.inProgress" },
  { value: "DONE", labelKey: "transaction.filter.done" },
  { value: "CANCELLED", labelKey: "transaction.filter.cancelled" },
];

const TransactionFilter = ({ onFilterChange }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, status });
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onFilterChange({ search, status: value });
  };

  return (
    <div className="space-y-3">
      <SearchInput
        value={search}
        onValueChange={handleSearchChange}
        placeholder={t("transaction.filter.searchPlaceholder")}
      />
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => (
          <ChipTab
            key={s.value}
            size="sm"
            active={status === s.value}
            onClick={() => handleStatusChange(s.value)}
          >
            {t(s.labelKey)}
          </ChipTab>
        ))}
      </div>
    </div>
  );
};

export default TransactionFilter;

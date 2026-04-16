import { useState } from "react";
import { SearchInput } from "@/shared/components/ui/search-input";
import { ChipTab } from "@/shared/components/ui/chip-tab";

interface Props {
  onFilterChange: (filter: { search: string; status: string }) => void;
}

const TransactionFilter = ({ onFilterChange }: Props) => {
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
        placeholder="Search order number..."
      />
      <div className="flex gap-2 flex-wrap">
        {[
          { value: "ALL", label: "All" },
          { value: "NEW", label: "New" },
          { value: "PREPARING", label: "Preparing" },
          { value: "READY", label: "Ready" },
        ].map((s) => (
          <ChipTab
            key={s.value}
            size="sm"
            active={status === s.value}
            onClick={() => handleStatusChange(s.value)}
          >
            {s.label}
          </ChipTab>
        ))}
      </div>
    </div>
  );
};

export default TransactionFilter;

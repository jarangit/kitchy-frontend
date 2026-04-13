import { useState } from "react";
import { SearchInput } from "@/shared/components/ui/search-input";

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
      <div className="flex gap-2">
        {["ALL", "PENDING", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
              status === s
                ? "bg-[var(--color-text-primary)] text-[var(--color-text-inverse)]"
                : "bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
            }`}
          >
            {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TransactionFilter;

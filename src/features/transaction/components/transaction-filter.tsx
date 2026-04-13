import { useState } from "react";

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
    <div className="flex gap-3 flex-wrap">
      <input
        type="text"
        placeholder="Search order number..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="flex-1 min-w-[200px] border border-[var(--color-border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--input-border-focus)]"
      />
      <div className="flex gap-2">
        {["ALL", "PENDING", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-[var(--motion-fast)] active:scale-[0.98] ${
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

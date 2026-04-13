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
        className="flex-1 min-w-[200px] border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-black"
      />
      <div className="flex gap-2">
        {["ALL", "PENDING", "COMPLETED"].map((s) => (
          <button
            key={s}
            onClick={() => handleStatusChange(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              status === s
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
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

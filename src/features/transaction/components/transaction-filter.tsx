import { useState } from "react";
import { SearchInput } from "@/shared/components/ui/search-input";
import { SegmentedControl } from "@/shared/components/ui/segmented-control";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";

export type TransactionFilterStatus =
  | "ALL"
  | "IN_PROGRESS"
  | "DONE"
  | "CANCELLED";

export interface TransactionFilterCounts {
  all: number;
  inProgress: number;
  done: number;
  cancelled: number;
}

interface Props {
  counts: TransactionFilterCounts;
  onFilterChange: (filter: {
    search: string;
    status: TransactionFilterStatus;
  }) => void;
}

const STATUS_OPTIONS: ReadonlyArray<{
  value: TransactionFilterStatus;
  labelKey: MessageKey;
  countKey: keyof TransactionFilterCounts;
}> = [
  { value: "ALL", labelKey: "transaction.filter.all", countKey: "all" },
  {
    value: "IN_PROGRESS",
    labelKey: "transaction.filter.inProgress",
    countKey: "inProgress",
  },
  { value: "DONE", labelKey: "transaction.filter.done", countKey: "done" },
  {
    value: "CANCELLED",
    labelKey: "transaction.filter.cancelled",
    countKey: "cancelled",
  },
];

const TransactionFilter = ({ counts, onFilterChange }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TransactionFilterStatus>("ALL");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, status });
  };

  const handleStatusChange = (value: TransactionFilterStatus) => {
    setStatus(value);
    onFilterChange({ search, status: value });
  };

  const items = STATUS_OPTIONS.map((s) => ({
    key: s.value,
    label: t("transaction.list.countSummary", {
      label: t(s.labelKey),
      count: counts[s.countKey],
    }),
  }));

  return (
    <div className="space-y-3">
      <SearchInput
        value={search}
        onValueChange={handleSearchChange}
        placeholder={t("transaction.filter.searchPlaceholder")}
      />
      <SegmentedControl
        fullWidth
        items={items}
        value={status}
        onChange={handleStatusChange}
      />
    </div>
  );
};

export default TransactionFilter;

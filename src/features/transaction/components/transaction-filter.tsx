import { useState } from "react";
import { LuSearch, LuX } from "react-icons/lu";
import { SearchInput } from "@/shared/components/ui/search-input";
import { IconButton } from "@/shared/components/ui/icon-button";
import { DropdownSelect } from "@/shared/components/ui/dropdown-select";
import { Tabs, TabList, Tab } from "@/shared/components/ui/tabs";
import { useTranslation } from "@/shared/i18n/use-translation";
import type { MessageKey } from "@/shared/i18n/messages";
import { cn } from "@/shared/utils/cn";

export type TransactionFilterStatus =
  "ALL" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type TransactionOrderTypeFilter =
  "ALL" | "DINE_IN" | "TOGO" | "DELIVERY";

export type TransactionDateRange =
  "ALL" | "TODAY" | "YESTERDAY" | "LAST_7_DAYS";

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
    orderType: TransactionOrderTypeFilter;
    dateRange: TransactionDateRange;
  }) => void;
}

const STATUS_OPTIONS: ReadonlyArray<{
  value: TransactionFilterStatus;
  labelKey: MessageKey;
  countKey: keyof TransactionFilterCounts;
}> = [
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
  { value: "ALL", labelKey: "transaction.filter.all", countKey: "all" },
];

const TransactionFilter = ({ counts, onFilterChange }: Props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<TransactionFilterStatus>("IN_PROGRESS");
  const [orderType, setOrderType] = useState<TransactionOrderTypeFilter>("ALL");
  const [dateRange, setDateRange] = useState<TransactionDateRange>("TODAY");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const emitFilterChange = (patch: {
    search?: string;
    status?: TransactionFilterStatus;
    orderType?: TransactionOrderTypeFilter;
    dateRange?: TransactionDateRange;
  }) => {
    onFilterChange({
      search: patch.search ?? search,
      status: patch.status ?? status,
      orderType: patch.orderType ?? orderType,
      dateRange: patch.dateRange ?? dateRange,
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    emitFilterChange({ search: value });
  };

  const handleStatusChange = (value: TransactionFilterStatus) => {
    setStatus(value);
    emitFilterChange({ status: value });
  };

  const handleOrderTypeChange = (value: TransactionOrderTypeFilter) => {
    setOrderType(value);
    emitFilterChange({ orderType: value });
  };

  const handleDateRangeChange = (value: TransactionDateRange) => {
    setDateRange(value);
    emitFilterChange({ dateRange: value });
  };

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  const handleCloseSearch = () => {
    setIsSearchOpen(false);
    if (search !== "") {
      setSearch("");
      emitFilterChange({ search: "" });
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      handleCloseSearch();
    }
  };

  const items = STATUS_OPTIONS.map((s) => ({
    key: s.value,
    label: t(s.labelKey),
    count: counts[s.countKey],
  }));

  const orderTypeOptions = [
    { value: "ALL", label: t("transaction.filter.orderType.all") },
    { value: "DINE_IN", label: t("transaction.filter.orderType.dineIn") },
    { value: "TOGO", label: t("transaction.filter.orderType.togo") },
    { value: "DELIVERY", label: t("transaction.filter.orderType.delivery") },
  ];

  const dateRangeOptions = [
    { value: "ALL", label: t("transaction.filter.date.all") },
    { value: "TODAY", label: t("transaction.filter.date.today") },
    { value: "YESTERDAY", label: t("transaction.filter.date.yesterday") },
    { value: "LAST_7_DAYS", label: t("transaction.filter.date.last7Days") },
  ];

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
      <Tabs
        value={status}
        onChange={(v) => handleStatusChange(v as TransactionFilterStatus)}
        variant="segmented"
        className="lg:shrink-0"
      >
        <TabList aria-label={t("transaction.filter.statusLabel")}>
          {items.map((item) => (
            <Tab
              key={item.key}
              value={item.key}
              className="gap-1.5 whitespace-nowrap"
            >
              <span className="whitespace-nowrap">{item.label}</span>
              <span
                className={cn(
                  "tabular-nums whitespace-nowrap",
                  status === item.key
                    ? "text-segment-active-text"
                    : "text-text-secondary",
                )}
              >
                ({item.count})
              </span>
            </Tab>
          ))}
        </TabList>
      </Tabs>
      <div className="flex flex-wrap items-center gap-2 lg:ml-auto">
        <DropdownSelect
          aria-label={t("transaction.filter.orderTypeLabel")}
          value={orderType}
          onValueChange={(v) =>
            handleOrderTypeChange(v as TransactionOrderTypeFilter)
          }
          options={orderTypeOptions}
          className="min-w-[132px] !rounded-full"
        />
        <DropdownSelect
          aria-label={t("transaction.filter.dateLabel")}
          value={dateRange}
          onValueChange={(v) =>
            handleDateRangeChange(v as TransactionDateRange)
          }
          options={dateRangeOptions}
          className="min-w-[132px] !rounded-full"
        />
        {isSearchOpen ? (
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onValueChange={handleSearchChange}
              placeholder={t("transaction.filter.searchPlaceholder")}
              className="w-[160px] flex-1 sm:w-[200px] lg:w-[240px]"
              autoFocus
              onKeyDown={handleSearchKeyDown}
            />
            <IconButton
              aria-label={t("common.close")}
              title={t("common.close")}
              onClick={handleCloseSearch}
              size="sm"
              className="shrink-0"
            >
              <LuX size={18} aria-hidden="true" />
            </IconButton>
          </div>
        ) : (
          <IconButton
            aria-label={t("transaction.filter.searchPlaceholder")}
            title={t("transaction.filter.searchPlaceholder")}
            onClick={handleOpenSearch}
            size="sm"
            className="border border-border bg-surface shadow-sm hover:bg-surface-hover"
          >
            <LuSearch size={18} aria-hidden="true" />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default TransactionFilter;

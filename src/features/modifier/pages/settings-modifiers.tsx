import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft, LuPlus, LuSlidersHorizontal } from "react-icons/lu";
import { useModifierService } from "@/features/modifier/hooks/useModifierService";
import { ModifierGroupTable } from "@/features/modifier/components/modifier-group-table";
import { SettingsFrame } from "@/features/store/components/settings-frame";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { SearchInput } from "@/shared/components/ui/search-input";
import { DropdownSelect } from "@/shared/components/ui/dropdown-select";
import { useTranslation } from "@/shared/i18n/use-translation";
import { useStoreRouteParam } from "@/shared/hooks/use-store-route-param";
import {
  DataTablePagination,
  type SortingState,
} from "@/shared/components/ui/data-table";

type StatusFilter = "all" | "active" | "inactive";

const MODIFIER_PAGE_SIZE = 10;

/**
 * Modifier group list. Creating, editing, options, and product assignment
 * all live on the full detail page — this screen only lists groups and
 * offers permanent deletion (with confirmation, since it cannot be undone).
 */
const SettingsModifiersPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedStoreId = useStoreRouteParam();
  const { groupsQuery, groupsQueryLoading } = useModifierService();

  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [pageIndex, setPageIndex] = useState(0);

  const detailBasePath = `/store/${resolvedStoreId}/settings/modifiers`;
  const openDetail = (id: string) => navigate(`${detailBasePath}/${id}`);

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return groupsQuery.filter((group) => {
      if (q && !group.name.toLowerCase().includes(q)) return false;
      if (statusFilter === "active" && !group.isActive) return false;
      if (statusFilter === "inactive" && group.isActive) return false;
      return true;
    });
  }, [groupsQuery, search, statusFilter]);

  const totalFiltered = filteredGroups.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / MODIFIER_PAGE_SIZE));
  const safePageIndex = Math.min(pageIndex, totalPages - 1);
  const paginatedGroups = useMemo(() => {
    const start = safePageIndex * MODIFIER_PAGE_SIZE;
    return filteredGroups.slice(start, start + MODIFIER_PAGE_SIZE);
  }, [filteredGroups, safePageIndex]);

  useEffect(() => {
    setPageIndex(0);
  }, [search, statusFilter]);

  const handlePageChange = (nextPageIndex: number) => {
    setPageIndex(Math.max(0, Math.min(nextPageIndex, totalPages - 1)));
  };

  const hasActiveFilters = search.trim().length > 0 || statusFilter !== "all";
  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  const statusOptions = [
    { value: "all", label: t("settings.modifiers.filterStatusAll") },
    { value: "active", label: t("settings.modifiers.filterStatusActive") },
    { value: "inactive", label: t("settings.modifiers.filterStatusInactive") },
  ];

  return (
    <SettingsFrame>
      <div className="w-full space-y-6 lg:space-y-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/store/${resolvedStoreId}/settings`)}
          className="px-1 text-text-secondary hover:text-text-primary"
        >
          <LuArrowLeft size={16} />
          {t("common.backToSettings")}
        </Button>

        <Card as="section">
          <div className="mb-5 flex items-center justify-between gap-3">
            <h1 className="min-w-0 flex-1 text-heading leading-tight text-text-primary sm:text-display">
              {t("settings.modifiers.title")}
            </h1>
            <Button onClick={() => navigate(`${detailBasePath}/new`)}>
              <LuPlus className="h-4 w-4" />
              {t("settings.modifiers.addGroup")}
            </Button>
          </div>

          {groupsQuery.length === 0 && !groupsQueryLoading ? (
            <EmptyState
              icon={<LuSlidersHorizontal size={32} />}
              title={t("settings.modifiers.emptyTitle")}
              description={t("settings.modifiers.emptyDescription")}
            />
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <SearchInput
                    className="sm:flex-1"
                    value={search}
                    onValueChange={setSearch}
                    placeholder={t("settings.modifiers.searchPlaceholder")}
                  />
                  <DropdownSelect
                    aria-label={t("settings.modifiers.filterStatus")}
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as StatusFilter)
                    }
                    options={statusOptions}
                    className="sm:min-w-[140px]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-label text-text-secondary">
                    {t("settings.modifiers.showingCount", {
                      shown: String(totalFiltered),
                      total: String(groupsQuery.length),
                    })}
                  </span>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={handleClearFilters}
                      className="text-label text-text-primary hover:text-accent-text hover:underline"
                    >
                      {t("settings.modifiers.clearFilters")}
                    </button>
                  )}
                </div>
              </div>

              {filteredGroups.length > 0 ? (
                <div className="space-y-4">
                  <ModifierGroupTable
                    groups={paginatedGroups}
                    sorting={sorting}
                    onSortingChange={setSorting}
                    onSelect={openDetail}
                    onEdit={openDetail}
                    isLoading={groupsQueryLoading}
                  />
                  <DataTablePagination
                    pageIndex={safePageIndex}
                    pageSize={MODIFIER_PAGE_SIZE}
                    totalItems={totalFiltered}
                    onPageChange={handlePageChange}
                  />
                </div>
              ) : (
                <EmptyState
                  icon={<LuSlidersHorizontal size={32} />}
                  title={t("settings.modifiers.noResults")}
                  description={t("settings.modifiers.noResultsDescription")}
                  action={
                    hasActiveFilters ? (
                      <Button variant="secondary" onClick={handleClearFilters}>
                        {t("settings.modifiers.clearFilters")}
                      </Button>
                    ) : undefined
                  }
                />
              )}
            </div>
          )}
        </Card>
      </div>
    </SettingsFrame>
  );
};

export default SettingsModifiersPage;

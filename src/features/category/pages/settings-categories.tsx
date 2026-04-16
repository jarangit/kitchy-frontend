import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LuShapes } from "react-icons/lu";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { SettingsSectionCard, SettingsShell } from "@/features/store/components/settings-shell";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Toggle } from "@/shared/components/ui/toggle";
import { useTranslation } from "@/shared/i18n/use-translation";

const SettingsCategoriesPage = () => {
  const { id, storeId } = useParams<{ id?: string; storeId?: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resolvedStoreId = id ?? storeId;
  const { categoriesQuery, categoriesQueryLoading, createCategoryMutation } =
    useCategoryService();
  const [categoryName, setCategoryName] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);

  const handleCreateCategory = () => {
    const name = categoryName.trim();
    if (!name) return;

    createCategoryMutation.mutate(
      {
        name,
        isActive,
        sortOrder: Number(sortOrder) || 0,
      },
      {
        onSuccess: () => {
          setCategoryName("");
          setSortOrder("0");
          setIsActive(true);
        },
      }
    );
  };

  return (
    <SettingsShell
      title={t("settings.categories.title")}
      description={t("settings.categories.description")}
      onBack={() => navigate(`/store/${resolvedStoreId}/settings`)}
    >
      <SettingsSectionCard
        title={t("settings.categories.featureTitle")}
        description={t("settings.categories.featureDescription")}
      >
        <div className="space-y-6">
          <div className="rounded-radius-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                label="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Beverages"
              />

              <Input
                label="Sort Order"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                placeholder="0"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-label font-[var(--weight-medium)] text-[var(--color-text-secondary)]">
                  Active
                </span>
                <Toggle
                  checked={isActive}
                  onChange={(checked) => setIsActive(checked)}
                  label="Toggle active"
                />
              </div>

              <Button
                onClick={handleCreateCategory}
                disabled={
                  categoryName.trim().length === 0 || createCategoryMutation.isPending
                }
                className="h-11"
              >
                {createCategoryMutation.isPending ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </div>

          {categoriesQueryLoading ? (
            <div className="text-label text-[var(--color-text-secondary)]">
              {t("settings.categories.loading")}
            </div>
          ) : categoriesQuery.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {categoriesQuery.map((category) => (
                <div
                  key={category.id}
                  className="rounded-radius-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-4"
                >
                  <div className="font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
                    {category.name}
                  </div>
                  <div className="mt-1 text-label text-[var(--color-text-secondary)]">
                    Sort: {category.sortOrder}
                  </div>
                  <div className="mt-1 text-label text-[var(--color-text-secondary)]">
                    {category.isActive ? "Active" : "Inactive"}
                  </div>
                  <div className="mt-1 text-label text-[var(--color-text-secondary)]">
                    ID: {category.id}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<LuShapes size={32} />}
              title={t("settings.categories.emptyTitle")}
              description={t("settings.categories.emptyDescription")}
            />
          )}
        </div>
      </SettingsSectionCard>
    </SettingsShell>
  );
};

export default SettingsCategoriesPage;

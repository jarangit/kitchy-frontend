import { useCallback, useEffect, useMemo, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";
import { toast } from "@/shared/services/toast-service";
import { useProductService } from "@/features/product/hooks/useProductService";
import { productApiService } from "@/features/product/services/product";
import { useCategoryService } from "@/features/category/hooks/useCategoryService";
import { useModifierService } from "@/features/modifier/hooks/useModifierService";
import { ModifierStepSection } from "@/features/modifier/components/modifier-step-section";
import { ModifierProductPicker } from "@/features/modifier/components/modifier-product-picker";
import type { PickerProductItem } from "@/features/modifier/components/modifier-product-row";

interface AttachedProduct {
  productId: string;
  productName: string;
  sortOrder: number;
}

interface Props {
  groupId: string;
}

const extractServerMessage = (error: unknown, fallback: string): string => {
  if (error && typeof error === "object") {
    const maybeResponse = error as {
      response?: { data?: { message?: string | string[] } };
    };
    const message = maybeResponse.response?.data?.message;
    if (typeof message === "string" && message.trim()) return message;
    if (Array.isArray(message) && message.length > 0) return message.join(", ");
  }
  return fallback;
};

/**
 * Group-centric assignment: which products offer this group.
 * There is no reverse-lookup endpoint, so attached products are found by
 * scanning product details — settings-only traffic, loaded on demand.
 * Toggling a row attaches/detaches immediately.
 */
const GroupProductAssignment = ({ groupId }: Props) => {
  const { t } = useTranslation();
  const { productsQuery } = useProductService("ALL");
  const { categoriesQuery } = useCategoryService();
  const { assignGroupMutation, removeGroupMutation } = useModifierService();

  const [attached, setAttached] = useState<AttachedProduct[]>([]);
  const [scanState, setScanState] = useState<"idle" | "loading" | "done">(
    "idle",
  );
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [expanded, setExpanded] = useState(false);

  const scanAttached = useCallback(async () => {
    const products = productsQuery ?? [];
    if (products.length === 0) {
      setAttached([]);
      setScanState("done");
      return;
    }
    setScanState("loading");
    try {
      const details = await Promise.all(
        products.map(async (p) => {
          try {
            const response = await productApiService.getProductById(
              String(p.id),
            );
            return { product: p, payload: response.data.data };
          } catch {
            return { product: p, payload: null };
          }
        }),
      );
      const found: AttachedProduct[] = [];
      for (const { product, payload } of details) {
        if (!payload || typeof payload === "string") continue;
        const match = (payload.modifierGroups ?? []).find(
          (g) => g.id === groupId,
        );
        if (match) {
          found.push({
            productId: String(product.id),
            productName: product.name,
            sortOrder: match.sortOrder ?? 0,
          });
        }
      }
      found.sort((a, b) => a.sortOrder - b.sortOrder);
      setAttached(found);
    } finally {
      setScanState("done");
    }
  }, [productsQuery, groupId]);

  useEffect(() => {
    setScanState("idle");
    setPendingIds([]);
    setSearch("");
    setCategoryId("all");
    setExpanded(false);
    void scanAttached();
  }, [scanAttached]);

  const attachedById = useMemo(
    () => new Map(attached.map((a) => [a.productId, a])),
    [attached],
  );

  const categoryOptions = useMemo(
    () => [
      { value: "all", label: t("settings.modifiers.assignCategoryAll") },
      ...categoriesQuery.map((c) => ({ value: c.id, label: c.name })),
    ],
    [categoriesQuery, t],
  );

  const visibleItems: PickerProductItem[] = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (productsQuery ?? [])
      .filter((p) => {
        if (categoryId !== "all" && String(p.categoryId ?? "") !== categoryId) {
          return false;
        }
        if (q && !p.name.toLowerCase().includes(q)) return false;
        return true;
      })
      .map((p) => {
        const id = String(p.id);
        const found = attachedById.get(id);
        return {
          id,
          name: p.name,
          categoryName: p.categoryName,
          attached: found != null,
          sortOrder: found?.sortOrder ?? null,
          pending: pendingIds.includes(id),
        };
      });
  }, [productsQuery, attachedById, pendingIds, search, categoryId]);

  const handleToggle = async (productId: string, next: boolean) => {
    if (pendingIds.includes(productId)) return;
    setPendingIds((prev) => [...prev, productId]);
    try {
      if (next) {
        // Auto-append at the end — no reorder endpoint exists.
        const order =
          attached.reduce((max, a) => Math.max(max, a.sortOrder), -1) + 1;
        try {
          await assignGroupMutation.mutateAsync({
            productId,
            modifierGroupId: groupId,
            sortOrder: order,
          });
          toast.success({
            title: t("settings.modifiers.attachSuccess", { count: "1" }),
          });
        } catch (error) {
          const message = extractServerMessage(
            error,
            t("settings.modifiers.assignFailed"),
          );
          if (
            typeof message === "string" &&
            message.includes("already assigned")
          ) {
            toast.warning({ title: t("settings.modifiers.alreadyAssigned") });
          } else {
            toast.error({ title: message });
          }
        }
      } else {
        try {
          await removeGroupMutation.mutateAsync({
            productId,
            modifierGroupId: groupId,
          });
        } catch (error) {
          toast.error({
            title: extractServerMessage(
              error,
              t("settings.modifiers.removeFailed"),
            ),
          });
        }
      }
      await scanAttached();
    } finally {
      setPendingIds((prev) => prev.filter((id) => id !== productId));
    }
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategoryId("all");
  };

  const summaryLabel =
    scanState !== "done"
      ? t("settings.modifiers.loadingAttached")
      : attached.length === 0
        ? t("settings.modifiers.noAttachedProducts")
        : attached
            .slice(0, 3)
            .map((a) => a.productName)
            .join(" • ");

  return (
    <ModifierStepSection
      step={4}
      title={t("settings.modifiers.useWithProducts")}
      subtitle={t("settings.modifiers.useWithProductsDesc")}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-3 rounded-card bg-surface-muted px-4 py-3 text-left transition-colors duration-fast hover:bg-surface-muted-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <span className="min-w-0 flex-1 truncate text-body text-text-primary">
          {summaryLabel}
        </span>
        <span className="shrink-0 text-body-sm tabular-nums text-text-secondary">
          {scanState === "done"
            ? t("settings.modifiers.productsCount", {
                count: String(attached.length),
              })
            : null}
        </span>
        <LuChevronDown
          aria-hidden="true"
          className={cn(
            "h-4 w-4 shrink-0 text-text-tertiary transition-transform duration-fast",
            expanded && "rotate-180",
          )}
        />
      </button>

      {expanded && (
        <div className="mt-3 space-y-2">
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="text-label text-text-secondary hover:text-text-primary hover:underline"
          >
            {t("settings.modifiers.collapseAssignment")}
          </button>
          <ModifierProductPicker
            search={search}
            onSearchChange={setSearch}
            categoryId={categoryId}
            onCategoryChange={setCategoryId}
            categoryOptions={categoryOptions}
            items={visibleItems}
            totalCount={(productsQuery ?? []).length}
            onToggle={(id, next) => void handleToggle(id, next)}
            onClearFilters={handleClearFilters}
          />
        </div>
      )}
    </ModifierStepSection>
  );
};

export default GroupProductAssignment;

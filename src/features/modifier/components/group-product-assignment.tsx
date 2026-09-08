import { useCallback, useEffect, useMemo, useState } from "react";
import { LuLink2Off, LuPlus } from "react-icons/lu";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/ui/empty-state";
import { Input } from "@/shared/components/ui/input";
import { InsetPanel } from "@/shared/components/ui/inset-panel";
import { useTranslation } from "@/shared/i18n/use-translation";
import { toast } from "@/shared/services/toast-service";
import { useProductService } from "@/features/product/hooks/useProductService";
import { productApiService } from "@/features/product/services/product";
import { useModifierService } from "@/features/modifier/hooks/useModifierService";

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
 */
const GroupProductAssignment = ({ groupId }: Props) => {
  const { t } = useTranslation();
  const { productsQuery } = useProductService("ALL");
  const { assignGroupMutation, removeGroupMutation } = useModifierService();

  const [attached, setAttached] = useState<AttachedProduct[]>([]);
  const [scanState, setScanState] = useState<"idle" | "loading" | "done">(
    "idle",
  );
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState("0");

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
    setCheckedIds([]);
    void scanAttached();
  }, [scanAttached]);

  const attachedIds = useMemo(
    () => new Set(attached.map((a) => a.productId)),
    [attached],
  );

  const unattachedProducts = useMemo(
    () => (productsQuery ?? []).filter((p) => !attachedIds.has(String(p.id))),
    [productsQuery, attachedIds],
  );

  const toggleCheck = (productId: string) => {
    setCheckedIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const handleAttach = async () => {
    if (checkedIds.length === 0) return;
    const order = Math.max(0, Number(sortOrder) || 0);
    let attachedCount = 0;
    for (const productId of checkedIds) {
      try {
        await assignGroupMutation.mutateAsync({
          productId,
          modifierGroupId: groupId,
          sortOrder: order,
        });
        attachedCount += 1;
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
    }
    setCheckedIds([]);
    if (attachedCount > 0) {
      toast.success({
        title: t("settings.modifiers.attachSuccess", {
          count: String(attachedCount),
        }),
      });
      await scanAttached();
    }
  };

  const handleRemove = async (productId: string) => {
    try {
      await removeGroupMutation.mutateAsync({
        productId,
        modifierGroupId: groupId,
      });
      await scanAttached();
    } catch (error) {
      toast.error({
        title: extractServerMessage(
          error,
          t("settings.modifiers.removeFailed"),
        ),
      });
    }
  };

  const removingKey =
    removeGroupMutation.isPending && removeGroupMutation.variables
      ? removeGroupMutation.variables.productId
      : null;

  return (
    <Card as="section">
      <div className="mb-5">
        <h2 className="text-title text-text-primary">
          {t("settings.modifiers.assignmentTitle")}
        </h2>
        <p className="mt-1 text-body-sm text-text-secondary">
          {t("settings.modifiers.assignmentGroupDescription")}
        </p>
      </div>

      <div className="space-y-2">
        {scanState !== "done" ? (
          <InsetPanel className="text-label text-text-secondary">
            {t("settings.modifiers.loadingAttached")}
          </InsetPanel>
        ) : attached.length === 0 ? (
          <EmptyState
            title={t("settings.modifiers.noAttachedProducts")}
            description={t("settings.modifiers.noAttachedProductsDescription")}
            className="py-6"
          />
        ) : (
          attached.map((item, index) => (
            <InsetPanel
              key={item.productId}
              className="flex items-center gap-3"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-label font-semibold tabular-nums text-text-secondary">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-body font-medium text-text-primary">
                  {item.productName}
                </p>
                <p className="mt-0.5 text-caption text-text-tertiary">
                  {t("settings.modifiers.assignedOrder", {
                    order: String(item.sortOrder),
                  })}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label={t("settings.modifiers.removeAssignment")}
                title={t("settings.modifiers.removeAssignment")}
                disabled={removingKey === item.productId}
                onClick={() => void handleRemove(item.productId)}
                className="text-danger hover:bg-danger-bg hover:text-danger"
              >
                <LuLink2Off className="h-4 w-4" />
              </Button>
            </InsetPanel>
          ))
        )}
      </div>

      {unattachedProducts.length > 0 && (
        <InsetPanel className="mt-3 space-y-3">
          <p className="text-label font-medium text-text-primary">
            {t("settings.modifiers.attachProducts")}
          </p>
          <div className="max-h-56 space-y-1 overflow-y-auto pr-1">
            {unattachedProducts.map((p) => {
              const id = String(p.id);
              const checked = checkedIds.includes(id);
              return (
                <label
                  key={id}
                  className="flex cursor-pointer items-center gap-3 rounded-card px-3 py-2 transition-colors duration-fast hover:bg-surface"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCheck(id)}
                    className="h-5 w-5 shrink-0 accent-accent"
                    aria-label={p.name}
                  />
                  <span className="min-w-0 flex-1 truncate text-body text-text-primary">
                    {p.name}
                  </span>
                </label>
              );
            })}
          </div>
          <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
            <Input
              id="group-assignment-sort"
              type="number"
              min="0"
              step="1"
              label={t("settings.modifiers.sortOrder")}
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            />
            <div className="flex items-end justify-end">
              <Button
                type="button"
                size="sm"
                disabled={
                  checkedIds.length === 0 || assignGroupMutation.isPending
                }
                onClick={() => void handleAttach()}
              >
                <LuPlus className="h-4 w-4" />
                {t("settings.modifiers.attachSelected", {
                  count: String(checkedIds.length),
                })}
              </Button>
            </div>
          </div>
        </InsetPanel>
      )}
    </Card>
  );
};

export default GroupProductAssignment;

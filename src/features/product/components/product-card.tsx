import { Card } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Toggle } from "@/shared/components/ui/toggle";
import { LuImage, LuPencil, LuTrash2 } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";

interface ProductCardProps {
  id: string;
  name: string;
  isActive: boolean;
  price?: number;
  cost?: number;
  imageUrl?: string;
  categoryName?: string;
  stationName?: string;
  isToggling?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleActive?: (id: string, next: boolean) => void;
  className?: string;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductCard({
  id,
  name,
  isActive,
  price,
  imageUrl,
  categoryName,
  stationName,
  isToggling = false,
  onEdit,
  onDelete,
  onToggleActive,
  className = "",
}: ProductCardProps) {
  const { t } = useTranslation();
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <Card
      className={cn(
        "flex flex-col overflow-hidden p-0",
        !isActive && "opacity-80",
        className,
      )}
    >
      {/* Thumbnail 16:9 */}
      <div
        className={cn(
          "relative w-full aspect-video bg-surface-muted overflow-hidden",
          !isActive && "grayscale",
        )}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-tertiary">
            <LuImage size={32} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-card-padding">
        <div className="min-w-0 flex-1">
          <h3 className="text-subtitle text-text-primary truncate">{name}</h3>
          <p className="text-body-sm text-text-secondary mt-1 truncate">
            {categoryName ?? t("settings.products.noCategory")}
            {stationName ? ` · ${stationName}` : ""}
          </p>
        </div>

        <span
          className={cn(
            "text-title tabular-nums",
            price == null
              ? "text-text-tertiary text-body-sm"
              : "text-text-primary",
          )}
        >
          {price == null ? t("settings.products.noPrice") : formatPrice(price)}
        </span>

        {/* Footer: Toggle + Actions */}
        <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
          {onToggleActive ? (
            <Toggle
              checked={isActive}
              onChange={(next) => onToggleActive(id, next)}
              disabled={isToggling}
              label={
                isActive
                  ? t("settings.products.active")
                  : t("settings.products.inactive")
              }
            />
          ) : (
            <span className="text-label text-text-secondary">
              {isActive
                ? t("settings.products.active")
                : t("settings.products.inactive")}
            </span>
          )}

          {hasActions && (
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("common.edit")}
                  onClick={() => onEdit(id)}
                >
                  <LuPencil className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={t("common.delete")}
                  onClick={() => onDelete(id)}
                >
                  <LuTrash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

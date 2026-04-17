import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LuPencil, LuTrash2 } from "react-icons/lu";
import { cn } from "@/shared/utils/cn";
import { useTranslation } from "@/shared/i18n/use-translation";

interface ProductCardProps {
  id: string;
  name: string;
  isActive: boolean;
  price?: number;
  categoryName?: string;
  stationName?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
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
  categoryName,
  stationName,
  onEdit,
  onDelete,
  className = "",
}: ProductCardProps) {
  const { t } = useTranslation();
  const hasActions = Boolean(onEdit || onDelete);

  return (
    <Card className={cn("flex flex-col", !isActive && "opacity-70", className)}>
      <CardContent className="flex flex-1 flex-col gap-4 p-card-padding">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-subtitle text-text-primary truncate">{name}</h3>
            <p className="text-body-sm text-text-secondary mt-1 truncate">
              {categoryName ?? t("settings.products.noCategory")}
              {stationName ? ` · ${stationName}` : ""}
            </p>
          </div>
          <Badge variant={isActive ? "success" : "default"}>
            {isActive
              ? t("settings.products.active")
              : t("settings.products.inactive")}
          </Badge>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <span
            className={cn(
              "text-title tabular-nums",
              price == null ? "text-text-tertiary text-body-sm" : "text-text-primary",
            )}
          >
            {price == null ? t("settings.products.noPrice") : formatPrice(price)}
          </span>

          {hasActions && (
            <div className="flex items-center gap-1">
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
      </CardContent>
    </Card>
  );
}

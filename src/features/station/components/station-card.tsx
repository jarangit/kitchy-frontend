import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import { LuMonitor, LuPencil, LuTrash2 } from "react-icons/lu";
import { ColorDot } from "@/shared/components/atoms/color-dot";
import { Link } from "react-router-dom";
import { useTranslation } from "@/shared/i18n/use-translation";
import { cn } from "@/shared/utils/cn";

interface StationCardProps {
  id: string;
  name: string;
  color: string;
  activeOrders: number;
  completedToday: number;
  storeId?: number;
  displaySettings: {
    cardColor: string;
    textSize: "small" | "medium" | "large";
    soundEnabled: boolean;
  };
  onEdit?: (stationId: string) => void;
  onDelete?: (stationId: string) => void;
  className?: string;
}

export function StationCard({
  id,
  name,
  color,
  activeOrders,
  completedToday,
  storeId,
  displaySettings,
  onEdit,
  onDelete,
  className,
}: StationCardProps) {
  const { t } = useTranslation();

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-3">
            <ColorDot color={color} size="lg" />
            <CardTitle className="truncate text-subtitle">{name}</CardTitle>
          </div>
          <div className="flex shrink-0 gap-1">
            {onEdit && (
              <Button variant="ghost" size="sm" onClick={() => onEdit(id)}>
                <LuPencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="sm" onClick={() => onDelete(id)}>
                <LuTrash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-card border border-card-border bg-bg px-4 py-3 text-center">
              <div className="text-heading font-[var(--weight-semibold)] tabular-nums text-warning">
                {activeOrders}
              </div>
              <div className="text-caption text-text-tertiary">
                {t("station.card.activeOrders")}
              </div>
            </div>
            <div className="rounded-card border border-card-border bg-bg px-4 py-3 text-center">
              <div className="text-heading font-[var(--weight-semibold)] tabular-nums text-success">
                {completedToday}
              </div>
              <div className="text-caption text-text-tertiary">
                {t("station.card.completedToday")}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-caption text-text-tertiary">
              {t("station.card.display")}
            </h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">
                {t("station.card.textSize")}: {displaySettings.textSize}
              </Badge>
              <Badge variant="default">
                {t("station.card.sound")}:{" "}
                {displaySettings.soundEnabled
                  ? t("station.card.soundOn")
                  : t("station.card.soundOff")}
              </Badge>
            </div>
          </div>

          <Link to={`/store/${storeId}/station/${id}`} className="block">
            <Button variant="secondary" className="w-full">
              <LuMonitor className="mr-2 h-4 w-4" />
              {t("station.card.viewStation")}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

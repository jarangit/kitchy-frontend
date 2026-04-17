import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { LuMonitor, LuPencil, LuTrash2 } from "react-icons/lu"
import { ColorDot } from "@/shared/components/atoms/color-dot"
import { Link } from "react-router-dom"
import { cn } from "@/shared/utils/cn"

interface StationCardProps {
  id: string
  name: string
  color: string
  activeOrders: number
  completedToday: number
  storeId?: number
  displaySettings: {
    cardColor: string
    textSize: "small" | "medium" | "large"
    soundEnabled: boolean
  }
  onEdit?: (stationId: string) => void
  onDelete?: (stationId: string) => void
  className?: string
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
  className = "",
}: StationCardProps) {
  return (
    <Card className={cn("hover:shadow-lg transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ColorDot color={color} size="lg" />
            <CardTitle className="text-subtitle">{name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Link to={`/store/${storeId}/station/${id}`}>
              <Button variant="secondary" size="sm">
                <LuMonitor className="w-4 h-4" />
              </Button>
            </Link>
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={() => onEdit(id)}>
                <LuPencil className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="secondary" size="sm" onClick={() => onDelete(id)}>
                <LuTrash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-[var(--color-warning-bg)] rounded-radius-sm">
              <div className="text-heading font-[var(--weight-semibold)] text-[var(--color-warning)]">{activeOrders}</div>
              <div className="text-label text-[var(--color-text-secondary)]">Active Orders</div>
            </div>
            <div className="text-center p-3 bg-[var(--color-success-bg)] rounded-radius-sm">
              <div className="text-heading font-[var(--weight-semibold)] text-[var(--color-success)]">{completedToday}</div>
              <div className="text-label text-[var(--color-text-secondary)]">Completed Today</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-label text-[var(--color-text-secondary)]">Display Settings</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Text: {displaySettings.textSize}</Badge>
              <Badge variant="default">Sound: {displaySettings.soundEnabled ? "On" : "Off"}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`/store/${storeId}/station/${id}`} className="flex-1">
              <Button variant="secondary" className="w-full bg-transparent">
                <LuMonitor className="w-4 h-4 mr-2" />
                View Station
              </Button>
            </Link>
            {onEdit && (
              <Button variant="secondary" size="sm" onClick={() => onEdit(id)}>
                <LuPencil className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { Monitor, Edit, Trash2 } from "lucide-react"
import { ColorDot } from "@/shared/components/atoms/color-dot"
import { Link } from "react-router-dom"

interface StationCardProps {
  id: string
  name: string
  color: string
  activeOrders: number
  completedToday: number
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
  displaySettings,
  onEdit,
  onDelete,
  className = "",
}: StationCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ColorDot color={color} size="lg" />
            <CardTitle className="text-lg">{name}</CardTitle>
          </div>
          <div className="flex gap-2">
            <Link to={`/stations/${id}`}>
              <Button variant="outline" size="sm">
                <Monitor className="w-4 h-4" />
              </Button>
            </Link>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={() => onDelete(id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{activeOrders}</div>
              <div className="text-sm text-gray-600">Active Orders</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{completedToday}</div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Display Settings</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Text: {displaySettings.textSize}</Badge>
              <Badge variant="outline">Sound: {displaySettings.soundEnabled ? "On" : "Off"}</Badge>
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`/stations/${id}`} className="flex-1">
              <Button variant="outline" className="w-full bg-transparent">
                <Monitor className="w-4 h-4 mr-2" />
                View Station
              </Button>
            </Link>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, Star } from "lucide-react"

interface MenuItemCardProps {
  id: string
  name: string
  isActive: boolean
  // onAdd?: (itemId: string) => void
  // onEdit?: (itemId: string) => void
  onDelete?: (itemId: string) => void
  // onToggleBestSeller?: (itemId: string) => void
  // onToggleActive?: (itemId: string) => void
  showAddButton?: boolean
  className?: string
}

export function ProductCard({
  id,
  name,
  isActive,
  // onAdd,
  // onEdit,
  onDelete,
  // onToggleBestSeller,
  // onToggleActive,
  showAddButton = false,
  className = "",
}: MenuItemCardProps) {
  return (
    <Card className={`${!isActive ? "opacity-60" : ""} ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">{name}</CardTitle>
              {/* {isBestSeller && (
                <Badge variant="default" className="bg-yellow-500">
                  <Star className="w-3 h-3 mr-1" />
                  Best Seller
                </Badge>
              )} */}
            </div>
            {/* {description && <p className="text-sm text-gray-600 mb-2">{description}</p>} */}
            <div className="flex items-center gap-2">
              {/* <Badge variant="outline">{station}</Badge> */}
              <Badge variant={isActive ? "default" : "secondary"}>{isActive ? "Active" : "Inactive"}</Badge>
            </div>
          </div>
          {/* <div className="text-right">
            <PriceDisplay amount={price} className="text-xl font-bold text-green-600" />
          </div> */}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {showAddButton ? (
          <Button  className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add to Order
          </Button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* {onToggleBestSeller && (
                <Button variant="outline" size="sm" onClick={() => onToggleBestSeller(id)}>
                  <Star className={`w-4 h-4 ${isBestSeller ? "fill-current text-yellow-500" : ""}`} />
                </Button>
              )} */}
              {/* {onToggleActive && <Switch checked={isActive} onCheckedChange={() => onToggleActive(id)} />} */}
            </div>
            <div className="flex gap-2">
              {/* {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
                  <Edit className="w-4 h-4" />
                </Button>
              )} */}
              {onDelete && (
                <Button variant="outline" size="sm" onClick={() => onDelete(id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

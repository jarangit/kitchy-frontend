import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card"
import { Button } from "@/shared/components/ui/button"
import { Badge } from "@/shared/components/ui/badge"
import { LuPlus, LuTrash2 } from "react-icons/lu"

interface MenuItemCardProps {
  id: string
  name: string
  isActive: boolean
  onDelete?: (itemId: string) => void
  showAddButton?: boolean
  className?: string
}

export function ProductCard({
  id,
  name,
  isActive,
  onDelete,
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
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={isActive ? "success" : "default"}>{isActive ? "Active" : "Inactive"}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {showAddButton ? (
          <Button className="w-full" size="sm">
            <LuPlus className="w-4 h-4 mr-2" />
            Add to Order
          </Button>
        ) : (
          <div className="flex items-center justify-end">
            <div className="flex gap-2">
              {onDelete && (
                <Button variant="secondary" size="sm" onClick={() => onDelete(id)}>
                  <LuTrash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

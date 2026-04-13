interface StationColorDotProps {
  color: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ColorDot({ color, size = "md", className = "" }: StationColorDotProps) {
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-6 h-6",
  }

  return <div className={`rounded-full ${sizeClasses[size]} ${className}`} style={{ backgroundColor: color }} />
}

import { Badge } from "@/components/ui/badge"
import { cn, getQualityRatingBadge } from "@/lib/utils"
import { QualityRatingBadgeProps } from "@/types/evaluation"

export default function QualityRatingBadge({ 
  rating, 
  showLabel = true, 
  showShortLabel = true 
}: QualityRatingBadgeProps) {
  if (!rating) return null

  const badgeConfig = getQualityRatingBadge(rating)

  return (
    <Badge className={cn("font-normal px-2 py-1 text-xs flex flex-col items-center", badgeConfig.variant)}>
      {showShortLabel && (
        <span className="font-bold text-base">{badgeConfig.shortLabel}</span>
      )}
      {showLabel && (
        <span className="block whitespace-nowrap">{badgeConfig.label}</span>
      )}
    </Badge>
  )
} 
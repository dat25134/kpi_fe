"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn, getScoreColor } from "@/lib/utils"
import type { EvaluationCriteriaDetail } from "@/types/evaluation"
import CriteriaScoreBlock from "./CriteriaScoreBlock"

function getScoreBadge(score: string | null, maxScore: string) {
  if (!score) return null
  const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
  let variant: "default" | "secondary" | "destructive" = "secondary"
  let text = "Đạt"
  if (percentage >= 90) {
    variant = "default"
    text = "Xuất sắc"
  } else if (percentage >= 70) {
    variant = "default"
    text = "Tốt"
  } else if (percentage < 50) {
    variant = "destructive"
    text = "Không đạt"
  }
  return (
    <Badge variant={variant} className="text-xs">
      {text}
    </Badge>
  )
}

interface CriteriaItemProps {
  item: EvaluationCriteriaDetail
  index: number
  onScoreChange?: (id: number, field: string, value: string) => void
  onCommentChange?: (id: number, field: string, value: string) => void
  showSeparator?: boolean
  mode: 'self' | 'level1' | 'level2'
  isReadOnly?: boolean
}

export default function CriteriaItem({
  item,
  index,
  onScoreChange,
  onCommentChange,
  showSeparator = true,
  mode,
  isReadOnly
}: CriteriaItemProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-sm">
              {index + 1}. {item.criteria.name}
            </span>
            {getScoreBadge(item.final_score, item.criteria.max_score)}
          </div>
          <div className="text-xs text-muted-foreground mb-3">
            Tối đa: {item.criteria.max_score} điểm
          </div>
        </div>
      </div>

      {mode === 'self' && (
        <CriteriaScoreBlock
          label="Tự đánh giá"
          score={item.self_score}
          comment={item.self_comment}
          maxScore={item.criteria.max_score}
          placeholder="Nhận xét tự đánh giá..."
          readOnly={isReadOnly}
          onScoreChange={value => onScoreChange?.(item.id, "self_score", value)}
          onCommentChange={value => onCommentChange?.(item.id, "self_comment", value)}
        />
      )}

      {mode === 'level1' && (
        <CriteriaScoreBlock
          label="Đánh giá cấp 1"
          score={item.level1_score}
          comment={item.level1_comment}
          maxScore={item.criteria.max_score}
          placeholder="Nhận xét cấp 1..."
          readOnly={isReadOnly}
          onScoreChange={value => onScoreChange?.(item.id, "level1_score", value)}
          onCommentChange={value => onCommentChange?.(item.id, "level1_comment", value)}
        />
      )}

      {mode === 'level2' && (
        <CriteriaScoreBlock
          label="Đánh giá cấp 2"
          score={item.level2_score}
          comment={item.level2_comment}
          maxScore={item.criteria.max_score}
          placeholder="Nhận xét cấp 2..."
          readOnly={isReadOnly}
          onScoreChange={value => onScoreChange?.(item.id, "level2_score", value)}
          onCommentChange={value => onCommentChange?.(item.id, "level2_comment", value)}
        />
      )}

      {showSeparator && <Separator />}
    </div>
  )
} 
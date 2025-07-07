"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { cn, getScoreColor } from "@/lib/utils"
import type { EvaluationCriteriaDetail } from "@/types/evaluation"

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
  isReadOnly?: boolean
  onScoreChange?: (id: number, field: string, value: string) => void
  onCommentChange?: (id: number, field: string, value: string) => void
  showSeparator?: boolean
}

export default function CriteriaItem({
  item,
  index,
  isReadOnly = true,
  onScoreChange,
  onCommentChange,
  showSeparator = true
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Self Evaluation */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-blue-600">
            Tự đánh giá
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max={parseFloat(item.criteria.max_score)}
              step="0.01"
              value={item.self_score || ""}
              onChange={(e) => onScoreChange?.(item.id, "self_score", e.target.value)}
              readOnly={isReadOnly}
              className={cn(
                "w-20",
                getScoreColor(item.self_score, item.criteria.max_score)
              )}
            />
            <span className="text-sm text-gray-500">
              / {item.criteria.max_score}
            </span>
          </div>
          <Textarea
            placeholder="Nhận xét tự đánh giá..."
            value={item.self_comment || ""}
            onChange={(e) => onCommentChange?.(item.id, "self_comment", e.target.value)}
            readOnly={isReadOnly}
            className="min-h-[80px] text-sm"
          />
        </div>

        {/* Level 1 Evaluation */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-green-600">
            Đánh giá cấp trên
          </Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              min="0"
              max={parseFloat(item.criteria.max_score)}
              step="0.01"
              value={item.level1_score || ""}
              onChange={(e) => onScoreChange?.(item.id, "level1_score", e.target.value)}
              readOnly={isReadOnly}
              className={cn(
                "w-20",
                getScoreColor(item.level1_score, item.criteria.max_score)
              )}
            />
            <span className="text-sm text-gray-500">
              / {item.criteria.max_score}
            </span>
          </div>
          <Textarea
            placeholder="Nhận xét cấp trên..."
            value={item.level1_comment || ""}
            onChange={(e) => onCommentChange?.(item.id, "level1_comment", e.target.value)}
            readOnly={isReadOnly}
            className="min-h-[80px] text-sm"
          />
        </div>
      </div>

      {/* Level 2 Evaluation (if exists) */}
      {(item.level2_score || item.level2_comment) && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-purple-600">
            Đánh giá cấp 2
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max={parseFloat(item.criteria.max_score)}
                step="0.01"
                value={item.level2_score || ""}
                onChange={(e) => onScoreChange?.(item.id, "level2_score", e.target.value)}
                readOnly={isReadOnly}
                className={cn(
                  "w-20",
                  getScoreColor(item.level2_score, item.criteria.max_score)
                )}
              />
              <span className="text-sm text-gray-500">
                / {item.criteria.max_score}
              </span>
            </div>
            <Textarea
              placeholder="Nhận xét cấp 2..."
              value={item.level2_comment || ""}
              onChange={(e) => onCommentChange?.(item.id, "level2_comment", e.target.value)}
              readOnly={isReadOnly}
              className="min-h-[80px] text-sm"
            />
          </div>
        </div>
      )}

      {/* Final Score */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <span className="font-medium text-sm">Điểm cuối cùng:</span>
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-bold text-lg",
            getScoreColor(item.final_score, item.criteria.max_score)
          )}>
            {item.final_score || "0"}
          </span>
          <span className="text-sm text-gray-500">
            / {item.criteria.max_score}
          </span>
        </div>
      </div>

      {showSeparator && <Separator />}
    </div>
  )
} 
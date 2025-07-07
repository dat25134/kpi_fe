"use client"

import { type EvaluationCriteriaDetail } from "@/types/evaluation"
import CriteriaCategory from "./CriteriaCategory"

interface EvaluationCriteriaListProps {
  details: EvaluationCriteriaDetail[]
  isReadOnly?: boolean
  onScoreChange?: (id: number, field: string, value: string) => void
  onCommentChange?: (id: number, field: string, value: string) => void
}

export default function EvaluationCriteriaList({
  details,
  isReadOnly = true,
  onScoreChange,
  onCommentChange
}: EvaluationCriteriaListProps) {
  // Group criteria by category
  const groupedCriteria = details.reduce((acc, item) => {
    const category = item.criteria.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, EvaluationCriteriaDetail[]>)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> Hiển thị list tiêu chí đánh giá</div>
    </div>
  )
} 
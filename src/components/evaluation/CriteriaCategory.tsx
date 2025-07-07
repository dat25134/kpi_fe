"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CATEGORY_LABELS } from "@/types/evaluation"
import type { EvaluationCriteriaDetail } from "@/types/evaluation"
import CriteriaItem from "./CriteriaItem"

interface CriteriaCategoryProps {
  category: string
  criteria: EvaluationCriteriaDetail[]
  isReadOnly?: boolean
  onScoreChange?: (id: number, field: string, value: string) => void
  onCommentChange?: (id: number, field: string, value: string) => void
}

export default function CriteriaCategory({
  category,
  criteria,
  isReadOnly = true,
  onScoreChange,
  onCommentChange
}: CriteriaCategoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {CATEGORY_LABELS[category] || category}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {criteria.map((item, index) => (
          <CriteriaItem
            key={item.id}
            item={item}
            index={index}
            isReadOnly={isReadOnly}
            onScoreChange={onScoreChange}
            onCommentChange={onCommentChange}
            showSeparator={index < criteria.length - 1}
          />
        ))}
      </CardContent>
    </Card>
  )
} 
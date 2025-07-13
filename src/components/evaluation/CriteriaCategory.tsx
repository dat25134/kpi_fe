"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { EvaluationCriteriaDetail } from "@/types/evaluation"
import CriteriaItem from "./CriteriaItem"

interface CriteriaCategoryProps {
  category: string
  criteria: EvaluationCriteriaDetail[]
  onScoreChange?: (id: number, field: string, value: string) => void
  onCommentChange?: (id: number, field: string, value: string) => void
  mode: 'self' | 'level1' | 'level2'
  isReadOnly?: boolean
}

export default function CriteriaCategory({
  category,
  criteria,
  onScoreChange,
  onCommentChange,
  mode,
  isReadOnly
}: CriteriaCategoryProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">
          {category}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {criteria.map((item, index) => (
          <CriteriaItem
            key={item.id}
            item={item}
            index={index}
            onScoreChange={onScoreChange}
            onCommentChange={onCommentChange}
            mode={mode}
            isReadOnly={isReadOnly}
          />
        ))}
      </CardContent>
    </Card>
  );
} 
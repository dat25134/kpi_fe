"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
          Tên Nhóm tiêu chí
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        Hiển thị list tiêu chí đánh giá theo tên nhóm tiêu chí
      </CardContent>
    </Card>
  )
} 
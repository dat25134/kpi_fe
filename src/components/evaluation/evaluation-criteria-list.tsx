"use client"

import { type EvaluationCriteriaDetail } from "@/types/evaluation"
import CriteriaCategory from "./CriteriaCategory"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface EvaluationCriteriaListProps {
  details: EvaluationCriteriaDetail[]
  onScoreChange?: (id: number, field: string, value: string) => void
  onCommentChange?: (id: number, field: string, value: string) => void
}

export default function EvaluationCriteriaList({
  details,
  onScoreChange,
  onCommentChange
}: EvaluationCriteriaListProps) {
  // Group criteria by category
  const groupedCriteria = details?.reduce((acc, item) => {
    const category = item.criteria.category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(item)
    return acc
  }, {} as Record<string, EvaluationCriteriaDetail[]>)

  if (!details || details.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">Chưa có tiêu chí đánh giá trong đợt này</div>
    )
  }

  return (
    <Tabs defaultValue="self" className="space-y-6">
      <TabsList className="w-full grid grid-cols-3 mb-4">
        <TabsTrigger value="self">Tự đánh giá</TabsTrigger>
        <TabsTrigger value="level1">Đánh giá cấp 1</TabsTrigger>
        <TabsTrigger value="level2">Đánh giá cấp 2</TabsTrigger>
      </TabsList>
      <TabsContent value="self">
        {Object.entries(groupedCriteria).map(([category, items]) => (
          <CriteriaCategory
            key={category}
            category={category}
            criteria={items}
            onScoreChange={onScoreChange}
            onCommentChange={onCommentChange}
            mode="self"
          />
        ))}
      </TabsContent>
      <TabsContent value="level1">
        {Object.entries(groupedCriteria).map(([category, items]) => (
          <CriteriaCategory
            key={category}
            category={category}
            criteria={items}
            onScoreChange={onScoreChange}
            onCommentChange={onCommentChange}
            mode="level1"
          />
        ))}
      </TabsContent>
      <TabsContent value="level2">
        {Object.entries(groupedCriteria).map(([category, items]) => (
          <CriteriaCategory
            key={category}
            category={category}
            criteria={items}
            onScoreChange={onScoreChange}
            onCommentChange={onCommentChange}
            mode="level2"
          />
        ))}
      </TabsContent>
    </Tabs>
  )
} 
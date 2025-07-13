"use client"

import { type EvaluationCriteriaDetail } from "@/types/evaluation"
import CriteriaCategory from "./CriteriaCategory"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { EvaluationCriteriaListProps } from '@/types/evaluation';

interface Props extends EvaluationCriteriaListProps {
  fieldErrors?: Record<string, string[]>;
}

export default function EvaluationCriteriaList({ details, onScoreChange, onCommentChange, isReadOnly, fieldErrors }: Props) {
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

  // Gom lỗi theo từng loại tab
  const errorsByTab = {
    self: [] as string[],
    level1: [] as string[],
    level2: [] as string[],
  };
  if (fieldErrors) {
    Object.entries(fieldErrors).forEach(([key, arr]) => {
      if (key.includes('.self_')) errorsByTab.self.push(...arr);
      if (key.includes('.level1_')) errorsByTab.level1.push(...arr);
      if (key.includes('.level2_')) errorsByTab.level2.push(...arr);
    });
  }

  return (
    <Tabs defaultValue="self" className="space-y-6">
      <TabsList className="w-full grid grid-cols-3 mb-4">
        <TabsTrigger value="self">Tự đánh giá</TabsTrigger>
        <TabsTrigger value="level1">Đánh giá cấp 1</TabsTrigger>
        <TabsTrigger value="level2">Đánh giá cấp 2</TabsTrigger>
      </TabsList>
      <TabsContent value="self">
        {errorsByTab.self.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">
            <ul className="list-disc pl-5">
              {errorsByTab.self.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}
        {Object.entries(groupedCriteria).map(([category, items]) => (
          <CriteriaCategory
            key={category}
            category={category}
            criteria={items}
            onScoreChange={onScoreChange}
            onCommentChange={onCommentChange}
            mode="self"
            isReadOnly={isReadOnly}
            details={details}
          />
        ))}
      </TabsContent>
      <TabsContent value="level1">
        {errorsByTab.level1.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">
            <ul className="list-disc pl-5">
              {errorsByTab.level1.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}
        {Object.entries(groupedCriteria).map(([category, items]) => (
          <CriteriaCategory
            key={category}
            category={category}
            criteria={items}
            onScoreChange={onScoreChange}
            onCommentChange={onCommentChange}
            mode="level1"
            isReadOnly={isReadOnly}
            details={details}
          />
        ))}
      </TabsContent>
      <TabsContent value="level2">
        {errorsByTab.level2.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-300 text-red-700 rounded p-3 text-sm">
            <ul className="list-disc pl-5">
              {errorsByTab.level2.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        )}
        {Object.entries(groupedCriteria).map(([category, items]) => (
          <CriteriaCategory
            key={category}
            category={category}
            criteria={items}
            onScoreChange={onScoreChange}
            onCommentChange={onCommentChange}
            mode="level2"
            isReadOnly={isReadOnly}
            details={details}
          />
        ))}
      </TabsContent>
    </Tabs>
  )
} 
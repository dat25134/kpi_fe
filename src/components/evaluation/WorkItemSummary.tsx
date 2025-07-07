"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { calculateKPIScore } from "@/lib/utils"
import type { WorkDescriptionItem } from "@/types/evaluation"

interface WorkItemSummaryProps {
  items: WorkDescriptionItem[]
}

export default function WorkItemSummary({ items }: WorkItemSummaryProps) {
  const totalFinalPoints = items.reduce((sum, item) => sum + parseFloat(item.final_score || "0"), 0)
  const totalComplexityWeight = items.reduce((sum, item) => sum + item.complexity_weight, 0)
  const kpiScore = calculateKPIScore(items)

  const getKPIRating = (score: number) => {
    if (score < 2.2) return "Không đạt"
    if (score < 2.7) return "Đạt, còn hạn chế"
    if (score < 3.4) return "Đạt"
    return "Đạt vượt mức"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng hợp kết quả</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalFinalPoints.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Tổng điểm có trọng số</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalComplexityWeight}</div>
            <div className="text-sm text-gray-600">Tổng trọng số phức tạp</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{kpiScore.toFixed(2)}</div>
            <div className="text-sm text-gray-600">Điểm KPI</div>
            <Badge className="mt-1">{getKPIRating(kpiScore)}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
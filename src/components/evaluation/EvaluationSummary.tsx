"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn, getQualityRating, getQualityRatingLabel, getQualityRatingBadgeVariant } from "@/lib/utils"
import type { EvaluationSummaryProps } from "@/types/evaluation"

export default function EvaluationSummary({ details, totalScore }: EvaluationSummaryProps) {
  const qualityRating = getQualityRating(totalScore)

  if (!details || details.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tổng hợp kết quả đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">Chưa có tiêu chí đánh giá trong đợt này</div>
        </CardContent>
      </Card>
    )
  }

  // Tính tổng điểm đạt được và tổng điểm tối đa toàn bộ
  const totalAll = details.reduce(
    (acc, item) => {
      const score = item.final_score ?? item.level2_score ?? item.level1_score ?? item.self_score;
      acc.total += score ? parseFloat(score) : 0;
      acc.max += parseFloat(item.criteria.max_score);
      return acc;
    },
    { total: 0, max: 0 }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tổng hợp kết quả đánh giá</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Chi tiết điểm theo tiêu chí</h4>
            <div className="space-y-2">
              {Object.entries(
                details.reduce((acc, item) => {
                  const cat = item.criteria.category;
                  if (!acc[cat]) acc[cat] = { total: 0, max: 0 };
                  const score = item.final_score ?? item.level2_score ?? item.level1_score ?? item.self_score;
                  acc[cat].total += score ? parseFloat(score) : 0;
                  acc[cat].max += parseFloat(item.criteria.max_score);
                  return acc;
                }, {} as Record<string, { total: number; max: number }>)
              ).map(([cat, { total, max }]) => (
                <div key={cat} className="flex justify-between items-center py-1">
                  <span className="text-sm truncate">{cat}</span>
                  <span className="font-semibold">{total}/{max}</span>
                </div>
              ))}
            </div>
            {/* Tổng cộng */}
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Tổng điểm:</span>
              <span className="font-semibold">{totalAll.total}/{totalAll.max}</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Kết quả xếp loại</h4>
            <div className="space-y-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalScore.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Tổng điểm</div>
              </div>
              
              <div className="text-center">
                <Badge className={cn("font-normal", getQualityRatingBadgeVariant(qualityRating))}>
                  {getQualityRatingLabel(qualityRating)}
                </Badge>
                <div className="mt-2 text-sm text-gray-600">
                  {getQualityRatingLabel(qualityRating)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm">
                  <strong>Tiêu chí xếp loại:</strong>
                </div>
                <div className="text-xs space-y-1">
                  <div>• Hoàn thành xuất sắc: 90 điểm trở lên</div>
                  <div>• Hoàn thành tốt: 70-89 điểm</div>
                  <div>• Hoàn thành: 50-69 điểm</div>
                  <div>• Không hoàn thành: dưới 50 điểm</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
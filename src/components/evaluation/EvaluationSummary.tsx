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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> Hiển thị list tiêu chí đánh giá</div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Tổng điểm:</span>
                <span>{totalScore.toFixed(1)}/100</span>
              </div>
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
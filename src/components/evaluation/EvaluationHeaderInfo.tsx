"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEvaluationStatusLabel, getEvaluationStatusColor } from "@/lib/utils"
import type { EvaluationDetail } from "@/types/evaluation"

interface EvaluationHeaderInfoProps {
  data: EvaluationDetail
}

export default function EvaluationHeaderInfo({ data }: EvaluationHeaderInfoProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Thông tin đánh giá
          <Badge className={getEvaluationStatusColor(data.status)}>
            {getEvaluationStatusLabel(data.status)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Nhân viên</p>
          <p className="text-sm">{data.user.name}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Phòng ban</p>
          <p className="text-sm">{data.department}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Tháng/Năm</p>
          <p className="text-sm">{data.month}/{data.year}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Tổng điểm</p>
          <p className="text-sm font-medium">{data.total_score}</p>
        </div>
      </CardContent>
    </Card>
  )
} 
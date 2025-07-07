"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getResultLevelName, calculateKPIScore, getQualityRating, getQualityRatingLabel } from "@/lib/utils"
import type { WorkDescriptionTableProps } from "@/types/evaluation"

export default function WorkDescriptionTable({ workDescriptions }: WorkDescriptionTableProps) {
  const kpiScore = calculateKPIScore(workDescriptions)
  const kpiRating = getQualityRating(kpiScore)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bảng mô tả công việc (KPIs)</CardTitle>
        <CardDescription>
          Thống kê chi tiết từng công việc, nhiệm vụ và đo lường bằng sản phẩm cụ thể
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">TT</TableHead>
                <TableHead className="text-center">Nhiệm vụ, công việc</TableHead>
                <TableHead className="text-center">ĐVT</TableHead>
                <TableHead className="text-center">Mục tiêu</TableHead>
                <TableHead className="text-center">Trọng số phức tạp</TableHead>
                <TableHead className="text-center">Kết quả</TableHead>
                <TableHead className="text-center">Điểm</TableHead>
                <TableHead className="text-center">Trọng số chất lượng</TableHead>
                <TableHead className="text-center">Điểm có trọng số</TableHead>
                <TableHead className="text-center">Điểm cuối cùng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workDescriptions?.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="max-w-xs truncate" title={item?.task_title}>
                    {item?.task_title}
                  </TableCell>
                  <TableCell>{item?.unit}</TableCell>
                  <TableCell>{item?.target}</TableCell>
                  <TableCell className="text-center">{item?.task_weight}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getResultLevelName(item?.result_level.toString())}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">{item?.result_level}</TableCell>
                  <TableCell className="text-center">{item?.quality_weight}</TableCell>
                  <TableCell className="text-center">{item?.result_score}</TableCell>
                  <TableCell className="text-center font-medium">{item?.final_score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mt-4">
          <div className="text-lg font-semibold">
            Tổng điểm: {workDescriptions?.reduce((sum, item) => sum + parseFloat(item.final_score || "0"), 0)}
          </div>
          <div className="text-lg font-semibold">
            Điểm KPI: {kpiScore.toFixed(2)} ({getQualityRatingLabel(kpiRating)})
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
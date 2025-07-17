"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getResultLevelName, calculateKPIScore, getKPIRatingForKPI, getKPIRatingLabelForKPI } from "@/lib/utils"
import type { WorkDescriptionTableProps, WorkDescriptionItem } from "@/types/evaluation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { getValidationErrors } from "@/services/errorHandler"

// Hàm màu sắc cho xếp loại KPI
function getKPIRatingBadgeVariantForKPI(rating: string): string {
  switch (rating) {
    case "not_achieved": return "bg-red-100 text-red-700"
    case "limited": return "bg-yellow-100 text-yellow-800"
    case "achieved": return "bg-blue-100 text-blue-800"
    case "outstanding": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function WorkDescriptionTable({ workDescriptions, isEditable = false, onSave }: WorkDescriptionTableProps) {
  const [editItems, setEditItems] = useState<{id: number, quality_weight: number, result_level: number}[]>(() => workDescriptions.map(item => ({
    id: item.id,
    quality_weight: item.quality_weight,
    result_level: item.result_level
  })))
  const [errors, setErrors] = useState<Record<string, string[]>>({})

  const handleChange = (id: number, field: 'quality_weight' | 'result_level', value: number | string) => {
    setEditItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, [field]: Number(value) }
          : item
      )
    );
  }

  const handleSave = async () => {
    setErrors({})
    if (onSave) {
      try {
        await onSave(editItems.map(({id, result_level, quality_weight}) => ({id, result_level, quality_weight})))
      } catch (err: any) {
        setErrors(getValidationErrors(err) || {})
      }
    }
  }

  // Hàm tính toán lại các trường phụ thuộc
  function getCalculatedWorkDescriptions(base: WorkDescriptionItem[], edits: {id: number, quality_weight: number, result_level: number}[]): WorkDescriptionItem[] {
    return base.map(item => {
      const edit = edits.find(e => e.id === item.id)
      const result_level = Number(edit ? edit.result_level : item.result_level) || 0
      const quality_weight = Number(edit ? edit.quality_weight : item.quality_weight) || 0
      const complexity_weight = Number(item.task_weight) || 0
      const points = result_level
      const weightedQualityPoints = (points * quality_weight) / 5
      const finalPoints = parseFloat(weightedQualityPoints.toString()) * parseFloat(complexity_weight.toString())
      return {
        ...item,
        result_level,
        quality_weight,
        result_score: isNaN(weightedQualityPoints) ? '' : weightedQualityPoints.toString(),
        final_score: isNaN(finalPoints) ? '' : finalPoints.toFixed(4),
      }
    })
  }

  // Tạo mảng workDescriptions đã chỉnh sửa để render
  const displayWorkDescriptions = isEditable ? getCalculatedWorkDescriptions(workDescriptions, editItems) : workDescriptions

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bảng mô tả công việc (KPIs)</CardTitle>
        <CardDescription>
          Thống kê chi tiết từng công việc, nhiệm vụ và đo lường bằng sản phẩm cụ thể
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Object.keys(errors).length > 0 && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            <ul className="list-disc pl-5 text-sm">
              {Object.keys(errors).map((key) => (
                errors[key].map((msg, idx) => <li key={idx}>{msg}</li>)
              ))}
            </ul>
          </div>
        )}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">TT</TableHead>
                <TableHead className="text-center">Nhiệm vụ, công việc</TableHead>
                <TableHead className="text-center">ĐVT</TableHead>
                <TableHead className="text-center">Mục tiêu</TableHead>
                <TableHead className="text-center">TS phức tạp</TableHead>
                <TableHead className="text-center">Kết quả</TableHead>
                <TableHead className="text-center">Điểm</TableHead>
                <TableHead className="text-center">TS chất lượng</TableHead>
                <TableHead className="text-center">Điểm có TS</TableHead>
                <TableHead className="text-center">Điểm cuối cùng</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayWorkDescriptions?.map((item, index) => {
                const editItem = editItems.find(e => e.id === item.id)
                return (
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
                        {getResultLevelName(((isEditable ? editItem?.result_level : item?.result_level) ?? '').toString())}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditable ? (
                        <Select
                          value={editItem?.result_level?.toString()}
                          onValueChange={v => handleChange(item.id, 'result_level', Number(v))}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : item?.result_level}
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditable ? (
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          value={editItem?.quality_weight}
                          onChange={e => handleChange(item.id, 'quality_weight', Number(e.target.value))}
                          className="w-16 text-center"
                        />
                      ) : item?.quality_weight}
                    </TableCell>
                    <TableCell className="text-center">{item?.result_score}</TableCell>
                    <TableCell className="text-center font-medium">{item?.final_score}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        {isEditable && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave}>Lưu</Button>
          </div>
        )}
         <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mt-4">
          <div className="text-lg font-semibold">
            Tổng điểm: {displayWorkDescriptions?.reduce((sum, item) => sum + parseFloat(item.final_score || "0"), 0).toFixed(2)}
          </div>
          <div className="text-lg font-semibold flex items-center gap-2">
            Điểm KPI: {calculateKPIScore(displayWorkDescriptions).toFixed(2)}
            <Badge className={getKPIRatingBadgeVariantForKPI(getKPIRatingForKPI(calculateKPIScore(displayWorkDescriptions)))}>
              {getKPIRatingLabelForKPI(getKPIRatingForKPI(calculateKPIScore(displayWorkDescriptions)))}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
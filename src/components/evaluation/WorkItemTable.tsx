"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"
import type { WorkItemTableProps } from "@/types/evaluation"

export default function WorkItemTable({ 
  items, 
  onEdit, 
  onDelete, 
  isReadOnly = false 
}: WorkItemTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Danh sách công việc, nhiệm vụ</CardTitle>
          {!isReadOnly && (
            <Button onClick={() => onEdit(0)}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm công việc
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">TT</TableHead>
                <TableHead>Nhiệm vụ, công việc</TableHead>
                <TableHead className="w-24">ĐVT</TableHead>
                <TableHead className="w-24">Mục tiêu</TableHead>
                <TableHead className="w-32">Trọng số phức tạp</TableHead>
                <TableHead className="w-32">Kết quả</TableHead>
                <TableHead className="w-16">Điểm</TableHead>
                <TableHead className="w-32">Trọng số chất lượng</TableHead>
                <TableHead className="w-32">Điểm có trọng số</TableHead>
                <TableHead className="w-32">Điểm cuối cùng</TableHead>
                {!isReadOnly && <TableHead className="w-20">Thao tác</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="max-w-xs">
                    {isReadOnly ? (
                      <span title={item.task_title}>{item.task_title}</span>
                    ) : (
                      <Input
                        value={item.task_title}
                        onChange={(e) => onEdit(item.id, 'task_title', e.target.value)}
                        className="border-0 p-0 h-auto"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {isReadOnly ? (
                      item.unit
                    ) : (
                      <Input
                        value={item.unit}
                        onChange={(e) => onEdit(item.id, 'unit', e.target.value)}
                        className="border-0 p-0 h-auto"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {isReadOnly ? (
                      item.target
                    ) : (
                      <Input
                        value={item.target}
                        onChange={(e) => onEdit(item.id, 'target', e.target.value)}
                        className="border-0 p-0 h-auto"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {isReadOnly ? (
                      item.complexity_weight
                    ) : (
                      <Select
                        value={item.complexity_weight.toString()}
                        onValueChange={(value) => onEdit(item.id, 'complexity_weight', Number(value))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Đơn giản</SelectItem>
                          <SelectItem value="2">2 - Trung bình</SelectItem>
                          <SelectItem value="3">3 - Phức tạp</SelectItem>
                          <SelectItem value="4">4 - Rất phức tạp</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell>
                    {isReadOnly ? (
                      item.result_level
                    ) : (
                      <Select
                        value={item.result_level.toString()}
                        onValueChange={(value) => onEdit(item.id, 'result_level', Number(value))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Chưa đạt</SelectItem>
                          <SelectItem value="2">Đạt, còn hạn chế</SelectItem>
                          <SelectItem value="3">Đạt</SelectItem>
                          <SelectItem value="4">Đạt vượt mức</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-medium">{item.result_score}</TableCell>
                  <TableCell>
                    {isReadOnly ? (
                      item.quality_weight
                    ) : (
                      <Select
                        value={item.quality_weight.toString()}
                        onValueChange={(value) => onEdit(item.id, 'quality_weight', Number(value))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 - Thấp</SelectItem>
                          <SelectItem value="2">2 - Trung bình thấp</SelectItem>
                          <SelectItem value="3">3 - Trung bình</SelectItem>
                          <SelectItem value="4">4 - Trung bình cao</SelectItem>
                          <SelectItem value="5">5 - Cao</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {((parseFloat(item.result_score || "0") * item.quality_weight) / 5).toFixed(1)}
                  </TableCell>
                  <TableCell className="text-center font-medium">{item.final_score}</TableCell>
                  {!isReadOnly && (
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-red-600"
                        onClick={() => onDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
} 
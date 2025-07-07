"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { CreateEvaluationFormProps } from "@/types/evaluation"

export default function CreateEvaluationForm({ onConfirm, onCancel }: CreateEvaluationFormProps) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  const months = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" }
  ]

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Tháng</Label>
          <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value.toString()}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Năm</Label>
          <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button onClick={() => onConfirm(selectedMonth, selectedYear)}>
          Tạo phiếu đánh giá
        </Button>
      </div>
    </div>
  )
} 
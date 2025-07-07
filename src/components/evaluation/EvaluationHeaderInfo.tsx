"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getRoleLabel } from "@/lib/utils"
import type { EvaluationHeaderInfoProps } from "@/types/evaluation"

export default function EvaluationHeaderInfo({ user, month, year }: EvaluationHeaderInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thông tin chung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-sm font-medium">Họ và tên</Label>
            <Input value={user?.name} readOnly className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-medium">Đơn vị công tác</Label>
            <Input value={user?.department} readOnly className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-medium">Chức vụ</Label>
            <Input value={getRoleLabel(user?.role)} readOnly className="mt-1" />
          </div>
          <div>
            <Label className="text-sm font-medium">Tháng đánh giá</Label>
            <Input value={`${month}/${year}`} readOnly className="mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 
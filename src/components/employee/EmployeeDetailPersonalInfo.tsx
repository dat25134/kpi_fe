import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar } from "lucide-react";
import React from "react";

interface EmployeeDetailPersonalInfoProps {
  employee: any;
}

export default function EmployeeDetailPersonalInfo({ employee }: EmployeeDetailPersonalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Ngày sinh:</span>
          <span className="text-sm font-medium">{formatDate(employee.birthDate, "DD/MM/YYYY")}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Giới tính:</span>
          <span className="text-sm font-medium">{employee.gender === 'male' ? "Nam" : "Nữ"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Ngày vào làm:</span>
          <span className="text-sm font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(employee.joinDate, "DD/MM/YYYY")}
          </span>
        </div>
      </CardContent>
    </Card>
  );
} 
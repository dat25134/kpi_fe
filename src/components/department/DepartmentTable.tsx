import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import React from "react";

interface DepartmentTableProps {
  departments: any[];
  onViewDetail: (department: any) => void;
  onEdit: (department: any) => void;
  onDelete: (id: number) => void;
}

export default function DepartmentTable({ departments, onViewDetail, onEdit, onDelete }: DepartmentTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tên phòng ban</TableHead>
          <TableHead>Mã phòng</TableHead>
          <TableHead>Trưởng phòng</TableHead>
          <TableHead className="text-center">Số nhân viên</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày tạo</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {departments.length === 0 ? (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-gray-500 py-8">
              Không có dữ liệu phòng ban
            </TableCell>
          </TableRow>
        ) : (
          departments.map((department) => (
            <TableRow key={department.id ?? Math.random()}>
              <TableCell>
                <div>
                  <div className="font-medium">{department?.name ?? "—"}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">
                    {department?.description ?? "—"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {department?.code ?? "—"}
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <div>
                    <div className="font-medium text-sm">
                      {department?.manager?.name ?? "—"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {department?.manager?.position ? department.manager.position : "—"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="secondary">
                  {typeof department?.employee_count === "number" ? department.employee_count : "—"}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  className={
                    department?.status === "active"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {department?.status === "active"
                    ? "Hoạt động"
                    : department?.status === "inactive"
                    ? "Tạm dừng"
                    : "Không xác định"}
                </Badge>
              </TableCell>
              <TableCell>
                {department?.created_at
                  ? department.created_at
                  : "—"}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewDetail(department)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Xem chi tiết
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onEdit(department)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => onDelete(department.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Xóa</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
} 
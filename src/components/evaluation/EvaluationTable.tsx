import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { FileText, Trash2 } from "lucide-react";
import { cn, getQualityRatingFromGrade, getRoleLabel, getStatusBadgeVariant, getStatusLabel, getStatusType } from "@/lib/utils";
import { QualityRating } from "@/types/evaluation";
import React from "react";

interface EvaluationTableProps {
  evaluations: any[];
  loading: boolean;
  error: string | null;
  onView: (id: string) => void;
  onDelete: (id: number) => void;
}

const getQualityRatingBadge = (rating: QualityRating) => {
  const variants = {
    [QualityRating.EXCELLENT]: "bg-green-100 text-green-800",
    [QualityRating.GOOD]: "bg-blue-100 text-blue-800", 
    [QualityRating.ACHIEVED]: "bg-yellow-100 text-yellow-800",
    [QualityRating.NOT_ACHIEVED]: "bg-red-100 text-red-800"
  }
  const labels = {
    [QualityRating.EXCELLENT]: "Hoàn thành xuất sắc nhiệm vụ (A)",
    [QualityRating.GOOD]: "Hoàn thành tốt nhiệm vụ (B)",
    [QualityRating.ACHIEVED]: "Hoàn thành nhiệm vụ (C)",
    [QualityRating.NOT_ACHIEVED]: "Không hoàn thành nhiệm vụ (D)"
  }
  const shortLabels = {
    [QualityRating.EXCELLENT]: "A",
    [QualityRating.GOOD]: "B",
    [QualityRating.ACHIEVED]: "C",
    [QualityRating.NOT_ACHIEVED]: "D"
  }
  return (
    <Badge className={cn("font-normal px-2 py-1 text-xs flex flex-col items-center", variants[rating])}>
      <span className="font-bold text-base">{shortLabels[rating]}</span>
      <span className="block whitespace-nowrap">{labels[rating]}</span>
    </Badge>
  )
}

export default function EvaluationTable({ evaluations, loading, error, onView, onDelete }: EvaluationTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-16 text-center">STT</TableHead>
          <TableHead>Họ tên</TableHead>
          <TableHead>Loại phiếu</TableHead>
          <TableHead className="w-28">Thời gian</TableHead>
          <TableHead className="w-32">Tổng điểm</TableHead>
          <TableHead className="w-32">Xếp loại</TableHead>
          <TableHead className="w-40">Trạng thái</TableHead>
          <TableHead className="w-24">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              <LoadingSpinner />
            </TableCell>
          </TableRow>
        ) : error ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-red-500">
              {error}
            </TableCell>
          </TableRow>
        ) : evaluations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
              Không có phiếu đánh giá nào
            </TableCell>
          </TableRow>
        ) : (
          evaluations.map((item, index) => (
            <TableRow key={item.id} className="hover:bg-gray-50">
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                      {item.user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{item.user.name}</div>
                    <div className="text-sm text-gray-500">{item.user.department}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="text-xs">
                  {getRoleLabel(item.user.role)}
                </Badge>
              </TableCell>
              <TableCell>{`${item.month}/${item.year}`}</TableCell>
              <TableCell className="text-center font-medium">
                {item.total_score}/100
              </TableCell>
              <TableCell>
                {getQualityRatingBadge(getQualityRatingFromGrade(item.final_grade))}
              </TableCell>
              <TableCell>
                <Badge className={cn("font-normal", getStatusBadgeVariant(getStatusType(item.status)))}>
                  {getStatusLabel(item.status)}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => onView(item.id.toString())}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-red-600"
                    onClick={() => onDelete(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
} 
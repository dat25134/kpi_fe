import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { EvaluationTableProps } from "@/types/evaluation";
import EvaluationTableRow from "@/components/evaluation/EvaluationTableRow";

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
            <EvaluationTableRow
              key={item.id}
              item={item}
              index={index}
              onView={onView}
              onDelete={onDelete}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
} 
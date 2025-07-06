import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import DatePicker from "react-datepicker";
import { Calendar } from "lucide-react";
import { vi } from "date-fns/locale";

export default function EvaluationFilterBar({
  filterNameInput, setFilterNameInput,
  filterStatusInput, setFilterStatusInput,
  filterRatingInput, setFilterRatingInput,
  filterPeriodInput, setFilterPeriodInput,
  onApply, onClear
}: {
  filterNameInput: string,
  setFilterNameInput: (v: string) => void,
  filterStatusInput: string,
  setFilterStatusInput: (v: string) => void,
  filterRatingInput: string,
  setFilterRatingInput: (v: string) => void,
  filterPeriodInput: Date | null,
  setFilterPeriodInput: (v: Date | null) => void,
  onApply: () => void,
  onClear: () => void
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center p-2 border-b bg-gray-50">
      <Input
        placeholder="Tìm theo tên..."
        value={filterNameInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterNameInput(e.target.value)}
        className="w-40"
      />
      <Select value={filterStatusInput} onValueChange={setFilterStatusInput}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Lọc theo trạng thái" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="draft">Chờ tự đánh giá</SelectItem>
          <SelectItem value="submitted">Chờ đánh giá cấp 1</SelectItem>
          <SelectItem value="level1_approved">Chờ đánh giá cấp 2</SelectItem>
          <SelectItem value="level2_approved">Đã phê duyệt</SelectItem>
          <SelectItem value="completed">Đã hoàn thành</SelectItem>
        </SelectContent>
      </Select>
      <Select value={filterRatingInput} onValueChange={setFilterRatingInput}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Lọc theo xếp loại" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả xếp loại</SelectItem>
          <SelectItem value="A">Hoàn thành xuất sắc (A)</SelectItem>
          <SelectItem value="B">Hoàn thành tốt (B)</SelectItem>
          <SelectItem value="C">Hoàn thành nhiệm vụ (C)</SelectItem>
          <SelectItem value="D">Không hoàn thành (D)</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative">
        <DatePicker
          selected={filterPeriodInput}
          onChange={date => setFilterPeriodInput(date)}
          dateFormat="MM/yyyy"
          showMonthYearPicker
          placeholderText="Chọn tháng/năm"
          className="w-full border rounded px-8 py-1 text-sm"
          locale={vi}
        />
        <span className="left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none absolute">
          <Calendar className="h-4 w-4" />
        </span>
      </div>
      <Button className="bg-blue-600 text-white" size="sm" variant="outline" onClick={onApply}>Tìm kiếm</Button>
      <Button size="sm" variant="outline" onClick={onClear}>Xóa lọc</Button>
    </div>
  );
} 
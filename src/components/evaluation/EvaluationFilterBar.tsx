import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { DatePicker, ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { Calendar } from "lucide-react";
import { vi } from "date-fns/locale";

dayjs.locale("vi");

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
        <ConfigProvider locale={viVN}>
          <DatePicker
            picker="month"
            value={filterPeriodInput ? dayjs(filterPeriodInput) : null}
            onChange={date => setFilterPeriodInput(date ? date.toDate() : null)}
            format="MM/YYYY"
            placeholder="Chọn tháng/năm"
            className="w-full border rounded px-8 py-1 text-sm"
          />
        </ConfigProvider>
      </div>
      <Button className="bg-blue-600 text-white" size="sm" variant="outline" onClick={onApply}>Tìm kiếm</Button>
      <Button size="sm" variant="outline" onClick={onClear}>Xóa lọc</Button>
    </div>
  );
} 
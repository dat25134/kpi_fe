import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Loader2 } from "lucide-react";
import { useMonthlyPerformance } from "@/hooks/useMonthlyPerformance";

export interface MonthlyPerformanceProps {
  departmentId?: string;
  month?: string;
}

export default function MonthlyPerformance({ departmentId, month }: MonthlyPerformanceProps) {
  const { data, isLoading, error } = useMonthlyPerformance({ departmentId, month });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Hiệu suất tháng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Không thể tải dữ liệu hiệu suất tháng</div>
        ) : data ? (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm">Hoàn thành đúng hạn</span>
              <span className="font-medium">{data.onTimeRate}%</span>
            </div>
            <Progress value={data.onTimeRate} />

            <div className="flex justify-between items-center">
              <span className="text-sm">Chất lượng trung bình</span>
              <span className="font-medium">{data.averageQuality}%</span>
            </div>
            <Progress value={data.averageQuality} />

            <div className="flex justify-between items-center">
              <span className="text-sm">Mức độ phức tạp trung bình</span>
              <span className="font-medium">{data.averageComplexity}%</span>
            </div>
            <Progress value={data.averageComplexity} />
          </>
        ) : null}
      </CardContent>
    </Card>
  );
} 
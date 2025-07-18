import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, Loader2 } from "lucide-react";
import { useTaskProgress } from "@/hooks/useTaskProgress";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar } from "recharts";

export default function TaskProgressChart({ timeFilter, departmentId }: { timeFilter: string, departmentId?: string | number }) {
  const { data, loading, error } = useTaskProgress(timeFilter, departmentId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Tiến độ công việc theo tháng
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="completed" fill="#10B981" name="Hoàn thành" />
              <Bar dataKey="ongoing" fill="#3B82F6" name="Đang làm" />
              <Bar dataKey="overdue" fill="#EF4444" name="Quá hạn" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 
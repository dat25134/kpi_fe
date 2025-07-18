import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { TrendingUp, Loader2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from "recharts";
import { useKPITrends } from "@/hooks/useKPITrends";

export interface KPITrendsChartProps {
  // Có thể mở rộng filter sau này
  year?: number;
  departmentId?: string;
}

export const KPITrendsChart: React.FC<KPITrendsChartProps> = ({ year, departmentId }) => {
  const { data: kpiTrends, isLoading, error } = useKPITrends({ year, departmentId });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Xu hướng KPI
        </CardTitle>
        <CardDescription>Hiệu suất đạt được so với mục tiêu</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Không thể tải dữ liệu xu hướng KPI</div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={kpiTrends || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="target" stackId="1" stroke="#94A3B8" fill="#94A3B8" name="Mục tiêu" />
              <Area type="monotone" dataKey="achieved" stackId="2" stroke="#10B981" fill="#10B981" name="Đạt được" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default KPITrendsChart; 
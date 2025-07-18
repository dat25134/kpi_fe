import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";
import { useDepartmentDistribution } from "@/hooks/useDepartmentDistribution";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c", "#d0ed57", "#d8854f"];

export interface DepartmentDistributionProps {
  departmentId?: string;
}

export default function DepartmentDistribution({ departmentId }: DepartmentDistributionProps) {
  const { data, isLoading, error } = useDepartmentDistribution({ departmentId });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Phân bố theo phòng ban</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Không thể tải dữ liệu phân bố phòng ban</div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <RechartsPieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="employees"
                label={({ name, employees }) => `${name}: ${employees}`}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
} 
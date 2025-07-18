import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Loader2 } from "lucide-react";
import { useDepartmentStats } from "@/hooks/useDepartmentStats";

export default function DepartmentStats({ timeFilter }: { timeFilter: string }) {
  const { data, loading, error } = useDepartmentStats(timeFilter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Thống kê theo phòng ban
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="space-y-4">
            {data.map((dept: any) => (
              <div key={dept.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-900">{dept.code}</span>
                  </div>
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-gray-500">{dept.employees} nhân viên</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="outline" className="text-green-700 bg-green-50">
                      {dept.completed} hoàn thành
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 bg-blue-50">
                      {dept.ongoing} đang làm
                    </Badge>
                    {dept.overdue > 0 && (
                      <Badge variant="outline" className="text-red-700 bg-red-50">
                        {dept.overdue} quá hạn
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 
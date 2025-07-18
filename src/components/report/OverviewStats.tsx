import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, ClipboardList, Target, UserCheck, UserX, CheckCircle, Clock, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useOverviewStats } from "@/hooks/useOverviewStats";

interface OverviewStatsProps {
  timeFilter: string;
  departmentId?: string | number;
}

export default function OverviewStats({ timeFilter, departmentId }: OverviewStatsProps) {
  const { data, loading, error } = useOverviewStats({ timeFilter, departmentId });

  const completionRate = data && data.totalTasks > 0 ? Math.round((data.completedTasks / data.totalTasks) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {!data ? (
            <div className="flex justify-center items-center h-12"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{data.totalEmployees}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <UserCheck className="h-3 w-3 mr-1 text-green-600" />
                {data.activeEmployees} hoạt động
                <UserX className="h-3 w-3 ml-2 mr-1 text-red-600" />
                {data.inactiveEmployees} tạm nghỉ
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nhân viên mới trong tháng</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {!data ? (
            <div className="flex justify-center items-center h-12"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{data.newEmployeesThisMonth ?? 0}</div>
              <p className="text-xs text-muted-foreground">Số nhân viên vào làm trong tháng này</p>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng công việc</CardTitle>
          <ClipboardList className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {!data ? (
            <div className="flex justify-center items-center h-12"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{data.totalTasks}</div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                {data.completedTasks} hoàn thành
                <Clock className="h-3 w-3 ml-2 mr-1 text-blue-600" />
                {data.ongoingTasks} đang làm
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {!data ? (
            <div className="flex justify-center items-center h-12"><Loader2 className="animate-spin h-6 w-6 text-gray-400" /></div>
          ) : (
            <>
              <div className="text-2xl font-bold">{completionRate}%</div>
              <Progress value={completionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{data.overdueTasks} công việc quá hạn</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
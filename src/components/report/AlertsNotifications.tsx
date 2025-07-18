import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { AlertTriangle, Clock, Users, CheckCircle, Loader2 } from "lucide-react";
import { useAlertsNotifications } from "@/hooks/useAlertsNotifications";
import OverdueTasksModal from "./OverdueTasksModal";
import { useState } from "react";

export interface AlertsNotificationsProps {
  departmentId?: string;
}

export default function AlertsNotifications({ departmentId }: AlertsNotificationsProps) {
  const { data, isLoading, error } = useAlertsNotifications({ departmentId });
  const [showOverdueModal, setShowOverdueModal] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
          Cảnh báo và thông báo
        </CardTitle>
        <CardDescription>Các vấn đề cần chú ý</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-8">Không thể tải dữ liệu cảnh báo/thông báo</div>
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <div className="font-medium text-red-900 flex items-center gap-2">
                  Công việc quá hạn
                  {data.overdueTasks > 0 && (
                    <button
                      className="ml-2 text-xs text-blue-600 underline hover:text-blue-800"
                      onClick={() => setShowOverdueModal(true)}
                      type="button"
                    >
                      Xem chi tiết
                    </button>
                  )}
                </div>
                <div className="text-sm text-red-700">{data.overdueTasks} công việc đã quá hạn cần xử lý ngay</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium text-yellow-900">Sắp đến hạn</div>
                <div className="text-sm text-yellow-700">{data.upcomingTasks} công việc sẽ đến hạn trong tuần này</div>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <Users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Nhân sự mới</div>
                <div className="text-sm text-blue-700">{data.newEmployees} nhân viên mới cần được phân công công việc</div>
              </div>
            </div>
            {data.achievedTargets && data.achievedTargets.length > 0 && data.achievedTargets.map((target: any, idx: number) => (
              <div key={idx} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900">Mục tiêu đạt được</div>
                  <div className="text-sm text-green-700">{target.department} đã hoàn thành {target.percent}% mục tiêu tháng</div>
                </div>
              </div>
            ))}
            <OverdueTasksModal
              open={showOverdueModal}
              onClose={() => setShowOverdueModal(false)}
              tasks={data.overdueTaskDetails || []}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
} 
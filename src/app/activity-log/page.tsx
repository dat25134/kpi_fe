import { ActivityLogManagement } from "@/components/activity-log/activity-log-management";
import MainHeader from "@/components/shared/main-header"

export const metadata = {
  title: "Activity Log | KPI",
  description: "Trang nhật ký hoạt động, theo dõi các hành động của người dùng.",
  keywords: ["activity log", "KPI", "hiệu suất", "quản trị"],
  openGraph: {
    title: "Activity Log | KPI",
    description: "Trang nhật ký hoạt động, theo dõi các hành động của người dùng.",
    type: "website"
  }
};

export default function ActivityLogPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1 px-2 md:px-6 py-2 md:py-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nếu có card/block tổng quan, đặt ở đây */}
        </div>
        <div className="overflow-x-auto mt-4">
          <ActivityLogManagement />
        </div>
      </div>
    </div>
  )
}
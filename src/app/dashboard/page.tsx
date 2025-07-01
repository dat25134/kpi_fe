import MainHeader from "@/components/shared/main-header"
import TaskManagement from "@/components/task/task-management"

export const metadata = {
  title: "Dashboard | KPI",
  description: "Trang tổng quan KPI, theo dõi hiệu suất và các chỉ số quan trọng của doanh nghiệp.",
  keywords: ["dashboard", "KPI", "hiệu suất", "quản trị"],
  openGraph: {
    title: "Dashboard | KPI",
    description: "Trang tổng quan KPI, theo dõi hiệu suất và các chỉ số quan trọng của doanh nghiệp.",
    type: "website"
  }
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1 px-2 md:px-6 py-2 md:py-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nếu có card/block tổng quan, đặt ở đây */}
        </div>
        <div className="overflow-x-auto mt-4">
          <TaskManagement />
        </div>
      </div>
    </div>
  )
}
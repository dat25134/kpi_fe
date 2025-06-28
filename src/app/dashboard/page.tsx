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
      <div className="flex-1">
        <TaskManagement />
      </div>
    </div>
  )
}
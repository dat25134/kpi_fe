import MainHeader from "@/components/shared/main-header"
import DepartmentManagement from "@/components/department/department-management"
import WithRoleGuard from "@/components/shared/with-role-guard"

export const metadata = {
  title: "Phòng ban | KPI",
  description: "Quản lý thông tin các phòng ban trong doanh nghiệp.",
  keywords: ["phòng ban", "quản lý phòng ban", "KPI"],
  openGraph: {
    title: "Phòng ban | KPI",
    description: "Quản lý thông tin các phòng ban trong doanh nghiệp.",
    type: "website"
  }
};

export default function DepartmentsPage() {
  return (
    <WithRoleGuard allowedRoles={["admin"]}>
      <div className="flex min-h-[calc(100vh-100px)] flex-col">
        <MainHeader />
        <div className="flex-1">
          <DepartmentManagement />
        </div>
      </div>
    </WithRoleGuard>
  )
}

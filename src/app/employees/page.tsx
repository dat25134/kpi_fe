import MainHeader from "@/components/shared/main-header"
import EmployeeManagement from "@/components/employee/employee-management"
import WithPermissionGuard from "@/components/shared/with-role-guard"

export const metadata = {
  title: "Nhân viên | KPI",
  description: "Quản lý danh sách, thông tin và hiệu suất nhân viên.",
  keywords: ["nhân viên", "quản lý nhân sự", "KPI"],
  openGraph: {
    title: "Nhân viên | KPI",
    description: "Quản lý danh sách, thông tin và hiệu suất nhân viên.",
    type: "website"
  }
};

export default function EmployeesPage() {
  return (
    <WithPermissionGuard allowedPermissions={["hr.view"]}>
      <div className="flex min-h-[calc(100vh-100px)] flex-col">
        <MainHeader />
        <div className="flex-1">
          <EmployeeManagement />
        </div>
      </div>
    </WithPermissionGuard>
  )
}

import MainHeader from "@/components/shared/main-header"
import DepartmentManagement from "@/components/department/department-management"
import WithRoleGuard from "@/components/shared/with-role-guard"

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

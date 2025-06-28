import MainHeader from "@/components/shared/main-header"
import EmployeeManagement from "@/components/employee/employee-management"
import WithRoleGuard from "@/components/shared/with-role-guard"

export default function EmployeesPage() {
  return (
    <WithRoleGuard allowedRoles={["admin"]}>
      <div className="flex min-h-[calc(100vh-100px)] flex-col">
        <MainHeader />
        <div className="flex-1">
          <EmployeeManagement />
        </div>
      </div>
    </WithRoleGuard>
  )
}

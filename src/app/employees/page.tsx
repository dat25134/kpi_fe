"use client"

import MainHeader from "@/components/main-header"
import EmployeeManagement from "@/components/employee-management"
import WithRoleGuard from "@/components/with-role-guard"

export default function EmployeesPage() {
  return (
    <WithRoleGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <div className="flex-1">
          <EmployeeManagement />
        </div>
      </div>
    </WithRoleGuard>
  )
}

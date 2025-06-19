"use client"

import MainHeader from "@/components/main-header"
import DepartmentManagement from "@/components/department-management"
import WithRoleGuard from "@/components/with-role-guard"

export default function DepartmentsPage() {
  return (
    <WithRoleGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen flex-col">
        <MainHeader />
        <div className="flex-1">
          <DepartmentManagement />
        </div>
      </div>
    </WithRoleGuard>
  )
}

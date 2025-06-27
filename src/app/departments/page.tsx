"use client"

import MainHeader from "@/components/shared/main-header"
import DepartmentManagement from "@/components/department/department-management"
import WithRoleGuard from "@/components/shared/with-role-guard"
import { useDepartments, useDepartmentSummary } from "@/hooks/useDepartments"

export default function DepartmentsPage() {
  const { data: departments, isLoading: loadingDepartments } = useDepartments();
  const { data: summary, isLoading: loadingSummary } = useDepartmentSummary();

  return (
    <WithRoleGuard allowedRoles={["admin"]}>
      <div className="flex min-h-[calc(100vh-100px)] flex-col">
        <MainHeader />
        <div className="flex-1">
          <DepartmentManagement
            departments={departments || []}
            summary={summary}
            isLoading={loadingDepartments || loadingSummary}
          />
        </div>
      </div>
    </WithRoleGuard>
  )
}

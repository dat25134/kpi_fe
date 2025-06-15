import MainHeader from "@/components/main-header"
import DepartmentManagement from "@/components/department-management"

export default function DepartmentsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <div className="flex-1">
        <DepartmentManagement />
      </div>
    </div>
  )
}

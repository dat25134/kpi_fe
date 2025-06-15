import MainHeader from "@/components/main-header"
import EmployeeManagement from "@/components/employee-management"

export default function EmployeesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <div className="flex-1">
        <EmployeeManagement />
      </div>
    </div>
  )
}

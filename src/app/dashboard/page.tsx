import MainHeader from "@/components/main-header"
import TaskManagement from "@/components/task-management"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <div className="flex-1">
        <TaskManagement />
      </div>
    </div>
  )
}
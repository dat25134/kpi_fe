import MainHeader from "@/components/shared/main-header"
import TaskManagement from "@/components/task/task-management"

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1">
        <TaskManagement />
      </div>
    </div>
  )
}
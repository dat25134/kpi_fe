import MainHeader from "@/components/shared/main-header"
import RolesManagement from "@/components/roles/role-management"

export const metadata = {
  title: "Quản lý vai trò | KPI",
  description: "Quản lý vai trò và cấp bậc của nhân viên trong tổ chức.",
  keywords: ["quản lý", "vai trò", "cấp bậc", "nhân viên", "tổ chức"],
  openGraph: {
    title: "Quản lý vai trò | KPI",
    description: "Quản lý vai trò và cấp bậc của nhân viên trong tổ chức.",
    type: "website"
  }
}

export default function RolesPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1">
        <RolesManagement />
      </div>
    </div>
  )
}
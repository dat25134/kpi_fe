import MainHeader from "@/components/shared/main-header"
import UserSettings from "@/components/user/user-settings"

export const metadata = {
  title: "Cài đặt | KPI",
  description: "Cài đặt hệ thống và tài khoản người dùng.",
  keywords: ["cài đặt", "thiết lập", "KPI"],
  openGraph: {
    title: "Cài đặt | KPI",
    description: "Cài đặt hệ thống và tài khoản người dùng.",
    type: "website"
  }
};

export default function SettingsPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1">
        <UserSettings />
      </div>
    </div>
  )
}
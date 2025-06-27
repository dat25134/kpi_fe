import MainHeader from "@/components/shared/main-header"
import UserSettings from "@/components/user/user-settings"

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
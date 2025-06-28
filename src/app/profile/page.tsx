import MainHeader from "@/components/shared/main-header"
import UserProfile from "@/components/user/user-profile"

export default function ProfilePage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1">
        <UserProfile />
      </div>
    </div>
  )
}
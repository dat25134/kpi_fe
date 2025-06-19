import MainHeader from "@/components/main-header"
import UserProfile from "@/components/user-profile"

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
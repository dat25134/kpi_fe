import MainHeader from "@/components/shared/main-header"
import UserProfile from "@/components/user/user-profile"

export const metadata = {
  title: "Hồ sơ cá nhân | KPI",
  description: "Xem và chỉnh sửa thông tin cá nhân, hồ sơ nhân viên.",
  keywords: ["hồ sơ", "cá nhân", "nhân viên", "KPI"],
  openGraph: {
    title: "Hồ sơ cá nhân | KPI",
    description: "Xem và chỉnh sửa thông tin cá nhân, hồ sơ nhân viên.",
    type: "website"
  }
};

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
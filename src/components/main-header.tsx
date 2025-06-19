"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, FileText, LayoutDashboard, Building2, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { setAuthToken } from "@/services/auth"
import { useUser } from "@/hooks/useUser"

export default function MainHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useUser();

  const handleLogout = () => {
    setAuthToken("")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#0f172a] text-white">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center mr-4">
          <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-sm md:text-base">HỆ THỐNG GIÁM SÁT CÔNG VIỆC</span>
        </div>

        <nav className="flex items-center space-x-1 ml-4">
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className={cn(
                "h-9 px-3 text-xs md:text-sm",
                pathname === "/dashboard" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-white hover:bg-blue-800",
              )}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Quản lý công việc
            </Button>
          </Link>

          {user?.role === "admin" && (
            <Link href="/departments">
              <Button
                variant={pathname === "/departments" ? "secondary" : "ghost"}
                className={cn(
                  "h-9 px-3 text-xs md:text-sm",
                  pathname === "/departments"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-white hover:bg-blue-800",
                )}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Quản lý phòng ban
              </Button>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/employees">
              <Button
                variant={pathname === "/employees" ? "secondary" : "ghost"}
                className={cn(
                  "h-9 px-3 text-xs md:text-sm",
                  pathname === "/employees" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-white hover:bg-blue-800",
                )}
              >
                <Users className="h-4 w-4 mr-2" />
                Quản lý nhân viên
              </Button>
            </Link>
          )}

          <Link href="/evaluation">
            <Button
              variant={pathname === "/evaluation" ? "secondary" : "ghost"}
              className={cn(
                "h-9 px-3 text-xs md:text-sm",
                pathname === "/evaluation"
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "text-white hover:bg-blue-800",
              )}
            >
              <FileText className="h-4 w-4 mr-2" />
              Phiếu đánh giá
            </Button>
          </Link>
        </nav>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-blue-600 rounded-md p-2">
                <span className="text-sm hidden md:inline-block text-white">{isLoading ? "Đang tải..." : user?.name || "Không rõ"}</span>
                <Avatar className="h-8 w-8">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-blue-100 text-blue-900">{user?.name ? user.name.split(" ").map((w: string) => w[0]).join("").toUpperCase() : "?"}</AvatarFallback>
                  )}
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                Thông tin nhân sự
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

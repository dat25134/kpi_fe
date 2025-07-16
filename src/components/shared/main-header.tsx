"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, FileText, LayoutDashboard, Building2, Users, Menu, Shield, FileChartColumn, Activity } from "lucide-react"
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
import { toast } from "sonner"
import { useState } from "react"
import MobileSidebar from "./mobile-sidebar"

function hasPermission(user: { permissions?: string[] } | undefined, permission: string): boolean {
  return user?.permissions?.includes(permission) ?? false;
}

export default function MainHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuthToken("")
    toast.success("Đăng xuất thành công")
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#0f172a] text-white">
      <div className="flex flex-wrap md:flex-nowrap h-auto items-center px-2 md:px-4">
        <div className="flex items-center mr-2 md:mr-4 mb-2 md:mb-0">
          <div className="w-8 h-8 bg-orange-600 rounded-md flex items-center justify-center mr-2">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="font-bold text-xs md:text-base whitespace-nowrap">HỆ THỐNG GIÁM SÁT CÔNG VIỆC</span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="text-white md:hidden ml-auto"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Mở menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        <nav className="hidden md:flex items-center space-x-1 ml-0 md:ml-4 w-full md:w-auto flex-wrap">
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className={cn(
                "h-9 px-3 text-xs md:text-sm",
                pathname === "/dashboard" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-white hover:bg-blue-800",
              )}
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              <span className="hidden xl:inline">Quản lý công việc</span>
            </Button>
          </Link>

          {(hasPermission(user, "department.manage") || hasPermission(user, "hr.view") || hasPermission(user, "system.grant_permission") || hasPermission(user, "evaluation_criteria.manage")) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={['/departments','/employees','/roles','/criteria'].includes(pathname) ? 'secondary' : 'ghost'}
                  className={cn(
                    'text-white',
                    ['/departments','/employees','/roles','/criteria'].includes(pathname)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-white hover:bg-blue-800',
                  )}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  <span className="hidden xl:inline">Quản trị</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {hasPermission(user, "department.manage") && (
                  <DropdownMenuItem asChild>
                    <Link href="/departments">Quản lý phòng ban</Link>
                  </DropdownMenuItem>
                )}
                {hasPermission(user, "hr.view") && (
                  <DropdownMenuItem asChild>
                    <Link href="/employees">Quản lý nhân viên</Link>
                  </DropdownMenuItem>
                )}
                {hasPermission(user, "system.grant_permission") && (
                  <DropdownMenuItem asChild>
                    <Link href="/roles">Quản lý vai trò</Link>
                  </DropdownMenuItem>
                )}
                {hasPermission(user, "evaluation_criteria.manage") && (
                  <DropdownMenuItem asChild>
                    <Link href="/criteria">Quản lý tiêu chí</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {hasPermission(user, "evaluation.view") && (
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
                <span className="hidden xl:inline">Phiếu đánh giá</span>
              </Button>
            </Link>
          )}

          {hasPermission(user, "report.view_dashboard") && (
            <Link href="/reports">
              <Button
                variant={pathname === "/reports" ? "secondary" : "ghost"}
                className={cn(
                  "h-9 px-3 text-xs md:text-sm",
                  pathname === "/reports" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-white hover:bg-blue-800",
                )}
              >
                <FileChartColumn className="h-4 w-4 mr-2" />
                <span className="hidden xl:inline">Báo cáo</span>
              </Button>
            </Link>
          )}

          {hasPermission(user, "system.view_log") && (
            <Link href="/activity-log">
              <Button
                variant={pathname === "/activity-log" ? "secondary" : "ghost"}
                className={cn(
                  "h-9 px-3 text-xs md:text-sm",
                  pathname === "/activity-log" ? "bg-blue-600 text-white hover:bg-blue-700" : "text-white hover:bg-blue-800",
                )}
              >
                <Activity className="h-4 w-4 mr-2" />
                <span className="hidden xl:inline">Nhật ký hoạt động</span>
              </Button>
            </Link>
          )}
        </nav>

        <div className="hidden md:flex ml-auto items-center space-x-4 mt-2 md:mt-0">
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 cursor-pointer hover:bg-blue-600 rounded-md p-2">
                <span className="text-sm hidden md:inline-block text-white">{isLoading ? "Đang tải..." : user?.name || "Không rõ"}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-100 text-blue-900 text-xl">{user?.avatar}</AvatarFallback>
                </Avatar>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <Link href="/profile">Thông tin nhân sự</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Link href="/settings">Cài đặt</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <Link href="/logout">Đăng xuất</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile sidebar menu (Sheet/Drawer) */}
        <MobileSidebar
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          user={user}
          isLoading={isLoading}
          pathname={pathname}
          router={router}
          handleLogout={handleLogout}
        />
      </div>
    </header>
  )
}

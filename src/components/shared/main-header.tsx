"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bell, FileText, LayoutDashboard, Building2, Users, Menu, Shield, FileChartColumn, Activity, CheckCircle } from "lucide-react"
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
import { useState, useEffect } from "react"
import MobileSidebar from "./mobile-sidebar"
import ChangePasswordModal from "@/components/user/change-password-modal"
import { useNotificationsSocket } from '@/hooks/useNotificationsSocket';
import { Badge, List, Dropdown } from 'antd';
import { markNotificationAsRead, markAllNotificationsAsRead } from '@/services/notifi';

function hasPermission(user: { permissions?: string[] } | undefined, permission: string): boolean {
  return user?.permissions?.includes(permission) ?? false;
}

export default function MainHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isLoading } = useUser();
  const userId = user?.id;
  const { notifications: notificationsFromHook, unreadCount: unreadCountFromHook } = useNotificationsSocket(userId);
  const [notifications, setNotifications] = useState(notificationsFromHook);
  const [unreadCount, setUnreadCount] = useState(unreadCountFromHook);

  // Đồng bộ state local với hook khi có thay đổi từ hook
  useEffect(() => {
    setNotifications(notificationsFromHook);
    setUnreadCount(unreadCountFromHook);
  }, [notificationsFromHook, unreadCountFromHook]);

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => prev.map((n: any) => ({ ...n, read_at: n.read_at || new Date().toISOString() })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Đánh dấu tất cả đã đọc thất bại', err);
    }
  };

  const notificationDropdown = (
    <div className="min-w-[340px] max-h-[420px] bg-white rounded-xl shadow-lg p-0 flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <div className="flex items-center gap-2 font-semibold text-base">
          <Bell className="w-5 h-5 text-blue-500" />
          Thông báo mới
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-blue-600 hover:bg-blue-50"
          onClick={handleMarkAllRead}
        >
          <CheckCircle className="w-4 h-4 mr-1" /> Đánh dấu đã đọc
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <List
          dataSource={notifications}
          locale={{ emptyText: 'Không có thông báo mới.' }}
          renderItem={item => (
            <List.Item
              className={`transition-all px-4 py-3 border-b last:border-b-0 cursor-pointer rounded-lg ${
                !item.read_at ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-50'
              }`}
              style={{ position: "relative" }}
              onClick={() => handleRead(item)}
            >
              {!item.read_at && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
              <div className="ml-4">
                <div className="font-medium text-sm text-gray-900">{item.data.title}</div>
                <div className="text-xs text-gray-600">{item.data.content}</div>
                <div className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleString()}</div>
              </div>
            </List.Item>
          )}
        />
      </div>
      <div className="border-t px-4 py-2 text-center">
        <Button
          size="sm"
          variant="outline"
          className="w-full"
          // onClick={() => router.push('/notifications')}
        >
          Xem tất cả thông báo
        </Button>
      </div>
    </div>
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const handleLogout = () => {
    setAuthToken("")
    toast.success("Đăng xuất thành công")
    router.push("/login")
  }

  const handleRead = async (item: any) => {
    if (!item.read_at) {
      try {
        await markNotificationAsRead(item.id);
        setNotifications(prev =>
          prev.map((n: any) =>
            n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n
          )
        );
        setUnreadCount(prev => {
          // Tính lại số lượng chưa đọc dựa trên notifications mới
          const newCount = notifications.filter((n: any) => n.id === item.id ? false : !n.read_at).length;
          return newCount;
        });
      } catch (err) {
        console.error('Đánh dấu đã đọc thất bại', err);
      }
    }
    if (item.data?.url) {
      router.push(item.data.url);
    }
  };

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
          <Dropdown popupRender={() => notificationDropdown} trigger={["click"]} placement="bottomRight">
            <Badge count={unreadCount} size="small" offset={[0, 2]}>
              <Button variant="ghost" size="icon" className="text-white">
                <Bell className="h-5 w-5" />
              </Button>
            </Badge>
          </Dropdown>
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
              <DropdownMenuItem onClick={() => setChangePasswordOpen(true)}>
                Đổi mật khẩu
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600 focus:text-red-600"
                onClick={handleLogout}
              >
                <Link href="/logout">Đăng xuất</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
            <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
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

import Link from "next/link";
import { LayoutDashboard, Building2, Users, FileText } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import React from "react";

interface MobileSidebarProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  user: any;
  isLoading: boolean;
  pathname: string;
  router: any;
  handleLogout: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  mobileMenuOpen,
  setMobileMenuOpen,
  user,
  isLoading,
  pathname,
  router,
  handleLogout,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex flex-row pointer-events-none">
      {/* Sidebar bên trái */}
      <div
        className={`
          w-64 bg-[#0f172a] h-full shadow-lg p-4 flex flex-col
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-x-0 opacity-100 pointer-events-auto" : "-translate-x-full opacity-0 pointer-events-none"}
        `}
        style={{ willChange: "transform, opacity" }}
      >
        <div className="flex items-center justify-between mb-6">
          <span className="font-bold text-base">Menu</span>
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setMobileMenuOpen(false)}>
            <span className="text-2xl">×</span>
          </Button>
        </div>
        <nav className="flex flex-col space-y-2">
          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Quản lý công việc
            </Button>
          </Link>
          {user?.role === "admin" && (
            <Link href="/departments" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/departments" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Quản lý phòng ban
              </Button>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/employees" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/employees" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                Quản lý nhân viên
              </Button>
            </Link>
          )}
          {user?.role === "admin" && (
            <Link href="/roles" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant={pathname === "/roles" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                Quản lý vai trò
              </Button>
            </Link>
          )}
          <Link href="/evaluation" onClick={() => setMobileMenuOpen(false)}>
            <Button
              variant={pathname === "/evaluation" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <FileText className="h-4 w-4 mr-2" />
              Phiếu đánh giá
            </Button>
          </Link>
        </nav>
        <div className="mt-auto pt-6 border-t border-slate-700">
          <div className="flex items-center space-x-2 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-100 text-blue-900 text-xl">{user?.avatar}</AvatarFallback>
            </Avatar>
            <span className="text-white text-sm">{isLoading ? "Đang tải..." : user?.name || "Không rõ"}</span>
          </div>
          <Button variant="ghost" className="w-full justify-start text-left" onClick={() => { setMobileMenuOpen(false); router.push("/profile"); }}>
            Thông tin nhân sự
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left" onClick={() => { setMobileMenuOpen(false); router.push("/settings"); }}>
            Cài đặt
          </Button>
          <Button variant="ghost" className="w-full justify-start text-left text-red-600" onClick={() => { setMobileMenuOpen(false); handleLogout(); }}>
            Đăng xuất
          </Button>
        </div>
      </div>
      {/* Lớp phủ nền nhẹ, chiếm phần còn lại bên phải */}
      <div
        className={`flex-1 transition-opacity duration-300 ${mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{ background: "rgba(0,0,0,0.08)", backdropFilter: "blur(2px)" }}
        onClick={() => setMobileMenuOpen(false)}
      />
    </div>
  );
};

export default MobileSidebar; 
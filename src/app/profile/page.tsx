"use client";
import { useUser } from "@/hooks/useUser";
import MainHeader from "@/components/main-header";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function ProfilePage() {
  const { user, isLoading } = useUser();

  if (isLoading) return <LoadingSpinner />;
  if (!user) return <div>Không tìm thấy thông tin nhân sự.</div>;

  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col bg-gray-100">
      <MainHeader />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-10 flex flex-col md:flex-row gap-10 border border-gray-200">
          {/* Avatar và tên */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl text-gray-500">{user.name?.[0] || "?"}</span>
              )}
            </div>
            <div className="text-2xl font-bold">{user.name}</div>
            <div className="text-gray-500">{user.position || "Chức vụ chưa cập nhật"}</div>
            <div className="text-gray-400 text-sm">{user.email}</div>
          </div>
          {/* Thông tin chi tiết */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600">Số điện thoại</label>
              <div className="border rounded px-3 py-2">{user.phone || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Giới tính</label>
              <div className="border rounded px-3 py-2">{user.gender || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Ngày sinh</label>
              <div className="border rounded px-3 py-2">{user.birthday || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Phòng ban</label>
              <div className="border rounded px-3 py-2">{user.department?.name || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Chức vụ</label>
              <div className="border rounded px-3 py-2">{user.position || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Lương (VND)</label>
              <div className="border rounded px-3 py-2">{user.salary ? user.salary.toLocaleString() : "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Trạng thái</label>
              <div className="border rounded px-3 py-2">{user.status || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Địa chỉ</label>
              <div className="border rounded px-3 py-2">{user.address || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Trình độ học vấn</label>
              <div className="border rounded px-3 py-2">{user.education || "-"}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">Kinh nghiệm</label>
              <div className="border rounded px-3 py-2">{user.experience || "-"}</div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-600">Kỹ năng</label>
              <div className="border rounded px-3 py-2">{user.skills || "-"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
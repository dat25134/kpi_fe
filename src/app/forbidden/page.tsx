export default function ForbiddenPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-red-600 mb-4">403 - Forbidden</h1>
      <p className="text-lg text-gray-700 mb-8">
        Bạn không có quyền truy cập vào trang này.
      </p>
      <a
        href="/"
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Quay về trang chủ
      </a>
    </div>
  );
} 
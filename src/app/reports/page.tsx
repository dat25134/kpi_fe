import Reports from "@/components/report/report";
import MainHeader from "@/components/shared/main-header"

export const metadata = {
  title: "Reports | KPI",
  description: "Trang báo cáo, theo dõi các chỉ số hiệu suất và kết quả.",
  keywords: ["reports", "KPI", "hiệu suất", "quản trị"],
  openGraph: {
    title: "Reports | KPI",
    description: "Trang báo cáo, theo dõi các chỉ số hiệu suất và kết quả.",
    type: "website"
  }
};

export default function ReportsPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1 px-2 md:px-6 py-2 md:py-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Nếu có card/block tổng quan, đặt ở đây */}
        </div>
        <div className="overflow-x-auto mt-4">
          <Reports />
        </div>
      </div>
    </div>
  )
}
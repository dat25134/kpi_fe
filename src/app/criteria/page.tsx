import MainHeader from "@/components/shared/main-header";
import CriteriaManagement from "@/components/evaluation/criteria-management";

export const metadata = {
  title: "Quản lý tiêu chí | KPI",
  description: "Quản lý bộ tiêu chí đánh giá cho các vai trò.",
  keywords: ["quản lý", "tiêu chí", "đánh giá", "KPI"],
  openGraph: {
    title: "Quản lý tiêu chí | KPI",
    description: "Quản lý bộ tiêu chí đánh giá cho các vai trò.",
    type: "website"
  }
};

export default function CriteriaPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1">
        <CriteriaManagement />
      </div>
    </div>
  );
} 
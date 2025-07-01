import MainHeader from "@/components/shared/main-header"
import EvaluationForm from "@/components/evaluation/evaluation-form"

export const metadata = {
  title: "Đánh giá | KPI",
  description: "Đánh giá hiệu suất làm việc của nhân viên theo KPI.",
  keywords: ["đánh giá", "KPI", "hiệu suất"],
  openGraph: {
    title: "Đánh giá | KPI",
    description: "Đánh giá hiệu suất làm việc của nhân viên theo KPI.",
    type: "website"
  }
};

export default function EvaluationPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1 flex flex-col items-center px-2 md:px-6 py-2 md:py-4 w-full">
        <div className="w-full">
          <EvaluationForm />
        </div>
      </div>
    </div>
  )
}

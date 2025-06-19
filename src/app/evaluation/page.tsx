import MainHeader from "@/components/main-header"
import EvaluationForm from "@/components/evaluation-form"

export default function EvaluationPage() {
  return (
    <div className="flex min-h-[calc(100vh-100px)] flex-col">
      <MainHeader />
      <div className="flex-1">
        <EvaluationForm />
      </div>
    </div>
  )
}

import MainHeader from "@/components/main-header"
import EvaluationForm from "@/components/evaluation-form"

export default function EvaluationPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainHeader />
      <div className="flex-1">
        <EvaluationForm />
      </div>
    </div>
  )
}

import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  actionButtonsConfig: {
    canSaveDraft: boolean
    canSubmit: boolean
    canLevel1Approve: boolean
    canLevel2Approve: boolean
    canComplete: boolean
    canUpdateLevel1: boolean
    canUpdateLevel2: boolean
  }
  saving: boolean
  onSaveDraft: () => void
  onSubmit: () => void
  onLevel1Approve: () => void
  onLevel2Approve: () => void
  onComplete: () => void
}

export default function ActionButtons({
  actionButtonsConfig,
  saving,
  onSaveDraft,
  onSubmit,
  onLevel1Approve,
  onLevel2Approve,
  onComplete
}: ActionButtonsProps) {
  const buttons = []

  if (actionButtonsConfig.canSaveDraft) {
    buttons.push(
      <Button key="draft" variant="outline" onClick={onSaveDraft} disabled={saving}>
        {saving ? "Đang lưu..." : "Lưu nháp"}
      </Button>
    )
  }

  if (actionButtonsConfig.canSubmit) {
    buttons.push(
      <Button key="submit" onClick={onSubmit} disabled={saving}>
        {saving ? "Đang gửi..." : "Gửi đánh giá"}
      </Button>
    )
  }

  if (actionButtonsConfig.canLevel1Approve) {
    buttons.push(
      <Button key="level1" onClick={onLevel1Approve} disabled={saving}>
        {saving ? "Đang đánh giá..." : "Đánh giá cấp 1"}
      </Button>
    )
  }

  if (actionButtonsConfig.canUpdateLevel1) {
    buttons.push(
      <Button key="level1" variant="outline" onClick={onLevel1Approve} disabled={saving}>
        {saving ? "Đang cập nhật..." : "Cập nhật đánh giá cấp 1"}
      </Button>
    )
  }

  if (actionButtonsConfig.canLevel2Approve) {
    buttons.push(
      <Button key="level2" onClick={onLevel2Approve} disabled={saving}>
        {saving ? "Đang đánh giá..." : "Đánh giá cấp 2"}
      </Button>
    )
  }

  if (actionButtonsConfig.canUpdateLevel2) {
    buttons.push(
      <Button key="level2" variant="outline" onClick={onLevel2Approve} disabled={saving}>
        {saving ? "Đang cập nhật..." : "Cập nhật đánh giá cấp 2"}
      </Button>
    )
  }

  if (actionButtonsConfig.canComplete) {
    buttons.push(
      <Button key="complete" onClick={onComplete} disabled={saving}>
        {saving ? "Đang hoàn thành..." : "Hoàn thành"}
      </Button>
    )
  }

  return <>{buttons}</>
} 
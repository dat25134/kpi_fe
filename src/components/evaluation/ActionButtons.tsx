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
  currentMode?:
    | 'draft'
    | 'submit'
    | 'level1-approve'
    | 'level1-update'
    | 'level2-approve'
    | 'level2-update'
    | 'complete'
    | 'level2-update-or-complete'
}

export default function ActionButtons({
  actionButtonsConfig,
  saving,
  onSaveDraft,
  onSubmit,
  onLevel1Approve,
  onLevel2Approve,
  onComplete,
  currentMode,
}: ActionButtonsProps) {
  const buttons = []

  if (!currentMode || currentMode === 'draft') {
    if (actionButtonsConfig.canSaveDraft)
      buttons.push(
        <Button key="draft" variant="outline" onClick={onSaveDraft} disabled={saving}>
          {saving ? "Đang lưu..." : "Lưu nháp"}
        </Button>
      )
    if (actionButtonsConfig.canSubmit)
      buttons.push(
        <Button key="submit" onClick={onSubmit} disabled={saving}>
          {saving ? "Đang gửi..." : "Gửi đánh giá"}
        </Button>
      )
  }
  if (currentMode === 'level1-approve' && actionButtonsConfig.canLevel1Approve) {
    buttons.push(
      <Button key="level1-approve" onClick={onLevel1Approve} disabled={saving}>
        {saving ? "Đang đánh giá..." : "Đánh giá cấp 1"}
      </Button>
    )
  }
  if (currentMode === 'level1-update' && actionButtonsConfig.canUpdateLevel1) {
    buttons.push(
      <Button key="level1-update" variant="outline" onClick={onLevel1Approve} disabled={saving}>
        {saving ? "Đang cập nhật..." : "Cập nhật đánh giá cấp 1"}
      </Button>
    )
  }
  if (currentMode === 'level2-approve' && actionButtonsConfig.canLevel2Approve) {
    buttons.push(
      <Button key="level2-approve" onClick={onLevel2Approve} disabled={saving}>
        {saving ? "Đang đánh giá..." : "Đánh giá cấp 2"}
      </Button>
    )
  }
  if (currentMode === 'level2-update' || currentMode === 'level2-update-or-complete') {
    if (actionButtonsConfig.canUpdateLevel2) {
      buttons.push(
        <Button key="level2-update" variant="outline" onClick={onLevel2Approve} disabled={saving}>
          {saving ? "Đang cập nhật..." : "Cập nhật đánh giá cấp 2"}
        </Button>
      )
    }
  }
  if (currentMode === 'complete' || currentMode === 'level2-update-or-complete') {
    if (actionButtonsConfig.canComplete) {
      buttons.push(
        <Button key="complete" onClick={onComplete} disabled={saving}>
          {saving ? "Đang hoàn thành..." : "Hoàn thành"}
        </Button>
      )
    }
  }
  return <>{buttons}</>
} 
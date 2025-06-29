export type PermissionModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    role: any
    onUpdatePermissions: (roleId: number, permissions: any[]) => void
  }
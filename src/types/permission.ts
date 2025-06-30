export type PermissionModalProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    role: any
    onUpdatePermissions: (roleId: number, permissions: any[]) => void
  }

export type Permission = {
  id: number
  name: string
  module: string
  category: string
  description: string
}

export type ModulePermission = {
  id: number
  name: string
  module: string
  category: string
  description: string
  permissions: Permission[]
  createdAt: string
  updatedAt: string
}
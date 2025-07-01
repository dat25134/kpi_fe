"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Shield,
  Users,
  FileText,
  Settings,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Building2,
  ClipboardCheck,
} from "lucide-react"
import { PermissionModalProps } from "@/types/permission"
import { usePermissions } from "@/hooks/usePermission"
import { useModules } from "@/hooks/useModule"
import { getErrorMessage, getValidationErrors } from "@/services/errorHandler"

// Tạo ánh xạ tên icon sang component
const iconMap: Record<string, any> = {
  Users,
  Building2,
  FileText,
  ClipboardCheck,
  Settings,
}

export default function PermissionModal({
  open,
  onOpenChange,
  role,
  onUpdatePermissions,
}: PermissionModalProps) {
  const [permissions, setPermissions] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModule, setSelectedModule] = useState("all")
  // Danh sách tất cả quyền hạn có thể có trong hệ thống
  const { permissions: allPermissions } = usePermissions()
  const { modules: allModulesRaw } = useModules()
  const allModules = allModulesRaw ?? [];

  const moduleIcons = allModules.reduce((acc: Record<string, any>, module: any) => {
    acc[module.name] = module.icon
    return acc
  }, {})

  const moduleDisplayNames = allModules.reduce((acc: Record<string, any>, module: any) => {
    acc[module.name] = module.display_name
    return acc
  }, {})

  const moduleColors = allModules.reduce((acc: Record<string, any>, module: any) => {
    acc[module.name] = module.color
    return acc
  }, {})

  useEffect(() => {
    if (role) {
      // Nếu role.permissions là mảng id: [1,3,5]
      const grantedIds = Array.isArray(role.permissions)
        ? role.permissions.map((p: any) => (typeof p === 'object' ? p.id : p))
        : [];
      const rolePermissions = allPermissions.map((perm: any) => ({
        ...perm,
        granted: grantedIds.includes(perm.id),
      }));
      setPermissions(rolePermissions);
    }
  }, [role, allPermissions]);

  if (!role) return null

  const handlePermissionToggle = (permissionId: number, granted: boolean) => {
    setPermissions((prev) => prev.map((perm) => (perm.id === permissionId ? { ...perm, granted } : perm)))
  }

  const handleSave = () => {
      const role_id = role.id
      const permission_ids = permissions.filter((p: any) => p.granted).map((p: any) => p.id)
    onUpdatePermissions(role.id, permission_ids)
  }

  const handleSelectAll = (module: string) => {
    setPermissions((prev) =>
      prev.map((perm) => (module === "all" || perm.module === module ? { ...perm, granted: true } : perm)),
    )
  }

  const handleDeselectAll = (module: string) => {
    setPermissions((prev) =>
      prev.map((perm) => (module === "all" || perm.module === module ? { ...perm, granted: false } : perm)),
    )
  }

  const filteredPermissions = permissions.filter((perm) => {
    const matchesSearch =
      perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModule = selectedModule === "all" || perm.module === selectedModule
    return matchesSearch && matchesModule
  })

  const groupedPermissions = filteredPermissions.reduce(
    (acc, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = []
      }
      acc[perm.module].push(perm)
      return acc
    },
    {} as Record<string, any[]>,
  )

  const grantedCount = permissions.filter((p) => p.granted).length
  const totalCount = permissions.length

  const modules = [...new Set(allPermissions.map((p: any) => p.module))]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[85vh] overflow-hidden">
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5 text-blue-600" />
            Cấp quyền cho chức vụ: {role.display_name}
            <Badge variant="outline">{role.code}</Badge>
          </DialogTitle>
          <DialogDescription>Quản lý quyền hạn và phân quyền truy cập cho chức vụ này</DialogDescription>
        </DialogHeader>

        {/* Thống kê quyền */}
        <div className="grid grid-cols-3 gap-3 mb-3">
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Tổng quyền</p>
                  <p className="text-xl font-bold">{totalCount}</p>
                </div>
                <Shield className="h-6 w-6 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Đã cấp</p>
                  <p className="text-xl font-bold text-green-600">{grantedCount}</p>
                </div>
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600">Chưa cấp</p>
                  <p className="text-xl font-bold text-red-600">{totalCount - grantedCount}</p>
                </div>
                <XCircle className="h-6 w-6 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedModule} onValueChange={setSelectedModule} className="w-full max-h-[350px]">
          <div className="flex items-center justify-between mb-3">
            <TabsList className="flex w-full h-9">
              <TabsTrigger value="all" className="text-xs">Tất cả</TabsTrigger>
              {modules.map((module: any) => (
                <TabsTrigger key={module} value={module} className="text-xs">
                  {moduleDisplayNames[module] || module}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tìm kiếm và thao tác hàng loạt */}
          <div className="flex items-center gap-3 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm quyền..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => handleSelectAll(selectedModule)} className="h-8 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              Chọn tất cả
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeselectAll(selectedModule)} className="h-8 text-xs">
              <XCircle className="h-3 w-3 mr-1" />
              Bỏ chọn tất cả
            </Button>
          </div>

          {/* Danh sách quyền */}
          <div className="max-h-[350px] overflow-y-auto space-y-2">
            {Object.entries(groupedPermissions).map(([module, modulePermissions]: any) => {
              const ModuleIcon = moduleIcons[module as keyof typeof moduleIcons] || FileText;

              return (
                <Card key={module} className="border-0 shadow-sm">
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      {/* Lấy icon từ modulePermissions[0]?.icon hoặc module (nếu có) */}
                      {(() => {
                        const iconName = modulePermissions[0]?.icon || module;
                        const IconComponent = iconMap[iconName] || FileText;
                        return <IconComponent className="h-4 w-4" />;
                      })()}
                      {moduleDisplayNames[module] || module}
                      <Badge className={`text-xs ${moduleColors[module as keyof typeof moduleColors] || 'bg-gray-100 text-gray-800'}`}>
                        {modulePermissions.length} quyền
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 px-4 pb-3">
                    {modulePermissions.map((permission: any) => (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <Label className="font-medium text-sm truncate">{permission.name}</Label>
                            <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                              {permission.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-1">{permission.description}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-2">
                          {permission.granted && <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />}
                          <Switch
                            checked={permission.granted}
                            onCheckedChange={(checked) => handlePermissionToggle(permission.id, checked)}
                            className="scale-75"
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredPermissions.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Shield className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">Không tìm thấy quyền nào phù hợp</p>
            </div>
          )}
        </Tabs>

        {/* Cảnh báo */}
        {role.order === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2 flex items-start gap-2 mt-3">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-yellow-800">Lưu ý quan trọng</p>
              <p className="text-xs text-yellow-700">
                Đây là chức vụ cao nhất trong hệ thống. Hãy cân nhắc kỹ khi cấp quyền để đảm bảo an toàn.
              </p>
            </div>
          </div>
        )}

        <DialogFooter className="pt-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} size="sm">
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" size="sm">
            <Shield className="h-3 w-3 mr-1" />
            Lưu quyền hạn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

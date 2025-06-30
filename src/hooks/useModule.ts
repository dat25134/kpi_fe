import { useEffect, useState } from "react"
import { getPermissionModules } from "@/services/module"
import { PermissionModule } from "@/types/module"

export function useModules() {
  const [modules, setModules] = useState<PermissionModule[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    getPermissionModules()
      .then((data) => setModules(data))
      .catch((err) => setError(err?.message || "Lỗi tải module quyền"))
      .finally(() => setLoading(false))
  }, [])

  return { modules, loading, error }
} 
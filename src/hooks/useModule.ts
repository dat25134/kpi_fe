import { useEffect, useState } from "react"
import { getPermissionModules } from "@/services/module"
import { PermissionModule } from "@/types/module"
import useSWR from "swr"

export function useModules() {
  const { data, error, isLoading } = useSWR("modules", getPermissionModules)

  return {
    modules: data,
    isLoading,
    error
  }
} 
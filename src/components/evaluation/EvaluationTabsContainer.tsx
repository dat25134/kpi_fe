"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { EvaluationTabsContainerProps } from "@/types/evaluation"

export default function EvaluationTabsContainer({ 
  activeTab, 
  onTabChange, 
  children 
}: EvaluationTabsContainerProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="criteria">Tiêu chí đánh giá</TabsTrigger>
        <TabsTrigger value="workDescription">Bảng mô tả công việc</TabsTrigger>
        <TabsTrigger value="summary">Tổng hợp</TabsTrigger>
      </TabsList>
      {children}
    </Tabs>
  )
} 
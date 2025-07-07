"use client"

import { Button } from "@/components/ui/button"
import { Home, User } from "lucide-react"
import type { EvaluationSidebarProps } from "@/types/evaluation"

export default function EvaluationSidebar({ currentUserDepartment, activeTab, onTabChange }: EvaluationSidebarProps) {
  return (
    <div className="hidden md:block w-64 bg-gray-50 p-4 rounded-lg">
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-2">Cá nhân</h3>
        <Button 
          variant="ghost" 
          className={`w-full justify-start ${activeTab === 'personal' ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : ''}`}
          onClick={() => onTabChange('personal')}
        >
          <User className="h-4 w-4 mr-2" />
          Phiếu đánh giá cá nhân
        </Button>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-2">Đơn vị phụ trách</h3>
        <Button variant="ghost" className="w-full justify-start">
          <Home className="h-4 w-4 mr-2" />
          <span className="truncate" title={currentUserDepartment || "Phòng ban"}>
            {currentUserDepartment || "Phòng ban"}
          </span>
        </Button>
      </div>
    </div>
  )
} 
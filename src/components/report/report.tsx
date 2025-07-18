"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Building2,
  Crown,
  ClipboardList,
  TrendingUp,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  UserCheck,
  UserX,
  DollarSign,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Area,
  AreaChart,
  Pie,
} from "recharts"
import OverviewStats from "./OverviewStats"
import { useDepartmentsListSelect } from "@/hooks/useDepartments"
import DepartmentStats from "./DepartmentStats"
import PositionStats from "./PositionStats"
import TaskProgressChart from "./TaskProgressChart"
import KPITrendsChart from "./KPITrendsChart"
import TopPerformers from "./TopPerformers"
import AlertsNotifications from "./AlertsNotifications"
import DepartmentDistribution from "./DepartmentDistribution"
import MonthlyPerformance from "./MonthlyPerformance"
import RecentActivities from "./RecentActivities"

// Dữ liệu mẫu cho dashboard
const dashboardData = {
  overview: {
    totalEmployees: 26,
    activeEmployees: 24,
    inactiveEmployees: 2,
    averageSalary: 19500000,
    totalDepartments: 4,
    totalPositions: 5,
    activePositions: 5,
    totalTasks: 45,
    completedTasks: 18,
    ongoingTasks: 22,
    overdueTasks: 5,
  },
  departmentStats: [
    { name: "QTNT", employees: 8, completed: 12, ongoing: 8, overdue: 2, avgSalary: 18500000 },
    { name: "TCKT", employees: 5, completed: 4, ongoing: 6, overdue: 1, avgSalary: 21000000 },
    { name: "NS", employees: 4, completed: 2, ongoing: 4, overdue: 1, avgSalary: 19000000 },
    { name: "KD", employees: 6, completed: 0, ongoing: 4, overdue: 1, avgSalary: 20500000 },
  ],
  positionStats: [
    { name: "Trưởng phòng", count: 4, avgSalary: 26500000, permissions: 5 },
    { name: "Phó phòng", count: 2, avgSalary: 22000000, permissions: 3 },
    { name: "Chuyên viên", count: 12, avgSalary: 17500000, permissions: 2 },
    { name: "Nhân viên", count: 8, avgSalary: 15000000, permissions: 1 },
    { name: "Thực tập sinh", count: 0, avgSalary: 0, permissions: 0 },
  ],
  taskProgress: [
    { month: "T1", completed: 8, ongoing: 12, overdue: 2 },
    { month: "T2", completed: 12, ongoing: 15, overdue: 3 },
    { month: "T3", completed: 18, ongoing: 22, overdue: 5 },
  ],
  topPerformers: [
    { name: "Phạm Ngọc Vinh", department: "QTNT", completed: 8, score: 95, avatar: "PNV" },
    { name: "Trần Văn Nam", department: "TCKT", completed: 6, score: 88, avatar: "TVN" },
    { name: "Hoàng Thị Minh", department: "NS", completed: 5, score: 85, avatar: "HTM" },
    { name: "Phan Vinh Khang", department: "QTNT", completed: 7, score: 82, avatar: "PVK" },
  ],
  kpiTrends: [
    { month: "T1", target: 100, achieved: 85, efficiency: 85 },
    { month: "T2", target: 100, achieved: 92, efficiency: 92 },
    { month: "T3", target: 100, achieved: 78, efficiency: 78 },
  ],
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]

export default function Reports() {
  const [timeFilter, setTimeFilter] = useState("month")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const { data: departmentsList, isLoading: loadingDepartments } = useDepartmentsListSelect();

  const { overview, departmentStats, positionStats, taskProgress, topPerformers, kpiTrends } = dashboardData

  // Tính toán tỷ lệ hoàn thành
  const completionRate = Math.round((overview.completedTasks / overview.totalTasks) * 100)
  const onTimeRate = Math.round(((overview.completedTasks + overview.ongoingTasks) / overview.totalTasks) * 100)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header với bộ lọc */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Thống kê</h1>
          <p className="text-gray-600">Tổng quan hiệu suất và KPI của tổ chức</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Chọn phòng ban" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả phòng ban</SelectItem>
              {loadingDepartments ? (
                <SelectItem value="loading" disabled>Đang tải...</SelectItem>
              ) : (
                departmentsList?.map((dept: any) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <OverviewStats timeFilter={timeFilter} departmentId={departmentFilter} />

      {/* Thống kê chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thống kê theo phòng ban */}
        <DepartmentStats timeFilter={timeFilter} />

        {/* Thống kê theo chức vụ */}
        <PositionStats timeFilter={timeFilter} />
      </div>

      {/* Biểu đồ và thống kê nâng cao */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tiến độ công việc */}
        <TaskProgressChart timeFilter={timeFilter} departmentId={departmentFilter} />

        {/* Block xu hướng KPI */}
        <KPITrendsChart departmentId={departmentFilter} />
      </div>

      {/* Top performers và cảnh báo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performers */}
        <TopPerformers departmentId={departmentFilter} />

        {/* Block cảnh báo và thông báo */}
        <AlertsNotifications departmentId={departmentFilter} />
      </div>

      {/* Thống kê bổ sung */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Block phân bố theo phòng ban */}
        <DepartmentDistribution departmentId={departmentFilter} />

        {/* Block hiệu suất tháng */}
        <MonthlyPerformance departmentId={departmentFilter} month={timeFilter} />

        {/* Block hoạt động gần đây */}
        <RecentActivities departmentId={departmentFilter} timeFilter={timeFilter} />
      </div>
    </div>
  )
}

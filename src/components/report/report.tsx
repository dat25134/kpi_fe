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
              <SelectItem value="QTNT">QTNT</SelectItem>
              <SelectItem value="TCKT">TCKT</SelectItem>
              <SelectItem value="NS">NS</SelectItem>
              <SelectItem value="KD">KD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng nhân viên</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalEmployees}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <UserCheck className="h-3 w-3 mr-1 text-green-600" />
              {overview.activeEmployees} hoạt động
              <UserX className="h-3 w-3 ml-2 mr-1 text-red-600" />
              {overview.inactiveEmployees} tạm nghỉ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lương trung bình</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(overview.averageSalary / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">VNĐ/tháng</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng công việc</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalTasks}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
              {overview.completedTasks} hoàn thành
              <Clock className="h-3 w-3 ml-2 mr-1 text-blue-600" />
              {overview.ongoingTasks} đang làm
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ hoàn thành</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <Progress value={completionRate} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">{overview.overdueTasks} công việc quá hạn</p>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê chi tiết */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thống kê theo phòng ban */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2" />
              Thống kê theo phòng ban
            </CardTitle>
            <CardDescription>Hiệu suất và nhân sự theo từng phòng ban</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept, index) => (
                <div key={dept.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-900">{dept.name}</span>
                    </div>
                    <div>
                      <div className="font-medium">{dept.name}</div>
                      <div className="text-sm text-gray-500">{dept.employees} nhân viên</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-green-700 bg-green-50">
                        {dept.completed} hoàn thành
                      </Badge>
                      <Badge variant="outline" className="text-blue-700 bg-blue-50">
                        {dept.ongoing} đang làm
                      </Badge>
                      {dept.overdue > 0 && (
                        <Badge variant="outline" className="text-red-700 bg-red-50">
                          {dept.overdue} quá hạn
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">TB: {(dept.avgSalary / 1000000).toFixed(1)}M VNĐ</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Thống kê theo chức vụ */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2" />
              Thống kê theo chức vụ
            </CardTitle>
            <CardDescription>Phân bố nhân sự và quyền hạn theo chức vụ</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {positionStats
                .filter((pos) => pos.count > 0)
                .map((pos, index) => (
                  <div key={pos.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Crown
                        className={`h-5 w-5 ${
                          index === 0
                            ? "text-yellow-500"
                            : index === 1
                              ? "text-gray-400"
                              : index === 2
                                ? "text-orange-500"
                                : "text-gray-300"
                        }`}
                      />
                      <div>
                        <div className="font-medium">{pos.name}</div>
                        <div className="text-sm text-gray-500">{pos.count} người</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{(pos.avgSalary / 1000000).toFixed(1)}M VNĐ</div>
                      <div className="text-xs text-gray-500">{pos.permissions} quyền hạn</div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ và thống kê nâng cao */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tiến độ công việc */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Tiến độ công việc theo tháng
            </CardTitle>
            <CardDescription>Thống kê hoàn thành công việc 3 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={taskProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="#10B981" name="Hoàn thành" />
                <Bar dataKey="ongoing" fill="#3B82F6" name="Đang làm" />
                <Bar dataKey="overdue" fill="#EF4444" name="Quá hạn" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Xu hướng KPI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Xu hướng KPI
            </CardTitle>
            <CardDescription>Hiệu suất đạt được so với mục tiêu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={kpiTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="target" stackId="1" stroke="#94A3B8" fill="#94A3B8" name="Mục tiêu" />
                <Area type="monotone" dataKey="achieved" stackId="2" stroke="#10B981" fill="#10B981" name="Đạt được" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top performers và cảnh báo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="h-5 w-5 mr-2" />
              Nhân viên xuất sắc
            </CardTitle>
            <CardDescription>Top 4 nhân viên có hiệu suất cao nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={performer.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-100 text-blue-900">{performer.avatar}</AvatarFallback>
                      </Avatar>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">👑</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{performer.name}</div>
                      <div className="text-sm text-gray-500">{performer.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{performer.completed} công việc</div>
                    <div className="text-sm text-green-600">{performer.score} điểm</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Cảnh báo và thông báo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Cảnh báo và thông báo
            </CardTitle>
            <CardDescription>Các vấn đề cần chú ý</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <div className="font-medium text-red-900">Công việc quá hạn</div>
                  <div className="text-sm text-red-700">
                    {overview.overdueTasks} công việc đã quá hạn cần xử lý ngay
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-900">Sắp đến hạn</div>
                  <div className="text-sm text-yellow-700">8 công việc sẽ đến hạn trong tuần này</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-900">Nhân sự mới</div>
                  <div className="text-sm text-blue-700">2 nhân viên mới cần được phân công công việc</div>
                </div>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900">Mục tiêu đạt được</div>
                  <div className="text-sm text-green-700">Phòng QTNT đã hoàn thành 120% mục tiêu tháng</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê bổ sung */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Phân bố theo phòng ban</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <Pie
                  data={departmentStats}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="employees"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {departmentStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hiệu suất tháng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Hoàn thành đúng hạn</span>
              <span className="font-medium">{onTimeRate}%</span>
            </div>
            <Progress value={onTimeRate} />

            <div className="flex justify-between items-center">
              <span className="text-sm">Chất lượng công việc</span>
              <span className="font-medium">87%</span>
            </div>
            <Progress value={87} />

            <div className="flex justify-between items-center">
              <span className="text-sm">Mức độ hài lòng</span>
              <span className="font-medium">92%</span>
            </div>
            <Progress value={92} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Hoạt động gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Phạm Ngọc Vinh hoàn thành "Cập nhật hệ thống"</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Thêm 2 nhân viên mới vào phòng TCKT</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Công việc "Báo cáo tháng 3" sắp đến hạn</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Cập nhật quyền hạn cho chức vụ Chuyên viên</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

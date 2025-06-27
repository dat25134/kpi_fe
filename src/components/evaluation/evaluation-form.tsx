"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Home, RefreshCw, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

// Dữ liệu mẫu
const evaluations = [
  {
    month: "Tháng 4/2025",
    count: 1,
    items: [
      {
        id: 1,
        name: "Phan Vinh Khang",
        avatar: "PVK",
        role: "Chuyên viên",
        period: "4/2025",
        status: "CHỜ TỰ ĐÁNH GIÁ",
        statusType: "waiting",
      },
    ],
  },
  {
    month: "Tháng 3/2025",
    count: 4,
    items: [
      {
        id: 1,
        name: "Lê Hữu Lợi",
        avatar: "LHL",
        role: "Chuyên viên",
        period: "3/2025",
        status: "CHỜ TỰ ĐÁNH GIÁ",
        statusType: "waiting",
      },
      {
        id: 2,
        name: "Đặng Trần Như Hảo",
        avatar: "ĐTNH",
        role: "Chuyên viên",
        period: "3/2025",
        status: "CHỜ TỰ ĐÁNH GIÁ",
        statusType: "waiting",
      },
      {
        id: 3,
        name: "Phan Vinh Khang",
        avatar: "PVK",
        role: "Chuyên viên",
        period: "3/2025",
        status: "CHỜ ĐÁNH GIÁ CẤP 1",
        statusType: "review1",
      },
      {
        id: 4,
        name: "Đàm Hải Đăng",
        avatar: "ĐHĐ",
        role: "Chuyên viên",
        period: "3/2025",
        status: "CHỜ TỰ ĐÁNH GIÁ",
        statusType: "waiting",
      },
    ],
  },
  {
    month: "Tháng 11/2024",
    count: 6,
    items: [
      {
        id: 1,
        name: "Phan Vinh Khang",
        avatar: "PVK",
        role: "Chuyên viên",
        period: "11/2024",
        status: "CHỜ ĐÁNH GIÁ CẤP 1",
        statusType: "review1",
      },
      {
        id: 2,
        name: "Võ Đức Mạnh",
        avatar: "VĐM",
        role: "Chuyên viên",
        period: "11/2024",
        status: "CHỜ ĐÁNH GIÁ CẤP 1",
        statusType: "review1",
      },
      {
        id: 3,
        name: "Đoàn Văn Lam Sơn",
        avatar: "ĐVLS",
        role: "Chuyên viên",
        period: "11/2024",
        status: "CHỜ ĐÁNH GIÁ CẤP 2",
        statusType: "review2",
      },
      {
        id: 4,
        name: "Lê Hữu Lợi",
        avatar: "LHL",
        role: "Chuyên viên",
        period: "11/2024",
        status: "CHỜ ĐÁNH GIÁ CẤP 2",
        statusType: "review2",
      },
      {
        id: 5,
        name: "Đặng Trần Như Hảo",
        avatar: "ĐTNH",
        role: "Chuyên viên",
        period: "11/2024",
        status: "CHỜ ĐÁNH GIÁ CẤP 2",
        statusType: "review2",
      },
      {
        id: 6,
        name: "Đàm Hải Đăng",
        avatar: "ĐHĐ",
        role: "Chuyên viên",
        period: "11/2024",
        status: "CHỜ ĐÁNH GIÁ CẤP 1",
        statusType: "review1",
      },
    ],
  },
]

export default function EvaluationForm() {
  const [activeTab, setActiveTab] = useState("personal")

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
        </Button>
        <h2 className="text-lg font-medium">Đơn vị hiện tại</h2>
      </div>

      <div className="flex">
        <div className="w-64 bg-gray-50 p-4 rounded-l-lg">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 mb-2">Cá nhân</h3>
            <Button variant="ghost" className="w-full justify-start text-blue-600 bg-blue-50 hover:bg-blue-100">
              <User className="h-4 w-4 mr-2" />
              Phiếu đánh giá cá nhân
            </Button>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Đơn vị phụ trách</h3>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="h-4 w-4 mr-2" />
              <span className="truncate" title="Phòng Quản trị nền tảng số và VTTT">Phòng Quản trị nền tảng số và VTTT</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 border rounded-r-lg">
          <Tabs defaultValue="personal" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="border-b w-full justify-start rounded-none h-auto p-0">
              <TabsTrigger
                value="personal"
                className={cn(
                  "rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4",
                  activeTab === "personal" ? "text-blue-600" : "",
                )}
              >
                Cá nhân
              </TabsTrigger>
              <TabsTrigger
                value="specialist"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4"
              >
                Chuyên viên
              </TabsTrigger>
              <TabsTrigger
                value="department"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4"
              >
                Phó phòng
              </TabsTrigger>
              <TabsTrigger
                value="manager"
                className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none py-2 px-4"
              >
                Trưởng phòng
              </TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="p-0 m-0">
              <div className="flex justify-end p-2 border-b">
                <Button size="sm" variant="ghost">
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16 text-center">STT</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Loại phiếu</TableHead>
                    <TableHead className="w-28">Thời gian</TableHead>
                    <TableHead className="w-40">Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {evaluations.map((group, groupIndex) => (
                    <>
                      <TableRow key={`group-${groupIndex}`} className="bg-gray-50">
                        <TableCell colSpan={5} className="font-medium">
                          {group.month} ({group.count} phiếu)
                        </TableCell>
                      </TableRow>
                      {group.items.map((item, itemIndex) => (
                        <TableRow key={`item-${groupIndex}-${itemIndex}`}>
                          <TableCell className="text-center">{item.id}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarFallback className="bg-gray-200 text-gray-600 text-xs">
                                  {item.avatar}
                                </AvatarFallback>
                              </Avatar>
                              {item.name}
                            </div>
                          </TableCell>
                          <TableCell>{item.role}</TableCell>
                          <TableCell>{item.period}</TableCell>
                          <TableCell>
                            <Badge
                              className={cn(
                                "font-normal",
                                item.statusType === "waiting"
                                  ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                                  : item.statusType === "review1"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : "bg-purple-100 text-purple-800 hover:bg-purple-100",
                              )}
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-between items-center p-4 text-sm">
                <div>1-3 trên 3 phiếu</div>
                <div className="flex items-center">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    1
                  </Button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="specialist">
              <div className="p-8 text-center text-gray-500">Không có phiếu đánh giá chuyên viên</div>
            </TabsContent>
            <TabsContent value="department">
              <div className="p-8 text-center text-gray-500">Không có phiếu đánh giá phó phòng</div>
            </TabsContent>
            <TabsContent value="manager">
              <div className="p-8 text-center text-gray-500">Không có phiếu đánh giá trưởng phòng</div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Công ty cổ phần Thăng Long</p>
      </div>
    </div>
  )
}

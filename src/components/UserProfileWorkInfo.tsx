import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface UserProfileWorkInfoProps {
  userProfile: any;
}

export default function UserProfileWorkInfo({ userProfile }: UserProfileWorkInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          Thông tin công việc
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Chức vụ:</span>
              <Badge variant="default">{userProfile?.position}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Phòng ban:</span>
              <span className="text-sm font-medium">{userProfile?.department?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Mã phòng:</span>
              <Badge variant="outline">{userProfile?.department?.code}</Badge>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Trạng thái:</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đang làm việc</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Kinh nghiệm:</span>
              <span className="text-sm font-medium">{userProfile?.experience}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import React from "react";

interface UserProfileDetailInfoProps {
  userProfile: any;
}

export default function UserProfileDetailInfo({ userProfile }: UserProfileDetailInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Ngày sinh:</span>
          <span className="text-sm font-medium">{userProfile?.birthDate}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Giới tính:</span>
          <span className="text-sm font-medium">{userProfile?.gender}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Ngày vào làm:</span>
          <span className="text-sm font-medium flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {userProfile?.joinDate}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Kinh nghiệm:</span>
          <span className="text-sm font-medium">{userProfile?.experience}</span>
        </div>
      </CardContent>
    </Card>
  );
} 
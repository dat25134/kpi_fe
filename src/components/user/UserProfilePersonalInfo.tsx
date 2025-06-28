import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, Mail, Phone, MapPin } from "lucide-react";
import React from "react";

interface UserProfilePersonalInfoProps {
  isEditing: boolean;
  formData: any;
  userProfile: any;
  handleInputChange: (field: string, value: string) => void;
}

export default function UserProfilePersonalInfo({
  isEditing,
  formData,
  userProfile,
  handleInputChange,
}: UserProfilePersonalInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Thông tin liên hệ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Họ và tên</Label>
          {isEditing ? (
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          ) : (
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{userProfile?.name}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          {isEditing ? (
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          ) : (
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{userProfile?.email}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Số điện thoại</Label>
          {isEditing ? (
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
          ) : (
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-sm">{userProfile?.phone}</span>
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ</Label>
          {isEditing ? (
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="min-h-[60px]"
            />
          ) : (
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
              <span className="text-sm">{userProfile?.address}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 
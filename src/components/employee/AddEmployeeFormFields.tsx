import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate, formatVietnamesePhoneNumber, formatVND } from "@/lib/utils";
import { AddEmployeeFormFieldsProps } from "@/types/employee";
import { DatePicker, ConfigProvider } from "antd";
import viVN from "antd/es/locale/vi_VN";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

export default function AddEmployeeFormFields({
  formData,
  errors,
  departments,
  roles,
  genders,
  editingEmployee,
  handleInputChange,
}: AddEmployeeFormFieldsProps) {

  return (
    <Tabs defaultValue="basic" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="basic">Thông tin cơ bản</TabsTrigger>
        <TabsTrigger value="detail">Chi tiết</TabsTrigger>
      </TabsList>

      <TabsContent value="basic" className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Họ và tên *</Label>
            <Input
              id="name"
              placeholder="Nhập họ và tên"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
            <div className="min-h-[1.25rem]">
              {errors.name && <p className="text-sm text-red-500">{errors.name[0]}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled={!!editingEmployee}
            />
            <div className="min-h-[1.25rem]">
              {errors.email && <p className="text-sm text-red-500">{errors.email[0]}</p>}
            </div>
          </div>

          {/* CCCD */}
          <div className="space-y-2">
            <Label htmlFor="cccd">Căn cước công dân</Label>
            <Input
              id="cccd"
              placeholder="Nhập số CCCD"
              value={formData.cccd}
              onChange={(e) => handleInputChange("cccd", e.target.value)}
            />
            <div className="min-h-[1.25rem]">
              {errors.cccd && <p className="text-sm text-red-500">{errors.cccd[0]}</p>}
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              placeholder="Nhập số điện thoại"
              value={formData.phone}
              onChange={(e) => {
                const formatted = formatVietnamesePhoneNumber(e.target.value);
                handleInputChange("phone", formatted);
              }}
              required
              maxLength={13}
            />
            <div className="min-h-[1.25rem]">
              {errors.phone && <p className="text-sm text-red-500">{errors.phone[0]}</p>}
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Giới tính</Label>
            <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn giới tính" />
              </SelectTrigger>
              <SelectContent>
                {genders.map((gender: any) => (
                  <SelectItem key={gender.key} value={gender.key}>
                    {gender.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="min-h-[1.25rem]">
              {errors.gender && <p className="text-sm text-red-500">{errors.gender[0]}</p>}
            </div>
          </div>

          {/* BirthDate - moved from detail tab */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">Ngày sinh</Label>
            <ConfigProvider locale={viVN}>
            <DatePicker
              id="birthDate"
              value={formData.birthDate ? dayjs(formData.birthDate) : null}
              onChange={(date) => handleInputChange("birthDate", date ? date.format("YYYY-MM-DD") : "")}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
              className="w-full"
              required
            />
            </ConfigProvider>
            <div className="min-h-[1.25rem]">
              {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate[0]}</p>}
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Phòng ban *</Label>
            <Select
              value={formData.departmentId}
              onValueChange={(value) => handleInputChange("departmentId", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Danh sách phòng ban</SelectLabel>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="min-h-[1.25rem]">
              {errors.departmentId && <p className="text-sm text-red-500">{errors.departmentId[0]}</p>}
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">Chức vụ *</Label>
            <Select
              value={formData.roleName}
              onValueChange={(value) => handleInputChange("roleName", value)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Danh sách chức vụ</SelectLabel>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.displayName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <div className="min-h-[1.25rem]">
              {errors.roleName && <p className="text-sm text-red-500">{errors.roleName[0]}</p>}
            </div>
          </div>

          {/* Join Date */}
          <div className="space-y-2">
            <Label htmlFor="joinDate">Ngày vào làm *</Label>
            <ConfigProvider locale={viVN}>
              <DatePicker
                id="joinDate"
                value={formData.joinDate ? dayjs(formData.joinDate) : null}
                onChange={(date) => handleInputChange("joinDate", date ? date.format("YYYY-MM-DD") : "")}
                format="DD/MM/YYYY"
                placeholder="Chọn ngày vào làm"
                className="w-full"
                required
              />
            </ConfigProvider>
            <div className="min-h-[1.25rem]">
              {errors.joinDate && <p className="text-sm text-red-500">{errors.joinDate[0]}</p>}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Trạng thái</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Đang làm việc</SelectItem>
                <SelectItem value="inactive">Tạm nghỉ</SelectItem>
              </SelectContent>
            </Select>
            <div className="min-h-[1.25rem]">
              {errors.status && <p className="text-sm text-red-500">{errors.status[0]}</p>}
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="detail" className="space-y-4 pt-4">
        <div className="grid gap-2">
          <Label htmlFor="address">Địa chỉ</Label>
          <Textarea
            id="address"
            placeholder="Nhập địa chỉ"
            value={formData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            className="min-h-[60px] resize-none"
          />
          {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address[0]}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="education">Trình độ học vấn</Label>
          <Input
            id="education"
            placeholder="VD: Cử nhân Công nghệ thông tin"
            value={formData.education}
            onChange={(e) => handleInputChange("education", e.target.value)}
          />
          {errors.education && <p className="text-sm text-red-500 mt-1">{errors.education[0]}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="experience">Kinh nghiệm</Label>
          <Input
            id="experience"
            placeholder="VD: 5 năm"
            value={formData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
          />
          {errors.experience && <p className="text-sm text-red-500 mt-1">{errors.experience[0]}</p>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="skills">Kỹ năng</Label>
          <Textarea
            id="skills"
            placeholder="Nhập các kỹ năng, cách nhau bởi dấu phẩy"
            value={formData.skills}
            onChange={(e) => handleInputChange("skills", e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <p className="text-xs text-gray-500">VD: JavaScript, React, Node.js, Python</p>
          {errors.skills && <p className="text-sm text-red-500 mt-1">{errors.skills[0]}</p>}
        </div>
      </TabsContent>
    </Tabs>
  );
} 
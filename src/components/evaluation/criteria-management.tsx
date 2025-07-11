"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit, Plus, Settings, Trash2 } from "lucide-react";
import { EvaluationCriteriaCategory } from "@/types/evaluation";
import { useCategoryWithCriteria } from "@/hooks/useCriteria";
import { useRolesSelection } from "@/hooks/useRole";
import { toast } from "sonner";
import AddCategoryModal from "@/components/evaluation/add-category-modal";

const CriteriaManagement: React.FC = () => {
  const { data: roleData, isLoading: roleLoading, error: roleError } = useRolesSelection();
  const [roleId, setRoleId] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  // Lấy dữ liệu từ hook
  const { data, isLoading, isError } = useCategoryWithCriteria({ role_id: roleId, search });

  React.useEffect(() => {
    if (isError) {
      toast.error("Lỗi tải dữ liệu tiêu chí. Vui lòng thử lại.");
    }
  }, [isError]);

  // Tổng số tiêu chí và tổng điểm tối đa
  const totalCriteria = data.reduce(
    (sum: number, cat: EvaluationCriteriaCategory) => sum + cat.evaluation_criteria.length,
    0
  );
  const totalMaxScore = data.reduce(
    (sum: number, cat: EvaluationCriteriaCategory) =>
      sum + cat.evaluation_criteria.reduce((s, c) => s + parseFloat(c.max_score), 0),
    0
  );

  // Xử lý tìm kiếm
  const handleSearch = () => {
    setSearch(searchInput);
  };

  const handleRoleChange = (value: string) => {
    setRoleId(value);
    setSearchInput("");
    setSearch("");
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý tiêu chí đánh giá
          </h1>
          <p className="text-gray-600">
            Quản lý thông tin các tiêu chí đánh giá cho các vai trò
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Vai trò:</label>
            <Select value={roleId} onValueChange={handleRoleChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                {roleData?.map((role: any) => (
                  <SelectItem key={role.id} value={role.id.toString()}>
                    {role.displayName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tìm kiếm:</label>
            <div className="flex gap-2">
              <Input
                placeholder="Nhập từ khóa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-64"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button onClick={handleSearch} className="bg-blue-600 text-white">
                <span className="hidden md:inline">Tìm kiếm</span>
              </Button>
            </div>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <span className="text-sm">
              Tổng: <b>{totalCriteria}</b> tiêu chí
            </span>
            <span className="text-sm">
              Điểm tối đa: <b>{totalMaxScore}</b>
            </span>
            <Button
              className="mt-2 bg-green-100 text-green-700 hover:bg-green-200 border border-green-400"
              size="sm"
              onClick={() => setShowAddCategory(true)}
            >
              <Plus className="w-4 h-4 mr-1" /> Tạo danh mục
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {roleId === "" ? (
            <div className="text-center text-gray-400 py-8">Vui lòng chọn vai trò</div>
          ) : isLoading ? (
            <div className="text-center text-gray-400 py-8">Đang tải dữ liệu...</div>
          ) : isError || data.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Không có danh mục tiêu chí phù hợp.
            </div>
          ) : (
            data.map((cat: EvaluationCriteriaCategory) => (
              <div key={cat.id} className="bg-white rounded shadow-sm p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-base mr-2">{cat.name}</span>
                  <span className="text-xs text-gray-500">
                    ({cat.evaluation_criteria.length} tiêu chí)
                  </span>
                  <span className="ml-4 text-xs text-blue-600">
                    Tối đa: {cat.evaluation_criteria.reduce((s, c) => s + parseFloat(c.max_score), 0)} điểm
                  </span>
                  <Button className="ml-auto bg-blue-600 text-white" size="sm">
                    <Plus className="w-4 h-4 mr-1" /> Tạo tiêu chí
                  </Button>
                  <Button variant="ghost" size="icon" className="ml-2">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {cat.evaluation_criteria.map((c) => (
                    <div
                      key={c.id}
                      className="bg-gray-50 rounded p-3 flex items-center"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">
                          #{c.order} {c.name}
                        </div>
                        <div className="text-xs text-gray-600 mb-1">
                          {c.description}
                        </div>
                        <div className="text-xs text-gray-500">
                          Điểm tối đa: {c.max_score} &nbsp;|&nbsp; Trọng số: {c.weight}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {cat.evaluation_criteria.length === 0 && (
                    <div className="text-xs text-gray-400 italic">
                      Chưa có tiêu chí nào
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <AddCategoryModal
        open={showAddCategory}
        onOpenChange={setShowAddCategory}
        roleId={roleId}
        search={search}
        onSuccess={() => {
          setShowAddCategory(false);
        }}
      />
    </div>
  );
};

export default CriteriaManagement;

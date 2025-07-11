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
import { fetchCategoryWithCriteria } from "@/services/evaluation";
import { EvaluationCriteriaCategory } from "@/types/evaluation";
import { useRolesSelection } from "@/hooks/useRole";
import { toast } from "sonner";
import AddCategoryModal from "@/components/evaluation/add-category-modal";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import DeleteCategoryModal from "@/components/evaluation/delete-category-modal";
import CreateCriteriaModal from "@/components/evaluation/create-criteria-modal";
import EditCriteriaModal from "@/components/evaluation/edit-criteria-modal";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";
import { useDeleteCriteria } from "@/hooks/useCriteria";

const CriteriaManagement: React.FC = () => {
  const { data: roleData, isLoading: roleLoading, error: roleError } = useRolesSelection();
  const [roleId, setRoleId] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<{ id: number; name: string } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState<{ id: number; name: string } | null>(null);
  const [showCreateCriteria, setShowCreateCriteria] = useState<{ categoryId: number } | null>(null);
  const [categoryList, setCategoryList] = useState<EvaluationCriteriaCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [editCriteria, setEditCriteria] = useState<any | null>(null);
  const [deleteCriteria, setDeleteCriteria] = useState<any | null>(null);
  const [showDeleteCriteriaModal, setShowDeleteCriteriaModal] = useState(false);
  const { trigger: deleteCriteriaTrigger, isMutating: isDeletingCriteria } = useDeleteCriteria();

  const fetchCategoryList = async () => {
    setIsLoading(true);
    setIsError(false);
    try {
      const res = await fetchCategoryWithCriteria({ role_id: roleId, search });
      setCategoryList(res.data || []);
    } catch (e) {
      setIsError(true);
      setCategoryList([]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (roleId) fetchCategoryList();
  }, [roleId, search]);

  React.useEffect(() => {
    if (isError) {
      toast.error("Lỗi tải dữ liệu tiêu chí. Vui lòng thử lại.");
    }
  }, [isError]);

  // Tổng số tiêu chí và tổng điểm tối đa
  const totalCriteria = categoryList.reduce(
    (sum: number, cat: EvaluationCriteriaCategory) => sum + cat.evaluation_criteria.length,
    0
  );
  const totalMaxScore = categoryList.reduce(
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

  const handleDeleteClick = (cat: { id: number; name: string }) => {
    setDeleteCategory(cat);
    setShowDeleteModal(true);
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
          ) : isError || categoryList.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Không có danh mục tiêu chí phù hợp.
            </div>
          ) : (
            categoryList.map((cat: EvaluationCriteriaCategory) => (
              <div key={cat.id} className="bg-white rounded shadow-sm p-4 border border-gray-200">
                <div className="flex flex md:flex-row md:items-center md:mb-2 gap-2 md:gap-0">
                  <div className="flex-1 flex flex-col md:flex-row md:items-center">
                    <span className="font-semibold text-base mr-2">{cat.name}</span>
                    <span className="text-xs text-gray-500 md:ml-2">
                      ({cat.evaluation_criteria.length} tiêu chí)
                    </span>
                    <span className="text-xs text-blue-600 md:ml-4">
                      Tối đa: {cat.evaluation_criteria.reduce((s, c) => s + parseFloat(c.max_score), 0)} điểm
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2 md:mt-0 md:ml-auto">
                    <Button className="bg-blue-600 text-white" size="sm" onClick={() => setShowCreateCriteria({ categoryId: cat.id })}>
                      <Plus className="w-4 h-4 mr-1" /> <span className="hidden sm:inline">Tạo tiêu chí</span>
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditCategory({ id: cat.id, name: cat.name })}>
                          <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick({ id: cat.id, name: cat.name })} className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" /> Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
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
                        onClick={() => setEditCriteria({ ...c, categoryId: cat.id, roleId })}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600"
                        onClick={() => { setDeleteCriteria({ ...c, categoryId: cat.id }); setShowDeleteCriteriaModal(true); }}
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
        isEdit={false}
        onSuccess={() => {
          setShowAddCategory(false);
          fetchCategoryList();
        }}
      />
      <AddCategoryModal
        key={editCategory?.id || 'edit'}
        open={!!editCategory}
        onOpenChange={(open) => { if (!open) setEditCategory(null); }}
        roleId={roleId}
        search={search}
        isEdit={true}
        category_id={editCategory?.id}
        category_name={editCategory?.name}
        onSuccess={() => {
          setEditCategory(null);
          fetchCategoryList();
        }}
      />
      <DeleteCategoryModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        categoryId={deleteCategory?.id}
        categoryName={deleteCategory?.name}
        roleId={roleId}
        search={search}
        onSuccess={() => {
          setShowDeleteModal(false);
          fetchCategoryList();
        }}
      />
      <CreateCriteriaModal
        open={!!showCreateCriteria}
        onOpenChange={(open) => { if (!open) setShowCreateCriteria(null); }}
        categoryId={showCreateCriteria?.categoryId || 0}
        roleId={Number(roleId)}
        search={search}
        onSuccess={() => {
          setShowCreateCriteria(null);
          fetchCategoryList();
        }}
      />
      <EditCriteriaModal
        open={!!editCriteria}
        onOpenChange={(open) => { if (!open) setEditCriteria(null); }}
        criteria={editCriteria}
        onSuccess={() => { setEditCriteria(null); fetchCategoryList(); }}
      />
      <ConfirmDeleteModal
        open={showDeleteCriteriaModal}
        onOpenChange={setShowDeleteCriteriaModal}
        title="Xác nhận xoá tiêu chí"
        description={`Bạn có chắc chắn muốn xoá tiêu chí "${deleteCriteria?.name}"?`}
        onConfirm={async () => {
          if (deleteCriteria?.id) {
            try {
              await deleteCriteriaTrigger({ id: deleteCriteria.id });
              toast.success("Xoá tiêu chí thành công!");
              setShowDeleteCriteriaModal(false);
              setDeleteCriteria(null);
              fetchCategoryList();
            } catch (e: any) {
              toast.error(e?.message || "Xoá thất bại");
            }
          }
        }}
      />
    </div>
  );
};

export default CriteriaManagement;

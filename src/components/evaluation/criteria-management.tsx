"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useCriteriaManagement } from "@/hooks/useCriteriaManagement";
import AddCategoryModal from "@/components/evaluation/add-category-modal";
import DeleteCategoryModal from "@/components/evaluation/delete-category-modal";
import CreateCriteriaModal from "@/components/evaluation/create-criteria-modal";
import EditCriteriaModal from "@/components/evaluation/edit-criteria-modal";
import ConfirmDeleteModal from "@/components/shared/confirm-delete-modal";
import CriteriaCategoryDisplay from "@/components/evaluation/CriteriaCategoryDisplay";

const CriteriaManagement: React.FC = () => {
  const {
    // State
    state,
    roleData,
    roleLoading,
    roleError,
    stats,
    isDeletingCriteria,
    
    // Handlers
    handleSearch,
    handleRoleChange,
    handleDeleteClick,
    handleShowAddCategory,
    handleCloseAddCategory,
    handleEditCategory,
    handleCloseEditCategory,
    handleCloseDeleteModal,
    handleShowCreateCriteria,
    handleCloseCreateCriteria,
    handleEditCriteria,
    handleCloseEditCriteria,
    handleDeleteCriteria,
    handleCloseDeleteCriteriaModal,
    handleConfirmDeleteCriteria,
    handleSuccess,
    
    // Input setters
    setSearchInput
  } = useCriteriaManagement();

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
            <Select value={state.roleId} onValueChange={handleRoleChange}>
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
                value={state.searchInput}
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
              Tổng: <b>{stats.totalCriteria}</b> tiêu chí
            </span>
            <span className="text-sm">
              Điểm tối đa: <b>{stats.totalMaxScore}</b>
            </span>
            <Button
              className="mt-2 bg-green-100 text-green-700 hover:bg-green-200 border border-green-400"
              size="sm"
              onClick={handleShowAddCategory}
            >
              <Plus className="w-4 h-4 mr-1" /> Tạo danh mục
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          {state.roleId === "" ? (
            <div className="text-center text-gray-400 py-8">Vui lòng chọn vai trò</div>
          ) : state.isLoading ? (
            <div className="text-center text-gray-400 py-8">Đang tải dữ liệu...</div>
          ) : state.isError || state.categoryList.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              Không có danh mục tiêu chí phù hợp.
            </div>
          ) : (
            state.categoryList.map((category) => (
              <CriteriaCategoryDisplay
                key={category.id}
                category={category}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteClick}
                onCreateCriteria={handleShowCreateCriteria}
                onEditCriteria={handleEditCriteria}
                onDeleteCriteria={handleDeleteCriteria}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Modals */}
      <AddCategoryModal
        open={state.showAddCategory}
        onOpenChange={handleCloseAddCategory}
        roleId={state.roleId}
        search={state.search}
        isEdit={false}
        onSuccess={handleSuccess}
      />
      <AddCategoryModal
        key={state.editCategory?.id || 'edit'}
        open={!!state.editCategory}
        onOpenChange={(open) => { if (!open) handleCloseEditCategory(); }}
        roleId={state.roleId}
        search={state.search}
        isEdit={true}
        category_id={state.editCategory?.id}
        category_name={state.editCategory?.name}
        onSuccess={handleSuccess}
      />
      <DeleteCategoryModal
        open={state.showDeleteModal}
        onOpenChange={handleCloseDeleteModal}
        categoryId={state.deleteCategory?.id}
        categoryName={state.deleteCategory?.name}
        roleId={state.roleId}
        search={state.search}
        onSuccess={handleSuccess}
      />
      <CreateCriteriaModal
        open={!!state.showCreateCriteria}
        onOpenChange={(open) => { if (!open) handleCloseCreateCriteria(); }}
        categoryId={state.showCreateCriteria?.categoryId || 0}
        roleId={Number(state.roleId)}
        search={state.search}
        onSuccess={handleSuccess}
      />
      <EditCriteriaModal
        open={!!state.editCriteria}
        onOpenChange={(open) => { if (!open) handleCloseEditCriteria(); }}
        criteria={state.editCriteria}
        onSuccess={handleSuccess}
      />
      <ConfirmDeleteModal
        open={state.showDeleteCriteriaModal}
        onOpenChange={handleCloseDeleteCriteriaModal}
        title="Xác nhận xoá tiêu chí"
        description={`Bạn có chắc chắn muốn xoá tiêu chí "${state.deleteCriteria?.name}"?`}
        onConfirm={handleConfirmDeleteCriteria}
      />
    </div>
  );
};

export default CriteriaManagement;

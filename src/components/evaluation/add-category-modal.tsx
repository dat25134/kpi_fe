import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateCategory, useUpdateCategoryCriteria } from "@/hooks/useCriteria";
import { toast } from "sonner";
import { mutate } from "swr";
import { getErrorMessage, getValidationErrors } from "@/services/errorHandler";

interface AddCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  roleId: string;
  search: string;
  isEdit?: boolean;
  category_id?: number;
  category_name?: string;
}

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ open, onOpenChange, onSuccess, roleId, search, isEdit, category_id, category_name }) => {
  const [name, setName] = useState(category_name || "");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { trigger, isMutating } = useCreateCategory();
  const { trigger: updateTrigger, isMutating: isUpdating } = useUpdateCategoryCriteria();

  const resetForm = () => {
    setName("");
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!name.trim()) {
      setErrors({ name: ["Vui lòng nhập tên danh mục"] });
      return;
    }
    try {
      if (isEdit && category_id) {
        await updateTrigger({ id: category_id, name });
        toast.success("Cập nhật danh mục thành công!");
      } else {
        await trigger({ name });
        toast.success("Tạo danh mục thành công!");
      }
      resetForm();
      onOpenChange(false);
      onSuccess && onSuccess();
    } catch (error: any) {
      const msg = getErrorMessage(error)
      setErrors(getValidationErrors(error) || { general: [msg] })
      toast.error(msg)
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader className="pb-2">
            <DialogTitle>{isEdit ? "Cập nhật danh mục" : "Tạo danh mục"}</DialogTitle>
          </DialogHeader>
          <div className="mb-2 p-2 bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs rounded">
            <b>Lưu ý:</b> Danh mục này sẽ áp dụng cho tất cả vai trò
          </div>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">Tên danh mục <span className="text-red-500">*</span></label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nhập tên danh mục"
                className={errors.name ? "border-red-300" : ""}
                autoFocus
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name[0]}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>Huỷ</Button>
            <Button type="submit" disabled={isMutating} className="bg-blue-600 text-white">
              {isMutating ? "Đang lưu..." : (isEdit ? "Cập nhật" : "Tạo danh mục")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategoryModal; 
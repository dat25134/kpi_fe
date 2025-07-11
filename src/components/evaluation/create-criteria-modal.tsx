import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCriteria } from "@/hooks/useCriteria";
import { toast } from "sonner";
import { mutate } from "swr";
import type { CreateCriteriaPayload } from "@/types/evaluation";

interface CreateCriteriaModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  categoryId: number;
  roleId: number;
  search: string;
}

const CreateCriteriaModal: React.FC<CreateCriteriaModalProps> = ({ open, onOpenChange, onSuccess, categoryId, roleId, search }) => {
  const [form, setForm] = useState<Partial<CreateCriteriaPayload>>({
    name: "",
    description: "",
    max_score: 1,
    is_active: true,
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const { trigger, isMutating } = useCreateCriteria();

  const resetForm = () => {
    setForm({ name: "", description: "", max_score: 1, is_active: true });
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleChange = (field: keyof CreateCriteriaPayload, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!form.name?.trim()) {
      setErrors({ name: ["Vui lòng nhập tên tiêu chí"] });
      return;
    }
    if (!form.max_score || isNaN(Number(form.max_score))) {
      setErrors({ max_score: ["Vui lòng nhập điểm tối đa hợp lệ"] });
      return;
    }
    try {
      await trigger({
        role_id: roleId,
        category_criteria_id: categoryId,
        name: form.name!,
        description: form.description || "",
        max_score: Number(form.max_score),
        is_active: !!form.is_active,
      });
      toast.success("Tạo tiêu chí thành công!");
      resetForm();
      onOpenChange(false);
      onSuccess && onSuccess();
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit} noValidate>
          <DialogHeader>
            <DialogTitle>Tạo tiêu chí mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Tên tiêu chí <span className="text-red-500">*</span></label>
              <Textarea
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Nhập tên tiêu chí"
                className={errors.name ? "border-red-300" : ""}
                autoFocus
                rows={2}
              />
              {errors.name && <p className="text-xs text-red-600">{errors.name[0]}</p>}
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Mô tả</label>
              <Input
                value={form.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Nhập mô tả (không bắt buộc)"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Điểm tối đa <span className="text-red-500">*</span></label>
                <Input
                  type="number"
                  min={0}
                  value={form.max_score}
                  onChange={(e) => handleChange("max_score", e.target.value)}
                  className={errors.max_score ? "border-red-300" : ""}
                />
                {errors.max_score && <p className="text-xs text-red-600">{errors.max_score[0]}</p>}
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => handleChange("is_active", e.target.checked)}
                  id="is_active"
                />
                <label htmlFor="is_active" className="text-sm">Kích hoạt</label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>Huỷ</Button>
            <Button type="submit" disabled={isMutating} className="bg-blue-600 text-white">
              {isMutating ? "Đang lưu..." : "Tạo tiêu chí"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCriteriaModal; 
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { useDeleteCategoryCriteria } from "@/hooks/useCriteria";
import { toast } from "sonner";
import { mutate } from "swr";
import { getErrorMessage } from "@/services/errorHandler";

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId?: number;
  categoryName?: string;
  roleId: string;
  search: string;
  onSuccess?: () => void;
}

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  open,
  onOpenChange,
  categoryId,
  categoryName,
  roleId,
  search,
  onSuccess,
}) => {
  const { trigger: deleteTrigger, isMutating } = useDeleteCategoryCriteria();

  const handleConfirm = async () => {
    if (!categoryId) return;
    try {
      await deleteTrigger({ id: categoryId });
      toast.success("Xóa danh mục thành công!");
      onOpenChange(false);
      onSuccess && onSuccess();
    } catch (error) {
      const message = getErrorMessage(error);
      toast.error(message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            Xóa danh mục
          </DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa danh mục "{categoryName}"?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isMutating}>
            {isMutating ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategoryModal; 
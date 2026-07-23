import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

const ConfirmDefaultAddressDialog = ({ open, onOpenChange, onConfirm, loading }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs text-center p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-base font-bold">Xác nhận</DialogTitle>
          <DialogDescription className="text-xs text-gray-600">
            Bạn có muốn đổi địa chỉ mặc định?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-center mt-4">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#004A7C] text-white hover:bg-[#003d66]"
          >
            {loading ? "Đang xử lý..." : "Đồng ý"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDefaultAddressDialog;
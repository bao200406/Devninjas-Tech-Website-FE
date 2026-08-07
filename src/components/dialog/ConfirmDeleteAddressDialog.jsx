import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

const ConfirmDeleteAddressDialog = ({ open, onOpenChange, onConfirm, loading }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white rounded-3xl shadow-2xl border border-gray-100 sm:max-w-sm p-6 text-center focus:outline-none">
        {/* Icon thùng rác màu đỏ với nền bo tròn nhạt */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500 mb-4">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-bold text-gray-900">Xóa địa chỉ?</DialogTitle>
          <DialogDescription className="text-sm text-gray-500 leading-relaxed px-2">
            Bạn có chắc chắn muốn xóa địa chỉ này không? Thao tác này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 justify-center mt-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 shadow-xs"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-xl text-sm font-semibold bg-red-600 text-white hover:bg-red-700 transition-all cursor-pointer shadow-md shadow-red-600/20 disabled:opacity-50"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteAddressDialog;
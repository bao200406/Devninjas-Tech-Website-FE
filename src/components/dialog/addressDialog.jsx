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
      <DialogContent className="bg-white rounded-2xl shadow-2xl border border-gray-100 sm:max-w-sm p-6 text-center focus:outline-none">
        {/* Icon định vị trực quan */}
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-[#004A7C] mb-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <DialogHeader className="space-y-1">
          <DialogTitle className="text-lg font-bold text-gray-900">Xác nhận đổi địa chỉ</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Bạn có chắc chắn muốn đặt địa chỉ này làm địa chỉ mặc định không?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex gap-3 justify-center mt-6">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all cursor-pointer disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-semibold bg-[#004A7C] text-white hover:bg-[#003d66] transition-all cursor-pointer shadow-md shadow-blue-900/10 disabled:opacity-50"
          >
            {loading ? "Đang xử lý..." : "Đồng ý"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDefaultAddressDialog;
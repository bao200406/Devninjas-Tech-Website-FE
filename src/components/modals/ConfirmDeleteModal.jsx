"use client";

import { Trash2 } from "lucide-react";

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl p-6 max-w-[400px] w-full mx-4 shadow-2xl border border-gray-100 text-center transform transition-all">
        {/* Icon cảnh báo */}
        <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} />
        </div>

        {/* Tiêu đề */}
        <h3 className="text-[18px] font-bold text-gray-900">
          {title || "Xác nhận xóa"}
        </h3>

        {/* Nội dung thông báo */}
        <p className="text-[14px] text-gray-500 mt-2">
          {message || "Bạn có chắc chắn muốn xóa sản phẩm này không? Thao tác này không thể hoàn tác."}
        </p>

        {/* Các nút bấm thao tác */}
        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition shadow-md cursor-pointer"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
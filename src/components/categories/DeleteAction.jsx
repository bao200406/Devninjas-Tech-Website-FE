"use client";
import { useState } from "react";
import { deleteCategory } from "../../services/categoryService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function DeleteAction({ categoryId, categoryName, onSave }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    // 1. Hiện bảng Confirm
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#004d4d",
      cancelButtonColor: "#1f2937",
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
      background: "#001a1a",
      color: "#22d3ee",
      backdrop: `rgba(0,77,77,0.4)`,
    });

    // 2. NẾU KHÔNG XÁC NHẬN -> DỪNG NGAY LẬP TỨC
    if (!result.isConfirmed) {
      return; // Dòng này cực kỳ quan trọng để "Hủy" hoạt động đúng
    }

    // 3. NẾU XÁC NHẬN -> MỚI CHẠY TIẾP XUỐNG DƯỚI (Không gọi lại handleDelete nữa)
    const toastId = toast.loading("Đang tiến hành xóa...");

    try {
      setLoading(true);
      await deleteCategory(categoryId);

      toast.update(toastId, {
        render: "Đã xóa danh mục thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      if (onSave) onSave();
    } catch (error) {
      toast.update(toastId, {
        render: "Xóa thất bại: " + (error.message || "Lỗi hệ thống"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className={`
        p-2 rounded-lg transition-all duration-200 group
        ${
          loading
            ? "bg-gray-800 cursor-not-allowed opacity-50"
            : "hover:bg-red-500/10 text-gray-400 hover:text-red-500"
        }
      `}
      title="Xóa danh mục"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 ${!loading && "group-hover:animate-bounce"}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
    </button>
  );
}

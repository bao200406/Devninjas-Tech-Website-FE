"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { deleteProduct } from "../../services/productService";
export default function DeleteAction({ id, setProducts }) {
  console.log(id);
  const handleDeleteClick = async (id) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa?",
      text: `Bạn có chắc muốn xóa sản phẩm ${id}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    Swal.close(); // QUAN TRỌNG

    const toastId = toast.loading("Đang xóa sản phẩm...");

    await new Promise((r) => setTimeout(r, 2000));

    try {
      await deleteProduct(id);

      setProducts((prev) => prev.filter((item) => item._id !== id));

      toast.update(toastId, {
        render: "Xóa sản phẩm thành công 🎉",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error) {
      console.log("Gọi API delete bị lỗi", error);

      toast.update(toastId, {
        render: "Xóa thất bại ❌",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  return (
    <>
      <button
        className="p-2 hover:bg-red-600 rounded-md transition-all text-admin-text-muted hover:text-white"
        onClick={() => handleDeleteClick(id)}
        title="Xóa"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
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
    </>
  );
}

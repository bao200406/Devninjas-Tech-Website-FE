"use client";

import { useEffect, useState } from "react";
import AddProductForm from "../products/AddProductForm";
import { X } from "lucide-react"; // Đảm bảo bạn có cài lucide-react

export default function AddProductButton({ title, data }) {
  console.log("data callback:", data);
  const [openForm, setOpenForm] = useState(false);
  

  const fetchProductsData = async () => {
    try {
      await data();
    } catch (error) {
      console.log("Lỗi khi fetch lại dữ liệu sau khi thêm mới:", error);
    }
  };

  // Xử lý đóng form khi click vào lớp nền mờ
  const handleBackdropClick = (e) => {
    if (e.target.id === "modal-backdrop") {
      setOpenForm(false);
    }
  };

  // Xử lý phím ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpenForm(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Chặn cuộn trang khi đang mở form
  useEffect(() => {
    if (openForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [openForm]);

  return (
    <>
      {/* NÚT BẤM MỞ FORM */}
      <button
        onClick={() => setOpenForm(true)}
        className="btn-accent shadow-[0_0_20px_rgba(34,211,238,0.3)] px-6 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <span className="text-xl">+</span>
        {title}
      </button>

      {/* MODAL OVERLAY */}
      {openForm && (
        <div
          id="modal-backdrop"
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
        >
          {/* CONTAINER FORM */}
          <div
            className="relative w-full max-w-6xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()} // Ngăn click bên trong form bị đóng
          >
            {/* NÚT X ĐÓNG NHANH */}
            <button
              onClick={() => setOpenForm(false)}
              className="absolute -top-12 right-0 p-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
            >
              <span>Đóng (Esc)</span>
              <X size={20} />
            </button>

            {/* NỘI DUNG FORM - Truyền props setOpenForm nếu muốn đóng từ bên trong form */}
            <AddProductForm
              onClose={() => setOpenForm(false)}
              onSave={fetchProductsData}
            />
          </div>
        </div>
      )}
    </>
  );
}

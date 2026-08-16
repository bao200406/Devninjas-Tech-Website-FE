"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { editCategory, getCategoryById } from "../../services/categoryService";
import { toast } from "react-toastify";

export default function EditModalCategories({ isOpen, onClose, onSave, id }) {
  const [activeTab, setActiveTab] = useState("general"); // Tab logic
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null); // 2. Thêm state preview
  const fileInputRef = useRef(null); // 3. Thêm ref cho input file

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
    image: null,
  });

  useEffect(() => {
    const loadData = async () => {
      if (isOpen && id) {
        try {
          const categoryData = await getCategoryById(id);
          if (categoryData) {
            setFormData({
              name: categoryData.name,
              description: categoryData.description || "",
              status: categoryData.status,
              image: null,
            });
            // Set preview từ ảnh cũ
            setImagePreview(
              `https://devninjas-tech-website-be-1.onrender.com/uploads/categories/${categoryData.image}`,
            );
          }
        } catch (err) {
          // Nếu hàm service throw error, nó sẽ nhảy xuống đây
          alert("Không thể tải dữ liệu danh mục!");
        }
      }
    };
    loadData();
  }, [isOpen, id]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => {
        setActiveTab("general");
      }, 0);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "unset";

      // Clear data khi đóng modal
      const setTimer = setTimeout(() => {
        setFormData({
          name: "",
          description: "",
          status: "Active",
          image: null,
        });
        setImagePreview(null);
      }, 0);

      return () => clearTimeout(setTimer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate TRƯỚC khi hiện Toast Loading
    if (!formData.name.trim()) {
      setActiveTab("general");
      // Thay alert bằng toast.error cho đồng bộ
      toast.error("Tên danh mục không được để trống.");
      return;
    }

    // 2. Bắt đầu hiện Loading Toast
    const toastId = toast.loading("Đang xử lý dữ liệu...");

    try {
      setLoading(true);
      // 4. SỬ DỤNG FORMDATA ĐỂ GỬI FILE

      // Thêm dòng này để ép nó chờ 2 giây rồi mới chạy tiếp
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("description", formData.description);
      dataToSend.append("status", formData.status);

      if (formData.image) {
        dataToSend.append("image", formData.image);
      }

      await editCategory(id, dataToSend);

      // 3. Cập nhật Toast cũ thành Success (Đừng gọi thêm toast.success mới)
      toast.update(toastId, {
        render: "sửa danh mục thành công! 🎉",
        type: "success",
        isLoading: false, // Quan trọng: Tắt icon xoay xoay
        autoClose: 3000, // Thanh progress bắt đầu chạy từ đây
      });

      if (onSave) onSave();
      onClose();
    } catch (error) {
      // 4. Cập nhật Toast cũ thành Error
      toast.update(toastId, {
        render: "Thất bại: " + (error.message || "Đã có lỗi xảy ra"),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Overlay - Kính mờ */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-[560px] max-h-[90vh] flex flex-col bg-[#1a1d26] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header - Giống 100% form Add */}
        <div className="p-8 pb-4 flex justify-between items-start shrink-0">
          <div>
            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-black rounded-md uppercase tracking-widest mb-2 inline-block">
              Chế độ chỉnh sửa
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">
              Sửa Danh mục
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Cập nhật lại thông tin hiển thị cho danh mục này.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* Tab Navigation - Layout Premium */}
        <div className="px-8 pb-4 shrink-0">
          <div className="flex bg-[#242834]/50 p-1 rounded-2xl w-fit border border-white/5">
            <button
              type="button"
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "general"
                  ? "bg-[#2d3241] text-cyan-400 shadow-lg"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Thông tin chung
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("image")}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === "image"
                  ? "bg-[#2d3241] text-cyan-400 shadow-lg"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Hình ảnh
            </button>
          </div>
        </div>
        {/* FORM BỌC NGOÀI CẢ BODY VÀ FOOTER */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col overflow-hidden max-h-full"
        >
          {/* Form Body - Tối ưu Scroll */}
          <div className="flex-1 overflow-y-auto px-8 py-4 space-y-6 custom-scrollbar text-white">
            {activeTab === "general" ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                {/* Tên danh mục */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Tên Danh Mục
                  </label>
                  <input
                    type="text"
                    placeholder="Điện thoại & Tablet"
                    className="w-full bg-[#242834] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all shadow-inner placeholder:text-gray-600"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 ml-1">
                    Mô tả chi tiết
                  </label>
                  <textarea
                    rows="4"
                    placeholder="Nhập nội dung mô tả..."
                    className="w-full bg-[#242834] border border-white/5 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all resize-none shadow-inner"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Trạng thái - Layout bo cong */}
                <div className="bg-[#242834]/50 border border-white/5 p-4 rounded-[1.8rem] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-cyan-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[13px] font-bold">
                        Trạng thái hiển thị
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Chuyển đổi trạng thái hoạt động
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer scale-90">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={formData.status === "Active"}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.checked ? "Active" : "Inactive",
                        })
                      }
                    />
                    <div className="w-12 h-6 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                  </label>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-6 duration-500 ease-in-out h-full flex flex-col justify-center">
                {/* Tab Hình ảnh - Cải tiến để chọn file */}
                <div
                  onClick={() => fileInputRef.current?.click()} // Kích hoạt sự kiện chọn file
                  className="relative border-2 border-dashed border-white/10 bg-[#242834]/30 rounded-[2rem] p-12 flex flex-col items-center justify-center group hover:border-cyan-500/40 transition-all cursor-pointer overflow-hidden min-h-[280px]"
                >
                  {/* Input file ẩn */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, image: file }); // Lưu file thật để gửi backend
                        setImagePreview(URL.createObjectURL(file)); // Lưu link tạm để hiển thị preview
                      }
                    }}
                  />

                  {/* Hiển thị ảnh Preview nếu đã chọn ảnh */}
                  {imagePreview ? (
                    <div className="absolute inset-0 w-full h-full p-4 animate-in fade-in zoom-in-95 duration-300">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain rounded-[1.5rem]"
                      />
                      {/* Nút xóa ảnh nhanh */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setFormData({ ...formData, image: null });
                        }}
                        className="absolute top-6 right-6 p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white rounded-full transition-all backdrop-blur-md"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    /* Giao diện khi chưa chọn ảnh */
                    <>
                      <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-cyan-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-white text-center">
                        Kéo thả hoặc nhấn để tải lên
                      </p>
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        Hỗ trợ PNG, JPG, WebP (Tối đa 5MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer - Nằm bên trong Form để Submit hoạt động */}
          <div className="p-8 pt-4 flex justify-end items-center gap-6 shrink-0 bg-[#1a1d26] border-t border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="text-sm font-bold text-gray-500 hover:text-white transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`
                  relative flex items-center justify-center gap-3 px-8 py-3 
                  font-bold rounded-xl text-sm transition-all duration-300
                  ${
                    loading
                      ? "bg-gray-700 text-gray-400 cursor-not-allowed opacity-80"
                      : "bg-[#004d4d] hover:bg-[#006666] text-cyan-400 border border-cyan-900/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-95"
                  }
                `}
            >
              {loading ? (
                <>
                  {/* Spinner Animation */}
                  <svg
                    className="animate-spin h-5 w-5 text-cyan-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  {/* Icon Save tĩnh */}
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <span>Lưu thay đổi</span>
                </>
              )}

              {/* Hiệu ứng tia sáng quét qua khi Hover (tùy chọn) */}
              {!loading && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
              )}
            </button>
          </div>
        </form>
        {/* ĐÓNG THẺ FORM TẠI ĐÂY */}
      </div>
    </div>,
    document.body,
  );
}

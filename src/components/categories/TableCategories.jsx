"use client";

import { useState, useRef, useEffect } from "react";
import { EditAction } from "../../components/categories/EditAction";
import DeleteAction from "../../components/categories/DeleteAction";
import { getAllCategories } from "../../services/categoryService";
import CategoryActions from "./CategoryActions";

import { useAutoAnimate } from "@formkit/auto-animate/react";
export default function TableCategories({ data }) {
  // hooks
  const [categories, setCategories] = useState(data);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [parent] = useAutoAnimate({
    duration: 250, // Tốc độ chạy (ms), 250 là vừa đẹp
    easing: "ease-in-out",
  });

  // 2. Hàm cập nhật lại dữ liệu (Refresh)
  const refreshData = async () => {
    try {
      const updatedData = await getAllCategories();
      setCategories(updatedData); // Cập nhật state khiến giao diện thay đổi ngay
    } catch (error) {
      console.error("Lỗi khi load lại dữ liệu:", error);
    }
  };

  // 3. lọc status category
  const filteredData = categories.filter((item) => {
    const matchesStatus =
      filterStatus === "All" ? true : item.status === filterStatus;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Hàm tiện ích để tạo mảng số trang (ví dụ: [1, 2, 3])
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const options = [
    { value: "All", label: "Tất cả trạng thái", icon: "🌐" },
    {
      value: "Active",
      label: "Hoạt động",
      icon: "✅",
      color: "text-emerald-400",
    },
    { value: "Inactive", label: "Đã ẩn", icon: "🚫", color: "text-rose-400" },
  ];

  const selectedOption = options.find((opt) => opt.value === filterStatus);

  return (
    <>
      <div className="p-4 max-w-[1600px] mx-auto animate-fade-in space-y-8">
        {/* 1. Header & Quick Actions */}

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white">Quản lý Danh mục</h1>
            <p className="text-admin-text-muted mt-2 text-sm">
              Tổ chức cây danh mục sản phẩm, tối ưu SEO và quản lý hiển thị trên
              Storefront.
            </p>
          </div>
          <CategoryActions refreshData={refreshData} />
        </div>

        {/* 2. Stats Grid - Đã bổ sung Icon chuẩn Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {/* Tổng danh mục - Icon Folder/Layers */}
          <div className="admin-card flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-bold mb-1">
                Tổng danh mục
              </p>
              <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold text-white">128</h2>
                <span className="text-green-500 text-[10px] font-medium mb-1">
                  +4 tháng này
                </span>
              </div>
            </div>
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
          </div>

          {/* Đang hoạt động - Icon Check Circle */}
          <div className="admin-card border-b-2 border-b-admin-accent flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-bold mb-1">
                Đang hoạt động
              </p>
              <h2 className="text-3xl font-bold text-admin-accent">128</h2>
            </div>
            <div className="p-3 bg-admin-accent/10 rounded-full text-admin-accent">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Danh mục trống - Icon Archive/Alert */}
          <div className="admin-card flex justify-between items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-admin-text-muted font-bold mb-1">
                Danh mục trống
              </p>
              <h2 className="text-3xl font-bold text-orange-400">12</h2>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-xl text-orange-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
          </div>

          {/* Thao tác nhanh - Icon Lightning/Flash */}
          <div className="bg-admin-accent/5 border border-admin-accent/20 rounded-2xl p-6 flex flex-col justify-center gap-2 relative overflow-hidden group">
            <div className="absolute -right-2 -top-2 text-admin-accent/10 group-hover:text-admin-accent/20 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>

            <p className="text-[10px] uppercase text-admin-accent font-bold relative z-10">
              Thao tác nhanh
            </p>
            <button className="w-full py-2 bg-admin-accent text-gray-900 rounded-lg text-xs font-bold hover:brightness-110 transition-all relative z-10 flex items-center justify-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.047a1 1 0 01.897.95V7h2.803a1 1 0 01.707 1.707l-4.118 4.117A1 1 0 0110 13a1 1 0 01-.707-.293L5.175 8.59a1 1 0 01.707-1.707H8V2a1 1 0 01.103-.453l3.2-1.5zM4 16a1 1 0 100 2h12a1 1 0 100-2H4z"
                  clipRule="evenodd"
                />
              </svg>
              Tối ưu hóa SEO
            </button>
          </div>
        </div>

        {/* 3. Main Data Section */}
        <div className="admin-card p-0 overflow-hidden border-admin-border/50">
          {/* Filters Bar */}
          <div className="p-5 border-b border-admin-border bg-gray-900/30 flex flex-wrap gap-4 justify-between items-center">
            <div className="flex gap-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  🔍
                </span>
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                  }}
                  type="text"
                  placeholder="Tìm danh mục..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-admin-accent transition-all"
                />
              </div>
              <div className="relative w-56" ref={dropdownRef}>
                {/* Label & Nút bấm chính */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-2.5 text-sm flex items-center justify-between hover:border-admin-accent transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{selectedOption?.icon}</span>
                    <span
                      className={`font-medium ${selectedOption?.color || "text-gray-200"}`}
                    >
                      {selectedOption?.label}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Danh sách Options (Menu thả xuống) */}
                {isOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl shadow-black/50 overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in duration-200">
                    <div className="p-1">
                      {options.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setFilterStatus(option.value);
                            setIsOpen(false);
                            setCurrentPage(1);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs rounded-lg transition-colors
                ${
                  filterStatus === option.value
                    ? "bg-admin-accent/10 text-admin-accent font-bold"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }
              `}
                        >
                          <span>{option.icon}</span>
                          {option.label}
                          {filterStatus === option.value && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-admin-accent shadow-[0_0_8px_#admin-accent]"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-admin-text-muted">
              Hiển thị <b>10</b> trên <b>128</b> danh mục
            </div>
          </div>
          {/* Production Table */}
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800/50 text-admin-text-muted text-[11px] uppercase tracking-wider font-bold">
              <tr>
                <th className="p-4 w-10">
                  <input
                    type="checkbox"
                    className="accent-admin-accent rounded border-gray-700 bg-gray-900"
                  />
                </th>
                {/* Cột ID mới bổ sung */}
                <th className="p-4 w-32 text-center">ID</th>
                <th className="p-4 text-center">image</th>
                <th className="p-4 text-center">Tên danh mục</th>
                <th className="p-4 text-center">Số lượng sản phẩm</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody
              ref={parent}
              className="divide-y divide-admin-border/30 text-sm"
            >
              {currentItems?.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="accent-admin-accent rounded border-gray-700 bg-gray-900"
                    />
                  </td>

                  {/* Nội dung cột ID: Font chữ nhỏ, màu mờ, kiểu font máy tính (mono) */}
                  <td className="p-4 text-admin-text-muted font-mono text-[11px] tracking-tighter">
                    #{item._id}
                  </td>

                  <td className="p-4 ">
                    <img
                      src={`https://devninjas-tech-website-be.onrender.com/uploads/categories/${item.image}`}
                      alt=""
                      className="w-40 h-auto m-auto"
                    />
                  </td>

                  <td className="p-4  gap-3 align-middle">
                    {/* Vòng tròn chứa Icon/Emoji giống trong ảnh */}

                    <div>
                      <div className="font-bold text-white group-hover:text-admin-accent transition-colors text-center">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-admin-text-muted italic text-center">
                        Modified: 2h ago
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-gray-300 text-center">
                    {item.product_count}
                    <span className="text-[10px] text-admin-text-muted ml-1 ">
                      SKUs
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black tracking-widest ${
                        item.status === "Active"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>

                  <td className="p-4 ">
                    <div className="flex justify-center gap-2">
                      <button className="p-2  hover:bg-gray-700 rounded-md transition-all text-admin-text-muted hover:text-white">
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <DeleteAction
                        categoryId={item._id}
                        onSave={refreshData}
                        categoryName={item.name}
                      />
                      <EditAction
                        categoryId={item._id}
                        refreshData={refreshData}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="p-4 bg-gray-900/30 border-t border-admin-border flex items-center justify-between">
            {/* Thông báo số lượng - Giúp UX chuyên nghiệp hơn */}
            <div className="text-[11px] text-admin-text-muted uppercase tracking-widest font-medium">
              Trang {currentPage} / {totalPages || 1}
            </div>

            <div className="flex gap-2">
              {/* Nút TRƯỚC */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded bg-gray-800 text-[11px] font-bold uppercase tracking-tighter border border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors text-admin-text-muted"
              >
                Trước
              </button>

              {/* Danh sách SỐ TRANG */}
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all duration-300 ${
                    currentPage === number
                      ? "bg-admin-accent text-gray-900 shadow-lg shadow-admin-accent/20" // Active
                      : "bg-gray-800 text-admin-text-muted border border-gray-700 hover:border-admin-accent/50" // Inactive
                  }`}
                >
                  {number}
                </button>
              ))}

              {/* Nút SAU */}
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 rounded bg-gray-800 text-[11px] font-bold uppercase tracking-tighter border border-gray-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors text-admin-text-muted"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

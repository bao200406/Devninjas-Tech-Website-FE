"use client";

import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Box,
  Edit2,
  Trash2,
  Eye,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import {
  getAllCategories,
  deleteCategory,
} from "../../../services/categoryService";

export default function CategoryPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [categories, setCategories] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      setCategories(res || []);
    } catch (error) {
      toast.error("Không thể tải danh mục");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteCategory = (categoryId, categoryName) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Danh mục "${categoryName}" sẽ bị xóa!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Vâng, xóa!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCategory(categoryId);

          toast.success(
            `Đã xóa danh mục "${categoryName}" thành công!`
          );

          setCategories((prev) =>
            prev.filter((c) => c._id !== categoryId)
          );
        } catch (error) {
          toast.error("Không thể xóa danh mục này!");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400 flex items-center gap-2 mb-1">
            <span>Tổng quan</span>
            <span className="text-[10px]">/</span>
            <span className="text-slate-600 font-medium">
              Danh mục
            </span>
          </nav>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Danh mục sản phẩm
          </h1>

          <p className="text-slate-500 text-sm">
            Quản lý các danh mục sản phẩm trên hệ thống.
          </p>
        </div>

        <Link
          href="/admin2/categories/addCategory"
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus size={18} />
          Thêm danh mục
        </Link>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl border border-slate-200/50">
        {[
          { value: "All", label: "Tất cả" },
          { value: "Active", label: "Đang hoạt động" },
          { value: "Inactive", label: "Ngừng hoạt động" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
        <div className="relative w-full lg:w-[350px]">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none"
          />
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
          <Download size={16} />
          Xuất dữ liệu
        </button>
      </div>

      {/* Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-white">
              <th className="pl-6 py-4 w-10">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-slate-900"
                />
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-900">
                Tên danh mục
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-900">
                Mô tả
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-900">
                Đường dẫn
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-center">
                Nổi bật
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-center">
                Trạng thái
              </th>

              <th className="px-4 py-4 text-sm font-semibold text-slate-900">
                Ngày tạo
              </th>

              <th className="pr-6 py-4 w-10"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {categories.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="pl-6 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 accent-slate-900"
                  />
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-100 overflow-hidden">
                      {item.image ? (
                        <img
                          src={`https://devninjas-tech-website-be-1.onrender.com/uploads/categories/${item.image}`}
                          className="w-full h-full object-cover rounded-lg"
                          alt={item.name}
                        />
                      ) : (
                        <LayoutGrid
                          size={20}
                          className="text-slate-400"
                        />
                      )}
                    </div>

                    <span className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </span>
                  </div>
                </td>

                <td className="px-4 py-4 text-sm text-slate-600 truncate max-w-[150px]">
                  {item.description}
                </td>

                <td className="px-4 py-4 text-sm text-slate-500">
                  {item.slug}
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`text-xs font-medium ${
                      item.isFeatured
                        ? "text-amber-600"
                        : "text-slate-400"
                    }`}
                  >
                    {item.isFeatured ? "Có" : "Không"}
                  </span>
                </td>

                <td className="px-4 py-4 text-center">
                  <span
                    className={`px-2 py-1 rounded text-[11px] font-semibold ${
                      item.status === "Active"
                        ? "bg-emerald-500 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {item.status === "Active"
                      ? "Đang hoạt động"
                      : "Ngừng hoạt động"}
                  </span>
                </td>

                <td className="px-4 py-4 text-sm text-slate-500">
                  {new Date(item.createdAt).toLocaleDateString(
                    "vi-VN"
                  )}
                </td>

                <td className="pr-6 py-4 text-right relative">
                  <button
                    onClick={() =>
                      setOpenDropdownId(
                        openDropdownId === item._id
                          ? null
                          : item._id
                      )
                    }
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {openDropdownId === item._id && (
                    <div
                      ref={dropdownRef}
                      className="absolute right-12 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-50 py-1"
                    >
                      <Link
                        href={`/admin2/categories/editCategories/${item._id}`}
                        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Edit2 size={14} />
                        Chỉnh sửa
                      </Link>

                      <button
                        onClick={() =>
                          handleDeleteCategory(
                            item._id,
                            item.name
                          )
                        }
                        className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 size={14} />
                        Xóa
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
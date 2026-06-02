"use client";

import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Box,
  Image as ImageIcon,
  ArrowUpDown,
  Link as LinkIcon,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "../../services/productService";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteProduct = (productId, productName) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: `Sản phẩm "${productName}" sẽ bị xóa vĩnh viễn!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Vâng, xóa nó!",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteProduct(productId);

          // Kiểm tra status từ service trả về
          if (res && (res.status === 200 || res.status === 204)) {
            // --- THAY THẾ SWAL BẰNG TOAST TẠI ĐÂY ---
            toast.success(`Đã xóa sản phẩm ${productName} thành công!`);

            // Cập nhật State để biến mất khỏi UI ngay lập tức
            setProducts((prev) => prev.filter((p) => p._id !== productId));
          }
        } catch (error) {
          toast.error("Không thể xóa sản phẩm này!");
        }
      }
    });
  };
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400 flex items-center gap-2 mb-1">
            <span>Dashboard</span>
            <span className="text-[10px]">/</span>
            <span className="text-slate-600 font-medium">Products</span>
          </nav>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Products
          </h1>
          <p className="text-slate-500 text-sm">
            Browse and manage your product catalog.
          </p>
        </div>
        <Link
          href="/admin2/products/addProduct"
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {/* Segmented Control Tabs (Sửa lại giống hình 100%) */}
      <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl border border-slate-200/50">
        {["All", "Active", "Draft", "Archived"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/20"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table Container */}
      <div>
        {/* Toolbar - Dựa theo image_48d57d.png */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[350px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-400 transition-all"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 border-dashed">
              <Plus size={16} className="text-slate-900" /> Category
            </button>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter size={16} /> Columns
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table Data - Cấu trúc phẳng không border đứng */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="pl-6 py-4 w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-slate-900">
                    <div className="flex items-center gap-1 cursor-pointer">
                      Product
                      <ArrowUpDown size={14} className="text-slate-300" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Category
                      <ArrowUpDown size={14} className="text-slate-300" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Status
                      <ArrowUpDown size={14} className="text-slate-300" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Stock <ArrowUpDown size={14} className="text-slate-300" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Price <ArrowUpDown size={14} className="text-slate-300" />
                    </div>
                  </th>
                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Created
                      <ArrowUpDown size={14} className="text-slate-300" />
                    </div>
                  </th>
                  <th className="pr-6 py-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {products.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="pl-6 py-4">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {/* Phần hiển thị ảnh sản phẩm thực tế */}
                        <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={`http://localhost:5000/uploads/products/${item.image}`}
                              alt={item.name}
                              className="max-w-full max-h-full object-contain drop-shadow-sm"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/150?text=No+Image";
                              }}
                            />
                          ) : (
                            <Box size={40} className="text-slate-400" />
                          )}
                        </div>

                        {/* Thông tin Text bên cạnh */}
                        <div>
                          <p className="text-sm font-semibold text-slate-900 leading-none mb-1">
                            {item.name}
                          </p>
                          <p className="text-xs text-slate-500 line-clamp-1 max-w-[350px]">
                            {/* Bạn có thể thay bằng description từ data nếu có */}
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="text-xs font-medium px-2.5 py-1 border border-slate-200 rounded-full text-slate-700">
                        {item.categoryId.name}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold text-[11px] bg-emerald-500 text-white">
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600 text-right font-medium">
                      {item.stock}
                    </td>
                    <td className="px-4 py-4 text-sm font-bold text-slate-900 text-right">
                      ${item.basePrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 text-right whitespace-nowrap">
                      Jan 15, 2026
                    </td>
                    <td className="px-4 py-4 text-right relative">
                      <div className="flex justify-end pr-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdownId(
                              openDropdownId === item._id ? null : item._id,
                            );
                          }}
                          className={`p-2 rounded-lg transition-all ${
                            openDropdownId === item._id
                              ? "bg-slate-100 text-slate-900"
                              : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                          }`}
                        >
                          <MoreHorizontal size={20} />
                        </button>

                        {/* Dropdown Menu */}
                        {openDropdownId === item._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-12 top-12 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-[100] py-1.5 animate-in fade-in zoom-in duration-200"
                          >
                            <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                              <Eye size={14} className="text-slate-400" />
                              View
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors">
                              <Edit2 size={14} className="text-slate-400" />
                              Edit
                            </button>
                            <div className="h-px bg-slate-100 my-1 mx-2" />
                            <button
                              onClick={() =>
                                handleDeleteProduct(item._id, item.name)
                              }
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

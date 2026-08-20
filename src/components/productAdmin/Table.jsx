"use client";

import {
  Plus,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Box,
  Image as ImageIcon,
  ArrowUpDown,
  Link as LinkIcon,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  AlertCircle,
  X,
} from "lucide-react";
import Link from "next/link";
import { getAllProducts, deleteProduct } from "../../services/productService";
import { getVariantsByProduct } from "../../services/variantsService";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [products, setProducts] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [selectedProductForModal, setSelectedProductForModal] = useState(null);
  const [modalVariants, setModalVariants] = useState([]);
  const [loadingModalVariants, setLoadingModalVariants] = useState(false);

  const dropdownRef = useRef(null);
  const router = useRouter();

  const fetchProducts = async () => {
    try {
      const res = await getAllProducts();
      setProducts(res);
    } catch (error) {
      console.log(error);
      toast.error("Không thể tải danh sách sản phẩm!");
    }
  };

  useEffect(() => {
    fetchProducts();
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

  // Mở modal xem biến thể
  const handleOpenVariantModal = async (product) => {
    setSelectedProductForModal(product);
    setLoadingModalVariants(true);
    setModalVariants([]);

    try {
      const variantsData = await getVariantsByProduct(product._id);
      setModalVariants(variantsData || []);
    } catch (error) {
      toast.error("Không thể tải danh sách biến thể của sản phẩm!");
    } finally {
      setLoadingModalVariants(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedProductForModal(null);
    setModalVariants([]);
  };

  // Xóa sản phẩm
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

          if (res && (res.status === 200 || res.status === 204)) {
            toast.success(
              `Đã xóa sản phẩm ${productName} thành công!`
            );

            setProducts((prev) =>
              prev.filter((p) => p._id !== productId)
            );
          }
        } catch (error) {
          toast.error("Không thể xóa sản phẩm này!");
        }
      }
    });
  };

  // Format tiền VNĐ
  const formatCurrency = (value) => {
    if (value === undefined || value === null || value === "") {
      return "0 ₫";
    }

    return `${Number(value).toLocaleString("vi-VN")} ₫`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="text-xs text-slate-400 flex items-center gap-2 mb-1">
            <span>Bảng điều khiển</span>
            <span className="text-[10px]">/</span>
            <span className="text-slate-600 font-medium">
              Sản phẩm
            </span>
          </nav>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Sản phẩm
          </h1>

          <p className="text-slate-500 text-sm">
            Xem và quản lý danh mục sản phẩm của bạn.
          </p>
        </div>

        <Link
          href="/admin2/products/create"
          className="flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
        >
          <Plus size={18} />
          Thêm sản phẩm
        </Link>
      </div>

      {/* Tabs */}
      <div className="inline-flex p-1 bg-[#F1F5F9] rounded-xl border border-slate-200/50">
        {[
          { key: "Tất cả", label: "Tất cả" },
          { key: "Active", label: "Đang bán" },
          { key: "Draft", label: "Bản nháp" },
          { key: "Archived", label: "Đã lưu trữ" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-6 py-1.5 text-sm font-semibold rounded-lg transition-all ${
              activeTab === tab.key
                ? "bg-white text-slate-900 shadow-sm border border-slate-200/20"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div>
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-center mb-6">
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[350px]">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-slate-400 transition-all"
              />
            </div>

            <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 border-dashed">
              <Plus size={16} className="text-slate-900" />
              Danh mục
            </button>
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Filter size={16} />
              Cột
            </button>

            <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download size={16} />
              Xuất dữ liệu
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-white">
                  <th className="pl-4 pr-2 py-4 w-10">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
                    />
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-900">
                    <div className="flex items-center gap-1 cursor-pointer">
                      Sản phẩm
                      <ArrowUpDown
                        size={14}
                        className="text-slate-300"
                      />
                    </div>
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Danh mục
                      <ArrowUpDown
                        size={14}
                        className="text-slate-300"
                      />
                    </div>
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Trạng thái
                      <ArrowUpDown
                        size={14}
                        className="text-slate-300"
                      />
                    </div>
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Tồn kho
                      <ArrowUpDown
                        size={14}
                        className="text-slate-300"
                      />
                    </div>
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Giá
                      <ArrowUpDown
                        size={14}
                        className="text-slate-300"
                      />
                    </div>
                  </th>

                  <th className="px-4 py-4 text-sm font-semibold text-slate-900 text-right">
                    <div className="flex items-center justify-end gap-1 cursor-pointer">
                      Ngày tạo
                      <ArrowUpDown
                        size={14}
                        className="text-slate-300"
                      />
                    </div>
                  </th>

                  <th className="pr-6 py-4 w-10"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {products.map((item) => (
                  <tr
                    key={item._id}
                    onClick={() => handleOpenVariantModal(item)}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  >
                    {/* Checkbox */}
                    <td
                      className="pl-4 pr-2 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 accent-slate-900 cursor-pointer"
                      />
                    </td>

                    {/* Sản phẩm */}
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 shrink-0 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 flex items-center justify-center">
                          {item.image ? (
                            <img
                              src={`https://devninjas-tech-website-be-1.onrender.com/uploads/products/${item.image}`}
                              alt={item.name}
                              className="max-w-full max-h-full object-contain drop-shadow-sm"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://via.placeholder.com/150?text=No+Image";
                              }}
                            />
                          ) : (
                            <Box
                              size={40}
                              className="text-slate-400"
                            />
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-900 leading-none mb-1">
                            {item.name}
                          </p>

                          <p className="text-xs text-slate-500 line-clamp-1 max-w-[350px]">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Danh mục */}
                    <td className="px-4 py-4 text-right">
                      <span className="text-xs font-medium px-2.5 py-1 border border-slate-200 rounded-full text-slate-700">
                        {item.categoryId?.name || "Chưa có"}
                      </span>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-4 py-4 text-right">
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-semibold text-[11px] bg-emerald-500 text-white">
                        {item.status === "Active"
                          ? "Đang bán"
                          : item.status === "Draft"
                          ? "Bản nháp"
                          : item.status === "Inactive"
                          ? "Ngừng bán"
                          : item.status || "Không xác định"}
                      </span>
                    </td>

                    {/* Tồn kho */}
                    <td className="px-4 py-4 text-sm text-slate-600 text-right font-medium">
                      {item.stock ?? 0}
                    </td>

                    {/* Giá */}
                    <td className="px-4 py-4 text-sm font-bold text-slate-900 text-right">
                      {formatCurrency(item.basePrice)}
                    </td>

                    {/* Ngày tạo */}
                    <td className="px-4 py-4 text-sm text-slate-500 text-right whitespace-nowrap">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString(
                            "vi-VN"
                          )
                        : "Chưa có"}
                    </td>

                    {/* Thao tác */}
                    <td
                      className="px-4 py-4 text-right relative"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex justify-end pr-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();

                            setOpenDropdownId(
                              openDropdownId === item._id
                                ? null
                                : item._id
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

                        {/* Dropdown */}
                        {openDropdownId === item._id && (
                          <div
                            ref={dropdownRef}
                            className="absolute right-12 top-12 w-36 bg-white rounded-xl shadow-xl border border-slate-100 z-[100] py-1.5 animate-in fade-in zoom-in duration-200"
                          >
                            <button
                              onClick={() =>
                                handleOpenVariantModal(item)
                              }
                              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                            >
                              <Eye
                                size={14}
                                className="text-slate-400"
                              />
                              Xem
                            </button>

                            <button
                              onClick={() =>
                                router.push(
                                  `/admin2/products/edit/${item._id}`
                                )
                              }
                              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                            >
                              <Edit2
                                size={14}
                                className="text-slate-400"
                              />
                              Chỉnh sửa
                            </button>

                            <div className="h-px bg-slate-100 my-1 mx-2" />

                            <button
                              onClick={() =>
                                handleDeleteProduct(
                                  item._id,
                                  item.name
                                )
                              }
                              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors font-medium"
                            >
                              <Trash2 size={14} />
                              Xóa
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

      {/* MODAL BIẾN THỂ */}
      {selectedProductForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Biến thể của: {selectedProductForModal.name}
                </h3>

                <p className="text-xs text-slate-500">
                  Xem chi tiết các phiên bản, giá và tồn kho
                </p>
              </div>

              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body modal */}
            <div className="p-6 overflow-y-auto flex-1">
              {loadingModalVariants ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400 text-sm">
                  <Loader2
                    className="animate-spin text-slate-900"
                    size={28}
                  />
                  Đang tải danh sách biến thể...
                </div>
              ) : modalVariants.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm italic">
                  Sản phẩm này hiện chưa có biến thể nào.
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-semibold text-xs uppercase tracking-wider">
                      <th className="pb-3">
                        Thuộc tính / Phiên bản
                      </th>
                      <th className="pb-3">Giá bán</th>
                      <th className="pb-3">Giá gốc</th>
                      <th className="pb-3">Tồn kho</th>
                      <th className="pb-3 text-right">Thao tác</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {modalVariants.map((v) => {
                      const isLowStock = v.stock <= 5;

                      const attrString =
                        v.attributes
                          ?.map(
                            (a) =>
                              a.attributeValueId?.value
                          )
                          .join(" - ") ||
                        v.sku ||
                        "Biến thể";

                      return (
                        <tr
                          key={v._id}
                          className="hover:bg-slate-50/60"
                        >
                          <td className="py-3 font-medium text-slate-800 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-900"></span>
                            {attrString}
                          </td>

                          {/* Giá bán VNĐ */}
                          <td className="py-3 font-bold text-slate-900">
                            {formatCurrency(v.price)}
                          </td>

                          {/* Giá gốc VNĐ */}
                          <td className="py-3 text-slate-400 line-through text-xs">
                            {v.compareAtPrice
                              ? formatCurrency(v.compareAtPrice)
                              : "---"}
                          </td>

                          {/* Tồn kho */}
                          <td className="py-3">
                            <span
                              className={`font-bold text-xs px-2.5 py-1 rounded-md ${
                                isLowStock
                                  ? "bg-red-100 text-red-700"
                                  : "bg-emerald-50 text-emerald-700"
                              }`}
                            >
                              {v.stock} chiếc
                            </span>
                          </td>

                          {/* Thao tác */}
                          <td className="py-3 text-right">
                            <button
                              onClick={() => {
                                handleCloseModal();
                                router.push(
                                  `/admin2/products/edit/${selectedProductForModal._id}`
                                );
                              }}
                              className="text-xs text-slate-600 hover:text-slate-900 font-semibold underline"
                            >
                              Chỉnh sửa
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer modal */}
            <div className="flex items-center justify-end px-6 py-3 border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
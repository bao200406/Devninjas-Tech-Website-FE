import React from "react";
import {
  ChevronRight,
  Edit3,
  Trash2,
  Package,
  Eye,
  Layers,
  Image as ImageIconLucide,
  ArrowLeft,
  Calendar,
  ExternalLink,
  PencilLine,
  Tag,
} from "lucide-react";
import Link from "next/link";

const ProductDetailAdmin = () => {
  // Giả định dữ liệu sản phẩm lấy từ API
  const product = {
    name: "iPhone 15 Pro Max 256GB - Titan Tự Nhiên",
    basePrice: "1200",
    description: "Sản phẩm flagship mới nhất từ Apple với khung viền Titan...",
    category: "Điện thoại",
    brand: "Apple",
    status: "Active",
    createdAt: "14/05/2026",
    variants: [
      {
        attributes: { Color: "Titan", Storage: "256GB" },
        price: 1200,
        stock: 45,
        sku: "IP15-T-256",
        isActive: true,
      },
      {
        attributes: { Color: "Blue", Storage: "512GB" },
        price: 1400,
        stock: 12,
        sku: "IP15-B-512",
        isActive: true,
      },
    ],
  };

  return (
    <div className="space-y-6 max-w-full mx-auto pb-20 px-4 lg:px-8 bg-[#FBFBFB]">
      {/* 1. TOP NAVIGATION & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link
              href="/admin/products"
              className="hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider"
            >
              Products
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-900 font-bold text-xs uppercase tracking-wider truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/products"
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm"
            >
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Chi tiết sản phẩm
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Eye size={18} /> Xem cửa hàng
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Edit3 size={18} /> Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI - THÔNG TIN CHI TIẾT */}
        <div className="lg:col-span-9 space-y-8">
          {/* KHỐI 1: TỔNG QUAN HIỂN THỊ */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Ảnh chính */}
              <div className="md:col-span-4">
                <div className="aspect-square bg-slate-100 rounded-[24px] border border-slate-100 overflow-hidden relative group">
                  <img
                    src="https://via.placeholder.com/400"
                    className="w-full h-full object-cover"
                    alt="Product"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase rounded-lg tracking-widest shadow-lg">
                      {product.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Thông tin nhanh */}
              <div className="md:col-span-8 flex flex-col justify-between py-2">
                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 block">
                      {product.brand} • {product.category}
                    </span>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight">
                      {product.name}
                    </h2>
                  </div>

                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      ${product.basePrice}
                    </span>
                    <span className="text-slate-400 font-bold mb-1">
                      Giá cơ bản
                    </span>
                  </div>

                  <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
                    {product.description}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Tổng tồn kho
                    </p>
                    <p className="text-sm font-black text-slate-800">
                      158 Sản phẩm
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Ngày tạo
                    </p>
                    <p className="text-sm font-black text-slate-800">
                      {product.createdAt}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      Lượt xem
                    </p>
                    <p className="text-sm font-black text-slate-800">1,240</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KHỐI 2: BIẾN THỂ VÀ KHO HÀNG */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Layers className="text-slate-400" size={20} />
                <h3 className="text-lg font-bold text-slate-800">
                  Danh sách phiên bản
                </h3>
              </div>
              <span className="px-4 py-1.5 bg-slate-50 text-slate-500 rounded-full text-xs font-bold border border-slate-100">
                {product.variants.length} Phiên bản hiện có
              </span>
            </div>

            <div className="border border-slate-100 rounded-[24px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Phiên bản
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Giá bán
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Kho
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Mã SKU
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {product.variants.map((v, i) => (
                    <tr
                      key={i}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Giả định v.image là URL ảnh của biến thể */}
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
                            {v.image ? (
                              <img
                                src={v.image}
                                alt={v.sku}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIconLucide
                                  size={16}
                                  className="text-slate-300"
                                />
                              </div>
                            )}
                          </div>
                          <span className="text-sm font-bold text-slate-700">
                            {Object.values(v.attributes).join(" / ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center font-black text-slate-900">
                        ${v.price}
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-600">
                        {v.stock}
                      </td>
                      <td className="px-6 py-4 text-center text-xs font-mono font-black text-indigo-500">
                        {v.sku}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            v.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-slate-100 text-slate-400"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${v.isActive ? "bg-emerald-500" : "bg-slate-400"}`}
                          />
                          {v.isActive ? "Active" : "Hidden"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all border border-transparent hover:border-indigo-100">
                          <PencilLine size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI - SIDEBAR INFO */}
        <div className="lg:col-span-3 space-y-6">
          {/* Card: Phân loại */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Phân loại
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                  Danh mục
                </p>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Package size={14} className="text-indigo-500" />{" "}
                  {product.category}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                  Thương hiệu
                </p>
                <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Tag size={14} className="text-rose-500" /> {product.brand}
                </p>
              </div>
            </div>
          </div>

          {/* Card: Metadata */}
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">
              Hoạt động
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">
                  Cập nhật lần cuối:
                </span>
                <span className="text-slate-700 font-black">2 giờ trước</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Người tạo:</span>
                <span className="text-slate-700 font-black">Admin_Duy</span>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-rose-100 transition-all">
              <Trash2 size={14} /> Xóa sản phẩm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailAdmin;

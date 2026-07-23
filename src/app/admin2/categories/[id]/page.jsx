import React from "react";
import {
  ChevronRight,
  Edit3,
  Trash2,
  Package,
  Eye,
  ArrowLeft,
  PencilLine,
  Box,
  Image as ImageIconLucide,
} from "lucide-react";
import Link from "next/link";

const CategoryDetailAdmin = () => {
  // Giả định dữ liệu danh mục lấy từ API
  const category = {
    name: "Điện thoại",
    slug: "dien-thoai",
    description: "Các dòng điện thoại thông minh chính hãng từ Apple, Samsung, Xiaomi...",
    status: "Active",
    createdAt: "14/05/2026",
    productCount: 124,
    products: [
      {
        name: "iPhone 15 Pro Max",
        sku: "IP15-PM-256",
        price: 1200,
        stock: 45,
        status: "Active",
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        sku: "SS-S24U-512",
        price: 1100,
        stock: 30,
        status: "Active",
      },
    ],
  };

  return (
    <div className="space-y-6 max-w-full mx-auto pb-20 px-4 lg:px-8 bg-[#FBFBFB]">
      {/* 1. TOP NAVIGATION & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 text-sm text-slate-400">
            <Link href="/admin/categories" className="hover:text-slate-600 transition-colors text-xs font-bold uppercase tracking-wider">
              Categories
            </Link>
            <ChevronRight size={12} />
            <span className="text-slate-900 font-bold text-xs uppercase tracking-wider truncate max-w-[200px]">
              {category.name}
            </span>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/admin/categories" className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-600 shadow-sm">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Chi tiết Danh mục</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-600 rounded-2xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Eye size={18} /> Xem website
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
            <Edit3 size={18} /> Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* CỘT TRÁI - THÔNG TIN CHI TIẾT */}
        <div className="lg:col-span-9 space-y-8">
          {/* KHỐI 1: TỔNG QUAN */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 block">Category Details</span>
                <h2 className="text-2xl font-black text-slate-900 leading-tight">{category.name}</h2>
                <p className="text-slate-400 font-medium mt-1">Slug: {category.slug}</p>
              </div>
              <p className="text-slate-500 font-medium leading-relaxed">{category.description}</p>
              
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Tổng sản phẩm</p>
                  <p className="text-sm font-black text-slate-800">{category.productCount} Sản phẩm</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Ngày tạo</p>
                  <p className="text-sm font-black text-slate-800">{category.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Trạng thái</p>
                  <p className="text-sm font-black text-emerald-600">{category.status}</p>
                </div>
              </div>
            </div>
          </div>

          {/* KHỐI 2: DANH SÁCH SẢN PHẨM */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Package className="text-slate-400" size={20} />
                <h3 className="text-lg font-bold text-slate-800">Sản phẩm thuộc danh mục</h3>
              </div>
            </div>

            <div className="border border-slate-100 rounded-[24px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Sản phẩm</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Giá</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Kho</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SKU</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {category.products.map((p, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-700">{p.name}</td>
                      <td className="px-6 py-4 text-center font-black text-slate-900">${p.price}</td>
                      <td className="px-6 py-4 text-center font-bold text-slate-600">{p.stock}</td>
                      <td className="px-6 py-4 text-center text-xs font-mono font-black text-indigo-500">{p.sku}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-xl transition-all"><PencilLine size={18} /></button>
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
          <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Hoạt động</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center"><span className="text-slate-400 font-bold">Cập nhật lần cuối:</span><span className="text-slate-700 font-black">1 giờ trước</span></div>
            </div>
            <button className="w-full mt-6 py-3 bg-rose-50 text-rose-500 border border-rose-100 rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-rose-100 transition-all">
              <Trash2 size={14} /> Xóa danh mục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetailAdmin;
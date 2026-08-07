'use client';

import React, { useEffect, useState } from 'react';
import { getAllVouchers } from "@/services/voucherService";
import Link from 'next/link';
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Download, 
  MoreHorizontal, 
  ArrowUpDown,
  Ticket,
  Percent,
  Users,
  CheckCircle2,
  Clock,
  Copy,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function VouchersPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const loadVouchers = async () => {
  try {
    const res = await getAllVouchers();
    setVouchers(res.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  loadVouchers();
}, []);

const [vouchers, setVouchers] = useState([]);
const totalVouchers = vouchers.length;

const activeVouchers = vouchers.filter(
  (v) =>
    v.isActive &&
    new Date(v.startDate) <= new Date() &&
    new Date(v.endDate) >= new Date()
).length;

const totalUsed = vouchers.reduce(
  (sum, v) => sum + (v.usedCount || 0),
  0
);

const expiringSoon = vouchers.filter((v) => {
  const today = new Date();
  const end = new Date(v.endDate);

  const diff =
    (end.getTime() - today.getTime()) /
    (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= 7;
}).length;

  const filteredVouchers = vouchers.filter((item) => {
  return (
    item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
});
const displayVouchers = filteredVouchers.filter((item) => {
  const now = new Date();

  switch (activeTab) {
    case "Active":
      return (
        item.isActive &&
        new Date(item.startDate) <= now &&
        new Date(item.endDate) >= now
      );

    case "Scheduled":
      return new Date(item.startDate) > now;

    case "Expiring": {
  const end = new Date(item.endDate);
  const diff =
    (end.getTime() - now.getTime()) /
    (1000 * 60 * 60 * 24);

  return (
    item.isActive &&
    diff >= 0 &&
    diff <= 7
  );
  }
    
    case "Expired":
      return new Date(item.endDate) < now;

    default:
      return true;
  }
});

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 text-slate-800 font-sans">
      
      {/* 1. Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400 mb-1">
            <span>Dashboard</span>
            <span>/</span>
            <span className="text-slate-700">Vouchers</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Quản lý Voucher</h1>
          <p className="text-sm text-slate-500 mt-1">
            Tạo, theo dõi hiệu suất và quản lý tất cả các chương trình khuyến mãi.
          </p>
        </div>

      <div className="flex items-center">
        <Link
          href="/admin2/vouchers/addVouchers"
          className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-slate-900/10"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo Voucher mới</span>
        </Link>
      </div>
      </div>

      {/* 2. Top Metric Cards (Thống kê tổng quan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Voucher</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalVouchers}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">↑ +4 tháng này</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Ticket className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang hoạt động</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{activeVouchers}</h3>
            <p className="text-xs text-slate-400 mt-1">Đang áp dụng</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lượt sử dụng</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{totalUsed.toLocaleString()}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">↑ 12% so với tháng trước</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sắp hết hạn</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{expiringSoon}</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">Trong 7 ngày tới</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. Main Data Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        
        {/* Filter Bar & Tabs Header */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
            {['All', 'Active', 'Scheduled', 'Expiring', 'Expired'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab === 'All' ? 'Tất cả' : tab === 'Active' ? 'Hoạt động' : tab === 'Scheduled' ? 'Lên lịch' :   tab === 'Expiring' ? 'Sắp hết hạn'  : 'Đã hết hạn'}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên hoặc mã voucher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>

            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <span>Bộ lọc</span>
            </button>
          </div>

        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                <th className="py-4 px-5 w-12 text-center">
                  <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
                </th>
                <th className="py-4 px-4">Mã & Tên Voucher</th>
                <th className="py-4 px-4">Mức giảm</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-4">Tiến độ sử dụng</th>
                <th className="py-4 px-4">Đơn tối thiểu</th>
                <th className="py-4 px-4">Thời gian</th>
                <th className="py-4 px-5 text-right"></th>
              </tr>
            </thead>
<tbody className="divide-y divide-slate-100 text-xs">
{displayVouchers.length === 0 ? (
  <tr>
    <td colSpan={8} className="text-center py-10 text-slate-500">
      Không tìm thấy voucher.
    </td>
  </tr>
) : (
  displayVouchers.map((item) => {
                const usagePercent =
                item.usageLimit === 0
                    ? 0
                    : Math.round((item.usedCount / item.usageLimit) * 100);
                
                return (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-5 text-center">
                      <input type="checkbox" className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer" />
                    </td>
                    
                    {/* Voucher Code Badge & Name */}
                    <td className="py-4 px-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors shrink-0">
                          <Ticket className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60 text-xs">
                              {item.code}
                            </span>
                            <button title="Sao chép mã" className="text-slate-400 hover:text-slate-600 transition-colors">
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-slate-500 mt-1 font-medium">{item.name}</p>
                        </div>
                      </div>
                    </td>

                    {/* Mức giảm */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-slate-900 text-sm">{item.type === "percentage"? `${item.value}%`: `${item.value.toLocaleString()} đ`}</span>
                      <p className="text-[11px] text-slate-400">{item.type === "percentage"? "Phần trăm": "Số tiền cố định"}</p>
                    </td>

                    {/* Trạng thái (Badge) */}
                    <td className="py-4 px-4">
                      {item.isActive && new Date(item.startDate) <= new Date() &&new Date(item.endDate) >= new Date() && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Hoạt động
                        </span>
                      )}
                      {new Date(item.startDate) > new Date() && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          Lên lịch
                        </span>
                      )}
                      {new Date(item.endDate) < new Date() && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Hết hạn
                        </span>
                      )}
                    </td>

                    {/* Tiến độ sử dụng (Progress Bar) */}
                    <td className="py-4 px-4 w-44">
                      <div className="flex items-center justify-between text-[11px] font-medium mb-1">
                        <span className="text-slate-700 font-semibold">{item.usedCount}</span>
                        <span className="text-slate-400">/ {item.usageLimit} lượt</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            usagePercent >= 100 ? 'bg-slate-400' : 'bg-slate-900'
                          }`}
                          style={{ width: `${usagePercent}%` }}
                        />
                      </div>
                    </td>

                    {/* Đơn tối thiểu */}
                    <td className="py-4 px-4 font-semibold text-slate-800">
                      {item.minOrderValue.toLocaleString()} đ
                    </td>

                    {/* Thời gian hằng ngày */}
                    <td className="py-4 px-4 text-slate-500">
                      <div className="flex items-center gap-1.5 text-[11px] font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{new Date(item.startDate).toLocaleDateString("vi-VN")} - {new Date(item.endDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </td>

                    {/* Thao tác */}
                    <td className="py-4 px-5 text-right">
                      <button className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-700 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>Hiển thị <b>1 - {displayVouchers.length}</b> trong tổng số <b>{vouchers.length}</b> voucher</div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Ticket, 
  Sparkles, 
  Calendar, 
  Percent, 
  DollarSign, 
  Truck, 
  Info, 
  Save, 
  CheckCircle2, 
  Clock, 
  Users, 
  ShieldCheck,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { createVoucher } from "@/services/voucherService";

export default function AddVoucherPage() {
  // State quản lý thông tin form
  const [formData, setFormData] = useState({
    code: 'SUMMER2026',
    name: 'Giảm giá mùa hè 2026',
    description: 'Áp dụng cho tất cả đơn hàng từ 500,000 đ trong dịp khuyến mãi mùa hè.',
    discountType: 'percentage', // 'percentage' | 'fixed' | 'shipping'
    discountValue: 20,
    maxDiscountAmount: 100000,
    minOrderValue: 500000,
    usageLimitTotal: 500,
    usageLimitPerUser: 1,
    status: 'Active', // 'Active' | 'Scheduled' | 'Draft'
    startDate: '2026-06-01',
    endDate: '2026-08-31',
    applyTo: 'all_products', // 'all_products' | 'categories' | 'vip_users'
  });

  // Tự động sinh mã voucher ngẫu nhiên
  const handleGenerateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomCode = '';
    for (let i = 0; i < 8; i++) {
      randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData(prev => ({ ...prev, code: randomCode }));
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const voucherData = {
        code: formData.code,
        name: formData.name,
        description: formData.description,

        // Backend dùng "type" và "value"
        type: formData.discountType,
        value: formData.discountValue,

        minOrderValue: formData.minOrderValue,

        maxDiscount:
          formData.discountType === "percentage"
            ? formData.maxDiscountAmount
            : null,

        usageLimit: formData.usageLimitTotal,

        usageLimitPerUser: formData.usageLimitPerUser,

        applyTo: formData.applyTo,

        startDate: formData.startDate,
        endDate: formData.endDate,

        isActive: formData.status === "Active",
      };

      await createVoucher(voucherData);

      alert("Tạo voucher thành công!");

      // reset form nếu muốn
      // hoặc chuyển trang
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Có lỗi xảy ra"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-8 text-slate-800 font-sans">
      <form onSubmit={handleSubmit} className="max-w-7xl mx-auto">
        
        {/* 1. Header & Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/admin/vouchers" 
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại danh sách Voucher</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Tạo Voucher Mới</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Thiết lập mã giảm giá, chương trình ưu đãi và điều kiện áp dụng.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={() => handleChange('status', 'Draft')}
              className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <Save className="w-4 h-4 text-slate-500" />
              <span>Lưu Nháp</span>
            </button>
            <button 
              type="submit"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm shadow-slate-900/10"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Xuất Bản Voucher</span>
            </button>
          </div>
        </div>

        {/* 2. Main Content Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Form Details (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Thông tin cơ bản */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Tag className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Thông tin cơ bản</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Tên chương trình */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tên chương trình / Voucher <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Giảm giá mùa hè, Tri ân khách hàng..."
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Mã Voucher & Nút Tự động tạo */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Mã Voucher <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateCode}
                      className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      Tạo ngẫu nhiên
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="VD: SUMMER2026"
                    value={formData.code}
                    onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all uppercase"
                  />
                </div>

                {/* Trạng thái ban đầu */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Trạng thái khởi tạo
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                  >
                    <option value="Active">Đang hoạt động (Active)</option>
                    <option value="Scheduled">Lên lịch chạy (Scheduled)</option>
                    <option value="Draft">Lưu nháp (Draft)</option>
                  </select>
                </div>

                {/* Mô tả */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mô tả / Điều khoản sử dụng
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Mô tả ngắn gọn điều kiện áp dụng cho khách hàng..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Cấu hình Mức giảm & Giá trị */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Percent className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Cấu hình ưu đãi</h2>
              </div>

              {/* Loại giảm giá Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Loại ưu đãi
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange('discountType', 'percentage')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold gap-2 transition-all ${
                      formData.discountType === 'percentage'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Percent className="w-5 h-5" />
                    <span>Theo phần trăm (%)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('discountType', 'fixed')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold gap-2 transition-all ${
                      formData.discountType === 'fixed'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <DollarSign className="w-5 h-5" />
                    <span>Số tiền cố định (₫)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleChange('discountType', 'shipping')}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-xs font-semibold gap-2 transition-all ${
                      formData.discountType === 'shipping'
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span>Miễn phí vận chuyển</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                {/* Giá trị giảm */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mức giảm {formData.discountType === 'percentage' ? '(%)' : '(VNĐ)'}
                  </label>
                  <input
                    type="number"
                    value={formData.discountValue}
                    onChange={(e) => handleChange('discountValue', Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                {/* Giảm tối đa (chỉ hiện khi chọn phần trăm) */}
                {formData.discountType === 'percentage' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Giảm tối đa (VNĐ)
                    </label>
                    <input
                      type="number"
                      placeholder="Không giới hạn"
                      value={formData.maxDiscountAmount}
                      onChange={(e) => handleChange('maxDiscountAmount', Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                    />
                  </div>
                )}

                {/* Đơn hàng tối thiểu */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Giá trị đơn hàng tối thiểu (VNĐ)
                  </label>
                  <input
                    type="number"
                    placeholder="0 đ (Không yêu cầu)"
                    value={formData.minOrderValue}
                    onChange={(e) => handleChange('minOrderValue', Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Giới hạn sử dụng */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Users className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Giới hạn sử dụng</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Tổng số lượt sử dụng tối đa
                  </label>
                  <input
                    type="number"
                    placeholder="VD: 500"
                    value={formData.usageLimitTotal}
                    onChange={(e) => handleChange('usageLimitTotal', Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Giới hạn lượt dùng / Mỗi khách hàng
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimitPerUser}
                    onChange={(e) => handleChange('usageLimitPerUser', Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Settings & Live Preview (1/3 width) */}
          <div className="space-y-6">
            
            {/* Live Voucher Preview Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-800 rounded-full opacity-50 blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/10 text-[11px] font-semibold text-slate-200 backdrop-blur-md">
                  <Ticket className="w-3.5 h-3.5 text-amber-400" />
                  <span>XEM TRƯỚC VOUCHER</span>
                </div>
                <span className="text-xs font-mono text-slate-400">#PREVIEW</span>
              </div>

              <div className="space-y-3">
                <div className="text-2xl font-extrabold text-white tracking-wider font-mono">
                  {formData.code || 'CODE_PREFIX'}
                </div>
                
                <div className="text-xl font-bold text-emerald-400">
                  {formData.discountType === 'percentage' && `Giảm ${formData.discountValue}%`}
                  {formData.discountType === 'fixed' && `Giảm ${formData.discountValue.toLocaleString()} đ`}
                  {formData.discountType === 'shipping' && `Freeship ${formData.discountValue.toLocaleString()} đ`}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  {formData.name || 'Tên voucher chưa nhập...'}
                </p>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Đơn tối thiểu:</span>
                  <span className="font-semibold text-slate-200">
                    {formData.minOrderValue ? `${formData.minOrderValue.toLocaleString()} đ` : '0 đ'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Thời hạn:</span>
                  <span className="font-semibold text-slate-200">{formData.endDate || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Card: Thời gian áp dụng */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Calendar className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Thời gian hiệu lực</h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Card: Đối tượng áp dụng */}
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <ShieldCheck className="w-5 h-5 text-slate-700" />
                <h2 className="text-base font-bold text-slate-900">Phạm vi áp dụng</h2>
              </div>

              <div className="space-y-2">
                {[
                  { id: 'all_products', label: 'Tất cả sản phẩm' },
                  { id: 'categories', label: 'Danh mục cụ thể' },
                  { id: 'vip_users', label: 'Khách hàng thân thiết (VIP)' },
                ].map((item) => (
                  <label 
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="radio"
                      name="applyTo"
                      value={item.id}
                      checked={formData.applyTo === item.id}
                      onChange={(e) => handleChange('applyTo', e.target.value)}
                      className="text-slate-900 focus:ring-slate-900"
                    />
                    <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

          </div>

        </div>
      </form>
    </div>
  );
}

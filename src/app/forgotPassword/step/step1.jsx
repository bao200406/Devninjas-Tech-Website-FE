import React, { useState } from 'react';
import { ArrowLeft, Lock } from 'lucide-react';
import { forgotPassword } from '../../../services/authService'; // Import service đã tạo

const Step1 = ({ nextStep, setFormData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
     const emailValue = e.target.email.value;
      
      // Gọi API gửi email
      await forgotPassword(emailValue); 
      
      // LƯU VÀO LOCALSTORAGE ĐỂ SỬ DỤNG CHO CÁC BƯỚC SAU
      localStorage.setItem("reset_email", emailValue);
      
      nextStep(); // Chuyển sang bước 2 nếu thành công
    } catch (err) {
      setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6">
        <Lock className="text-[#00477a]" size={24} />
      </div>
      
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Quên mật khẩu</h2>
      <p className="text-slate-500 mb-8 text-sm">Nhập email để nhận mã xác thực.</p>

      {/* Hiển thị lỗi nếu có */}
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <div className="text-left mb-6">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Thông tin liên hệ
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-slate-400">@</span>
          <input 
            name="email" // Quan trọng: Đặt name để lấy giá trị qua e.target.email.value
            type="email"
            required
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00477a] transition-all"
            placeholder="Nhập email của bạn"
            onChange={(e) => setFormData({ email: e.target.value })}
          />
        </div>
      </div>

      <button 
        type="submit"
        disabled={loading} // Vô hiệu hóa nút khi đang chờ API
        className="w-full py-3 bg-[#00477a] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors mb-6 disabled:opacity-50"
      >
        {loading ? "Đang gửi..." : "Tiếp tục"}
      </button>

      <a href="/login" className="flex items-center justify-center text-sm font-semibold text-[#00477a] gap-2">
        <ArrowLeft size={16} /> Quay lại đăng nhập
      </a>
    </form>
  );
};

export default Step1;
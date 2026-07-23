"use client";
import React, { useState } from 'react';
import Sidebar from '../../components/account/Sidebar'; // Sidebar bạn đã tách
import { changePassword } from '../../services/authService'; // Service của bạn
import { useAuth } from "../../context/AuthContext";

const ChangePasswordPage = () => {
    const { user } = useAuth();
  const [passwords, setPasswords] = useState({ 
    oldPassword: '', 
    newPassword: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

 const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: "Mật khẩu mới không khớp!" });
      return;
    }

    setLoading(true);
    try {
      // Gọi trực tiếp, không cần lấy userId từ localStorage
      await changePassword(passwords.oldPassword, passwords.newPassword);
      
      setMessage({ type: 'success', text: "Đổi mật khẩu thành công!" });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || "Lỗi khi đổi mật khẩu" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-6 p-6 bg-gray-50 min-h-screen">
      <Sidebar user={user} />
      
      <main className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Thay đổi mật khẩu</h2>
        
        {message.text && (
          <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl">
          {message.text && (
            <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* Mật khẩu hiện tại */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu hiện tại</label>
            <input 
              type="password" required 
              className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="••••••••"
              onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
            />
          </div>

          {/* Mật khẩu mới */}
          <div className="mb-6">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Mật khẩu mới</label>
            <input 
              type="password" required 
              className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="••••••••"
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
            />
            
            {/* Box chỉ báo độ mạnh */}
            <div className="mt-4 p-4 bg-[#F4F4F4] rounded-lg">
              <p className="text-[11px] text-gray-500 mb-3">Độ mạnh mật khẩu: <span className="font-semibold text-gray-700">Chưa nhập</span></p>
              <div className="grid grid-cols-2 gap-y-2 text-[11px] text-gray-600">
                <div className="flex items-center gap-2"><span>○</span> Tối thiểu 8 ký tự</div>
                <div className="flex items-center gap-2"><span>○</span> 1 chữ hoa</div>
                <div className="flex items-center gap-2"><span>○</span> 1 chữ thường</div>
                <div className="flex items-center gap-2"><span>○</span> 1 chữ số</div>
                <div className="flex items-center gap-2"><span>○</span> 1 ký tự đặc biệt</div>
              </div>
            </div>
          </div>

          {/* Xác nhận mật khẩu mới */}
          <div className="mb-8">
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Xác nhận mật khẩu mới</label>
            <input 
              type="password" required 
              className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none focus:ring-1 focus:ring-gray-300"
              placeholder="••••••••"
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
            />
          </div>

          {/* Nút bấm */}
          <button 
            disabled={loading} 
            className="bg-[#004A7C] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#003d66] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Đang xử lý..." : "🔒 Cập nhật mật khẩu"}
          </button>
        </form>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
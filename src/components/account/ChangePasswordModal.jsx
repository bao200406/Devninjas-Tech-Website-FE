"use client";
import React, { useState } from 'react';
import { changePassword } from '../../services/authService';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: "Mật khẩu mới không khớp!" });
      return;
    }
    setLoading(true);
    try {
      await changePassword(passwords.oldPassword, passwords.newPassword);
      setMessage({ type: 'success', text: "Đổi mật khẩu thành công!" });
      setTimeout(() => { onClose(); }, 2000);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || "Lỗi khi đổi mật khẩu" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
        
        <h2 className="text-xl font-bold mb-6">Đổi mật khẩu</h2>
        
        {message.text && (
          <div className={`p-3 mb-4 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Mật khẩu hiện tại</label>
              <input type="password" required className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none" onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Mật khẩu mới</label>
              <input type="password" required className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none" onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-2">Xác nhận mật khẩu mới</label>
              <input type="password" required className="w-full p-3 bg-[#F4F4F4] rounded-lg outline-none" onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />
            </div>
          </div>
          
          <button disabled={loading} className="w-full mt-6 bg-[#004A7C] text-white py-3 rounded-lg font-bold hover:bg-[#003d66]">
            {loading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
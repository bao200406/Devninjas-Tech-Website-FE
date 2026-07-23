import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '../../../services/authService'; 

const Step3 = ({ nextStep, email, setFormData }) => { // Bổ sung email vào props
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requirements = [
    { label: 'Tối thiểu 8 ký tự', regex: /.{8,}/ },
    { label: 'Ít nhất một chữ hoa', regex: /[A-Z]/ },
    { label: 'Ít nhất một chữ thường', regex: /[a-z]/ },
    { label: 'Ít nhất một chữ số', regex: /[0-9]/ },
    { label: 'Ký tự đặc biệt (!@#$%...)', regex: /[^A-Za-z0-9]/ },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Kiểm tra mật khẩu khớp nhau
    if (password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp.');
        return;
    }

    // 2. Lấy email từ localStorage (thay vì truyền qua props)
    const email = localStorage.getItem("reset_email");
    if (!email) {
        setError("Không tìm thấy email, vui lòng quay lại bước 1.");
        return;
    }

    setLoading(true);
    try {
        // 3. Gọi API với email từ storage và mật khẩu mới
        await resetPassword(email, password); 
        
        // 4. Cập nhật state (tùy chọn) và chuyển bước
        setFormData({ newPassword: password });
        
        // 5. XÓA DỮ LIỆU TẠM sau khi đổi mật khẩu thành công
        localStorage.removeItem("reset_email");
        
        nextStep();
    } catch (err) {
        setError(err.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mx-auto mb-6">
        <Lock className="text-[#00477a]" size={24} />
      </div>
      
      <h2 className="text-xl font-bold text-slate-900 mb-2">Tạo mật khẩu mới</h2>
      <p className="text-slate-500 mb-6 text-sm">Tạo mật khẩu mới để bảo vệ tài khoản của bạn.</p>

      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="text-left space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mật khẩu mới</label>
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00477a]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-slate-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Xác nhận mật khẩu</label>
          <input 
            type="password" 
            className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00477a]" 
            placeholder="••••••••" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div className="bg-slate-50 p-4 rounded-lg space-y-2">
          <p className="text-xs font-bold text-slate-700 mb-2">Yêu cầu bảo mật:</p>
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 size={14} className={req.regex.test(password) ? "text-green-500" : "text-slate-300"} />
              {req.label}
            </div>
          ))}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-[#00477a] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
        </button>
      </form>
    </div>
  );
};

export default Step3;
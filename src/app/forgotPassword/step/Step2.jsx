import React, { useState, useRef } from 'react';
import { Clock } from 'lucide-react';
import { verifyOtp } from '../../../services/authService'; // Import service

const Step2 = ({ nextStep, email, setFormData }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Cập nhật giá trị OTP vào formData tổng
    setFormData({ otp: newOtp.join("") });

    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Lấy email từ storage
    const email = localStorage.getItem("reset_email");

    if (!email) {
        setError("Không tìm thấy email, vui lòng quay lại bước 1.");
        setLoading(false);
        return;
    }

    try {
        const otpValue = otp.join(""); // Đã bổ sung khai báo otpValue
        
        // Gọi API với email từ storage
        await verifyOtp(email, otpValue); 
        
        // Chỉ gọi nextStep() 1 lần duy nhất
        nextStep();
    } catch (err) {
        setError(err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.");
    } finally {
        setLoading(false);
    }
};

  return (
    <form onSubmit={handleSubmit} className="text-center">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Xác thực tài khoản</h2>
      <p className="text-slate-500 mb-8 text-sm">Nhập mã xác thực đã được gửi tới email của bạn.</p>

      {/* Hiển thị lỗi */}
      {error && <p className="text-red-500 text-xs mb-4">{error}</p>}

      <div className="flex justify-center gap-2 mb-8">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength="1"
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-12 h-12 text-center text-xl font-bold bg-slate-100 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00477a]"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            required
          />
        ))}
      </div>

      <button 
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-[#00477a] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors mb-6 disabled:opacity-50"
      >
        {loading ? "Đang xác thực..." : "Xác nhận"}
      </button>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-slate-500 text-sm bg-slate-100 px-3 py-1 rounded-full">
          <Clock size={16} /> 01:30
        </div>
        <p className="text-sm text-slate-600">
          Bạn không nhận được mã? <button type="button" className="text-[#00477a] font-bold">Gửi lại mã</button>
        </p>
      </div>
    </form>
  );
};

export default Step2;
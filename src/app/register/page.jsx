"use client";

import { useState } from "react";
import { registerUser } from "../../services/authService"; // Import service bạn đã tạo
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  // 2. Hàm xử lý thay đổi dữ liệu
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3. Hàm xử lý khi nhấn Đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation cơ bản
    if (formData.password !== formData.confirmPassword) {
      return alert("Mật khẩu xác nhận không khớp!");
    }
    if (!formData.agreeTerms) {
      return alert("Bạn cần đồng ý với điều khoản sử dụng!");
    }

    setIsLoading(true);
    try {
      await registerUser(formData);
      alert("Đăng ký tài khoản thành công!");
      // Có thể chuyển hướng: window.location.href = "/login";
    } catch (error) {
      alert(error.response?.data?.message || "Đăng ký thất bại, vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5fb] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md bg-blue-700 flex items-center justify-center text-white font-bold">
            A
          </div>

          <h2 className="text-2xl font-bold text-blue-700">
            Azure Logic
          </h2>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Tạo tài khoản
        </h1>

        <p className="text-gray-500 mb-8">
          Tham gia ngay để trải nghiệm mua sắm tiện lợi
        </p>


        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-semibold mb-2">HỌ VÀ TÊN</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4">
              <FaUser className="text-gray-400" />
              <input
                name="name"
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full bg-transparent px-3 py-4 outline-none"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">EMAIL</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4">
              <FaEnvelope className="text-gray-400" />
              <input
                name="email"
                type="email"
                placeholder="email@vi-du.com"
                className="w-full bg-transparent px-3 py-4 outline-none"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* SĐT */}
          <div>
            <label className="block text-sm font-semibold mb-2">SỐ ĐIỆN THOẠI</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4">
              <FaPhone className="text-gray-400" />
              <input
                name="phone"
                type="text"
                placeholder="0901234567"
                className="w-full bg-transparent px-3 py-4 outline-none"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">MẬT KHẨU</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4">
              <FaLock className="text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-transparent px-3 py-4 outline-none"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">XÁC NHẬN MẬT KHẨU</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4">
              <FaShieldAlt className="text-gray-400" />
              <input
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-transparent px-3 py-4 outline-none"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-2 text-sm text-gray-600">
            <input 
              name="agreeTerms"
              type="checkbox" 
              className="mt-1" 
              checked={formData.agreeTerms}
              onChange={handleChange} 
            />
            <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật</span>
          </label>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold transition"
          >
            Đăng ký tài khoản
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t"></div>

          <span className="px-4 text-gray-400 text-sm">
            HOẶC ĐĂNG KÝ VỚI
          </span>

          <div className="flex-1 border-t"></div>
        </div>

            <button className="w-full border border-gray-300 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
            <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5"
            />
            <span className="font-medium text-gray-700">
                Google
            </span>
            </button>

        {/* Login */}
        <p className="text-center mt-8 text-gray-600">
          Đã có tài khoản?{" "}
          <a
            href="/login"
            className="text-blue-700 font-semibold"
          >
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
}
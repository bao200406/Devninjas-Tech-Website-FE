"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation"; // Hook điều hướng
import { loginUser } from "../../services/authService";
import { FaFacebookF } from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Hàm cập nhật state khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hàm xử lý đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
     await loginUser(formData);
      alert("Đăng nhập thành công!");
      router.push("/"); // Chuyển hướng về trang chủ hoặc dashboard
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại, kiểm tra lại thông tin!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f5fb] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold">
            A
          </div>

          <h2 className="text-2xl font-bold text-blue-700">
            Azure Logic
          </h2>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Đăng nhập
        </h1>

        <p className="text-gray-500 mb-8">
          Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng.
        </p>

        <form 
          onSubmit={handleSubmit} // Thêm sự kiện gửi form
          className="space-y-5"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              EMAIL / SỐ ĐIỆN THOẠI
            </label>

            <div className="flex items-center bg-gray-100 rounded-xl px-4">
              <FaEnvelope className="text-gray-400" />

              <input
                name="email" // Bắt buộc phải có để lấy dữ liệu
                type="text"
                value={formData.email} // Gắn giá trị từ state
                onChange={handleChange} // Xử lý thay đổi
                placeholder="your@email.com"
                className="w-full bg-transparent px-3 py-4 outline-none"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              MẬT KHẨU
            </label>

            <div className="flex items-center bg-gray-100 rounded-xl px-4">
              <FaLock className="text-gray-400" />

              <input
                name="password" // Bắt buộc phải có
                type={showPassword ? "text" : "password"}
                value={formData.password} // Gắn giá trị từ state
                onChange={handleChange} // Xử lý thay đổi
                placeholder="••••••••"
                className="w-full bg-transparent px-3 py-4 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="text-gray-500" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          {/* Remember */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" />
              Ghi nhớ đăng nhập
            </label>

            <a href="#" className="text-blue-700 font-medium">
              Quên mật khẩu?
            </a>
          </div>

          {/* Hiển thị lỗi */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading} // Vô hiệu hóa nút khi đang gửi request
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold transition disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t"></div>

          <span className="px-4 text-gray-400 text-sm">
            HOẶC TIẾP TỤC VỚI
          </span>

          <div className="flex-1 border-t"></div>
        </div>

        {/* Social Login */}
        <div className="flex justify-center">
          <button className="w-full border border-gray-300 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
            <FcGoogle size={22} />
            <span className="font-medium text-gray-700">
              Google
            </span>
          </button>
        </div>

        {/* Register */}
        <p className="text-center mt-8 text-gray-600">
          Chưa có tài khoản?{" "}
          <a
            href="/register"
            className="text-blue-700 font-semibold"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
}
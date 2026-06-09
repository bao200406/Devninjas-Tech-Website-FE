"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

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

        <form className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              EMAIL / SỐ ĐIỆN THOẠI
            </label>

            <div className="flex items-center bg-gray-100 rounded-xl px-4">
              <FaEnvelope className="text-gray-400" />

              <input
                type="text"
                placeholder="your@email.com"
                className="w-full bg-transparent px-3 py-4 outline-none"
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
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full bg-transparent px-3 py-4 outline-none"
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

            <a
              href="#"
              className="text-blue-700 font-medium"
            >
              Quên mật khẩu?
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold transition"
          >
            Đăng nhập
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
"use client";

import { useState, useEffect, Suspense } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner,
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { loginUser, googleLogin } from "../../services/authService"; // Đã import thêm googleLogin

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams(); // Dùng để bắt mã code từ Google trả về

  // Cấu hình Animation
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const loadingId = toast.loading("Đang xác thực...");

    try {
      const res = await loginUser(formData);
      
      if (!res) {
        throw new Error("Không nhận được phản hồi từ máy chủ");
      }

      const userRole = res.data?.user?.role;
      
      toast.update(loadingId, {
        render: "Đăng nhập thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });

      setTimeout(() => {
        if (userRole === "admin") {
          window.location.href = "/admin2/dashboard";
        } else {
          window.location.href = "/";
        }
      }, 1500);

    } catch (err) {
      toast.dismiss(loadingId);
      
      const errorMessage = err.response?.data?.message || err.message || "Đăng nhập thất bại!";
      toast.error(errorMessage);
      
      setLoading(false);
    }
  };

  // 1. Xử lý khi bấm nút Google: chuyển hướng sang trang đăng nhập của Google
  const handleGoogleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
    
   const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=email%20profile&prompt=select_account`;
    
    window.location.href = googleAuthUrl;
  };

  // 2. Tự động bắt mã 'code' khi Google redirect ngược lại trang login này
  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      const handleGoogleCallback = async () => {
        const loadingId = toast.loading("Đang xử lý đăng nhập Google...");
        try {
          const res = await googleLogin(code);

          if (!res) {
            throw new Error("Không nhận được phản hồi từ máy chủ");
          }

          const userRole = res.data?.user?.role;

          toast.update(loadingId, {
            render: "Đăng nhập Google thành công!",
            type: "success",
            isLoading: false,
            autoClose: 2000,
          });

          setTimeout(() => {
            if (userRole === "admin") {
              window.location.href = "/admin2/dashboard";
            } else {
              window.location.href = "/";
            }
          }, 1500);

        } catch (err) {
          toast.dismiss(loadingId);
          const errorMessage = err.response?.data?.message || err.message || "Đăng nhập Google thất bại!";
          toast.error(errorMessage);
          // Xóa param code trên URL nếu muốn (tuỳ chọn) bằng cách replace state
          router.replace('/login');
        }
      };

      handleGoogleCallback();
    }
  }, [searchParams, router]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="min-h-screen bg-[#f3f5fb] flex items-center justify-center px-4"
    >
      <motion.div 
        variants={containerVariants} initial="hidden" animate="visible"
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold">A</div>
          <h2 className="text-2xl font-bold text-blue-700">Azure Logic</h2>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-2">Đăng nhập</motion.h1>
        <motion.p variants={itemVariants} className="text-gray-500 mb-8">Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng.</motion.p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2">EMAIL / SỐ ĐIỆN THOẠI</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <FaEnvelope className="text-gray-400" />
              <input name="email" type="text" value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full bg-transparent px-3 py-4 outline-none" required />
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2">MẬT KHẨU</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <FaLock className="text-gray-400" />
              <input name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} placeholder="••••••••" className="w-full bg-transparent px-3 py-4 outline-none" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" /> Ghi nhớ đăng nhập</label>
            <a href="/forgotPassword" className="text-blue-700 font-medium">Quên mật khẩu?</a>
          </motion.div>

          <motion.button
            variants={itemVariants}
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold transition disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? <><FaSpinner className="animate-spin" /> Đang xử lý...</> : "Đăng nhập"}
          </motion.button>
        </form>

        <motion.div variants={itemVariants} className="flex items-center my-6">
          <div className="flex-1 border-t"></div>
          <span className="px-4 text-gray-400 text-sm">HOẶC TIẾP TỤC VỚI</span>
          <div className="flex-1 border-t"></div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-center">
          {/* Đã thêm sự kiện onClick vào nút Google */}
          <button 
            type="button" 
            onClick={handleGoogleClick}
            className="w-full border border-gray-300 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-gray-700">Google</span>
          </button>
        </motion.div>

        <motion.p variants={itemVariants} className="text-center mt-8 text-gray-600">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-blue-700 font-semibold">Đăng ký ngay</a>
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f5fb] flex items-center justify-center"><FaSpinner className="animate-spin text-blue-700 text-3xl" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
"use client";

import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSpinner, // Thêm icon spinner
} from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Thêm animation
import { toast } from "react-toastify"; // Dùng toast thay alert
import { loginUser } from "../../services/authService";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      await loginUser(formData);
      toast.update(loadingId, {
        render: "Đăng nhập thành công!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      setTimeout(() => router.push("/"), 1500);
    } catch (err) {
      toast.dismiss(loadingId);
      toast.error(err.response?.data?.message || "Đăng nhập thất bại, kiểm tra lại thông tin!");
      setLoading(false);
    }
  };

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
            <a href="#" className="text-blue-700 font-medium">Quên mật khẩu?</a>
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
          <button className="w-full border border-gray-300 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
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
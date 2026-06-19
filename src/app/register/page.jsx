"use client";

import { useState } from "react";
import { registerUser } from "../../services/authService"; // Import service bạn đã tạo
import { motion, AnimatePresence } from "framer-motion"; // Import này
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaShieldAlt,
  FaEye,
  FaEyeSlash,
  FaGoogle,
  FaSpinner
} from "react-icons/fa";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [error, setError] = useState(""); 

  const initialForm = {
    name: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: false,
  };

  // 1. State quản lý dữ liệu form
  const [formData, setFormData] = useState(initialForm);

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
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }
    if (!formData.agreeTerms) {
      toast.error("Bạn cần đồng ý với điều khoản sử dụng!");
      return;
    }

    setIsLoading(true);

    // React Toastify hiển thị loading với progress bar tự động
    const loadingId = toast.loading("Đang tạo tài khoản...");
    try {
      await registerUser(formData);
      // Cập nhật từ loading sang success
      toast.update(loadingId, {
        render: "Đăng ký thành công!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // 2. TẠM DỪNG: Đợi 1.5 giây để người dùng đọc thông báo và cảm nhận sự thành công
      setTimeout(() => {
        // 3. Clear form trước khi chuyển trang để khi quay lại không bị sót dữ liệu
        setFormData(initialForm); 
        router.push(`/login`);
      }, 1500);

    } catch (error) {
      toast.dismiss(loadingId); // Tắt toast loading
      // Thất bại
      toast.update(loadingId, {
      render: error.response?.data?.message || "Đăng ký thất bại!",
      type: "error",
      isLoading: false,
      autoClose: 3000,
    });
    } finally {
      setIsLoading(false);
    }
  };

  // Các biến cấu hình animation
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };

  return (
    <div className="min-h-screen bg-[#f3f5fb] flex items-center justify-center px-4 py-10">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
      >
        {/* Logo & Heading */}
        <motion.div variants={itemVariants} className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md bg-blue-700 flex items-center justify-center text-white font-bold">A</div>
          <h2 className="text-2xl font-bold text-blue-700">Azure Logic</h2>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl font-bold text-gray-900 mb-2">Tạo tài khoản</motion.h1>
        <motion.p variants={itemVariants} className="text-gray-500 mb-8">Tham gia ngay để trải nghiệm mua sắm tiện lợi</motion.p>

        {/* Error Notification */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto', x: [0, -5, 5, -5, 0] }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-5 border border-red-200"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Các Input Fields */}
          {[
            { label: "HỌ VÀ TÊN", name: "name", type: "text", icon: FaUser, placeholder: "Nguyễn Văn A" },
            { label: "EMAIL", name: "email", type: "email", icon: FaEnvelope, placeholder: "email@vi-du.com" },
            { label: "SỐ ĐIỆN THOẠI", name: "phone", type: "text", icon: FaPhone, placeholder: "0901234567" },
          ].map((field, idx) => (
            <motion.div variants={itemVariants} key={idx}>
              <label className="block text-sm font-semibold mb-2">{field.label}</label>
              <div className="flex items-center bg-gray-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                <field.icon className="text-gray-400" />
                <input
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full bg-transparent px-3 py-4 outline-none"
                  value={formData[field.name]}
                  onChange={handleChange}
                  required
                />
              </div>
            </motion.div>
          ))}

          {/* Password Fields */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2">MẬT KHẨU</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <FaLock className="text-gray-400" />
              <input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full bg-transparent px-3 py-4 outline-none" value={formData.password} onChange={handleChange} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}</button>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold mb-2">XÁC NHẬN MẬT KHẨU</label>
            <div className="flex items-center bg-gray-100 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
              <FaShieldAlt className="text-gray-400" />
              <input name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="••••••••" className="w-full bg-transparent px-3 py-4 outline-none" value={formData.confirmPassword} onChange={handleChange} required />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}</button>
            </div>
          </motion.div>

          <motion.label variants={itemVariants} className="flex items-start gap-2 text-sm text-gray-600">
            <input name="agreeTerms" type="checkbox" className="mt-1" checked={formData.agreeTerms} onChange={handleChange} required />
            <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật</span>
          </motion.label>

          <motion.button
            variants={itemVariants}
            whileHover={!isLoading ? { scale: 1.01 } : {}}
            whileTap={!isLoading ? { scale: 0.99 } : {}}
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin text-lg" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              "Đăng ký tài khoản"
            )}
          </motion.button>
        </form>

        {/* Divider & Google Login */}
        <motion.div variants={itemVariants} className="flex items-center my-6">
          <div className="flex-1 border-t"></div>
          <span className="px-4 text-gray-400 text-sm">HOẶC ĐĂNG KÝ VỚI</span>
          <div className="flex-1 border-t"></div>
        </motion.div>

        <motion.button variants={itemVariants} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} className="w-full border border-gray-300 rounded-xl py-4 flex items-center justify-center gap-3 hover:bg-gray-50 transition">
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span className="font-medium text-gray-700">Google</span>
        </motion.button>

        <motion.p variants={itemVariants} className="text-center mt-8 text-gray-600">
          Đã có tài khoản? <a href="/login" className="text-blue-700 font-semibold">Đăng nhập</a>
        </motion.p>
      </motion.div>
    </div>
  );
}
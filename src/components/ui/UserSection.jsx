"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, LogOut, ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Bổ sung import này
import { useAuth } from '@/context/AuthContext';

export default function UserSection() {
  // Bổ sung 'logout' vào đây
  const { user, setUser, logout } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter(); // Khởi tạo router

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Hàm xử lý logout
  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    router.push('/login'); // Điều hướng sau khi logout
  };

  if (!user) {
    return (
      <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition-colors font-medium">
        <User size={20} />
        <span className="hidden lg:block text-sm">Đăng nhập</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Nút Avatar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-50 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-gray-200"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-xs shadow-md">
          {user.name?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-semibold text-gray-700 hidden lg:block">{user.name?.split(' ')[0]}</span>
        <ChevronDown size={14} className={`text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-0 top-full mt-3 w-60 bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 p-2 z-50 overflow-hidden"
          >
            <div className="px-3 py-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Tài khoản của tôi</p>
              <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            <div className="h-px bg-gray-100 my-2" />

            <Link href="/account" className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-gray-700 hover:text-blue-700 transition-colors">
              <Settings size={18} /> Cài đặt tài khoản
            </Link>
            <Link href="/orders" className="flex items-center gap-3 px-3 py-2.5 hover:bg-blue-50 rounded-xl text-gray-700 hover:text-blue-700 transition-colors">
              <Package size={18} /> Đơn hàng của tôi
            </Link>

            <div className="h-px bg-gray-100 my-2" />

            <button 
              onClick={handleLogout} // Đã cập nhật gọi hàm xử lý
              className="flex w-full items-center gap-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
            >
              <LogOut size={18} /> Đăng xuất
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
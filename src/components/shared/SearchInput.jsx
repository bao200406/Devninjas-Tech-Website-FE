"use client";

import React, { useState, useEffect } from "react";
import { Search, X, Command } from "lucide-react";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Tìm kiếm nhanh...",
  onClear,
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Hiệu ứng phím tắt: Nhấn "/" để focus vào ô tìm kiếm (giống Github/Youtube)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && document.activeElement.tagName !== "INPUT") {
        e.preventDefault();
        document.getElementById("admin-search").focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="relative group w-full max-w-md" ref={null}>
      {/* Icon kính lúp - Đổi màu khi focus */}
      <div
        className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
          isFocused ? "text-admin-accent" : "text-gray-500"
        }`}
      >
        <Search size={18} strokeWidth={2.5} />
      </div>

      {/* Ô Input chính */}
      <input
        id="admin-search"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className={`
          w-full py-2.5 pl-11 pr-12 text-sm bg-gray-900/40 
          border border-white/10 rounded-xl outline-none
          transition-all duration-300 ease-out
          placeholder:text-gray-600 text-gray-200
          ${
            isFocused
              ? "border-admin-accent/50 bg-gray-900/80 shadow-[0_0_20px_rgba(var(--admin-accent-rgb),0.1)] ring-1 ring-admin-accent/20"
              : "hover:border-white/20"
          }
        `}
      />

      {/* Nhãn phím tắt hoặc Nút xóa */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {value ? (
          // Nút xóa nhanh khi có dữ liệu
          <button
            onClick={onClear}
            className="p-1 hover:bg-white/10 rounded-md text-gray-500 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        ) : (
          // Hiển thị gợi ý phím tắt khi ô trống (Kỹ thuật Apple UI)
          <div
            className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/10 bg-white/5 text-[10px] font-bold text-gray-500 transition-opacity duration-300 ${isFocused ? "opacity-0" : "opacity-100"}`}
          >
            <span className="text-[8px]">/</span>
          </div>
        )}
      </div>
    </div>
  );
}

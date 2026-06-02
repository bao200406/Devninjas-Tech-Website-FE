"use client";

import { useState } from "react";
import CategoryActions from "./CategoryActions";
import { getAllCategories } from "../../services/categoryService";
export default function HeaderContentCategory({ data }) {
  const [categories, setCategories] = useState(data);

  // 2. Hàm cập nhật lại dữ liệu (Refresh)
  const refreshData = async () => {
    try {
      const updatedData = await getAllCategories();
      setCategories(updatedData); // Cập nhật state khiến giao diện thay đổi ngay
    } catch (error) {
      console.error("Lỗi khi load lại dữ liệu:", error);
    }
  };

  return (
    <>
      {/* 1. Header & Quick Actions */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-white">Quản lý Danh mục</h1>
          <p className="text-admin-text-muted mt-2 text-sm">
            Tổ chức cây danh mục sản phẩm, tối ưu SEO và quản lý hiển thị trên
            Storefront.
          </p>
        </div>
        <CategoryActions refreshData={refreshData} />
      </div>
    </>
  );
}

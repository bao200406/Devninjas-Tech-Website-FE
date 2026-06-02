"use client";

import { useState } from "react";
import AddCategoryModal from "./AddModalCategories";

export default function CategoryActions({ refreshData }) {
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-gray-800 border border-admin-border rounded-lg text-sm font-medium hover:bg-gray-700 transition-all">
          Xuất báo cáo
        </button>
        <button
          className="btn-accent shadow-[0_0_20px_rgba(34,211,238,0.3)] px-6 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsModal(true)}
        >
          <span className="text-xl">+</span>
          Thêm danh mục mới
        </button>
      </div>

      <AddCategoryModal
        isOpen={isModal}
        onClose={() => setIsModal(false)}
        onSave={refreshData}
      />
    </>
  );
}

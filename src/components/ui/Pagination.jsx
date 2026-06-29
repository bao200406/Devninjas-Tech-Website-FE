import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  // Tạo mảng các trang để render (ví dụ: chỉ hiện 3 trang đầu và trang cuối)
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mt-10 gap-4">
      <p className="text-gray-500 text-sm text-center md:text-left">
        Hiển thị trang <span className="font-bold text-gray-900">{currentPage}</span> trên <span className="font-bold text-gray-900">{totalPages}</span>
      </p>

      <div className="flex items-center gap-2">
        {/* Nút Prev */}
        <button 
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft size={18} />
        </button>
        
        {/* Render danh sách số trang */}
        {pages.map((page) => (
          <button 
            key={page} 
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-lg font-medium transition-all ${
              page === currentPage 
                ? "bg-blue-900 text-white shadow-md" 
                : "border border-gray-200 bg-white hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Nút Next */}
        <button 
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
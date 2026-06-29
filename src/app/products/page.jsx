"use client";
import { useState } from "react"; // Bổ sung: Import useState
import FilterSidebar from "../../components/CategoryProductCard/FilterSidebar";
import CategoryProductCard from "../../components/CategoryProductCard/ProductList";
import Pagination from "../../components/ui/Pagination";
import { X, ChevronDown, LayoutGrid, List, ChevronLeft, ChevronRight, Menu, Filter } from "lucide-react"; // Bổ sung: Thêm icon Filter

export default function ProductsPage() {
  // Bổ sung: State để quản lý trạng thái đóng/mở sidebar trên mobile
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="bg-app-bg min-h-screen p-4 md:p-8">

      {/* Container: Sử dụng flex-col trên mobile, flex-row trên desktop */}
      <div className="container mx-auto flex flex-col lg:flex-row gap-8 flex-wrap">
        
        {/* Breadcrumb - Đã di chuyển vào trong container và chiếm trọn 100% chiều rộng để không bị lệch */}
        <div className="w-full text-sm text-gray-400 mb-2 flex items-center gap-1 overflow-x-auto whitespace-nowrap">
          <span className="hover:text-gray-600 cursor-pointer">Trang chủ</span>
          <span>›</span>
          <span className="hover:text-gray-600 cursor-pointer">Điện thoại</span>
          <span>›</span>
          <span className="text-gray-700 font-medium">iPhone</span>
        </div>
        
        {/* Bổ sung: Nút mở bộ lọc trên mobile */}
        <button 
          onClick={() => setIsFilterOpen(true)}
          className="lg:hidden flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-200 rounded-lg font-medium text-gray-700"
        >
          <Filter size={18} /> Lọc sản phẩm
        </button>

        {/* Sidebar: Ẩn trên mobile để tối ưu không gian, hiện trên lg */}
        {/* Bổ sung: Truyền state isOpen và hàm đóng onClose vào FilterSidebar */}
        <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
        </div>
        
        {/* Lớp Overlay cho mobile khi sidebar mở (để người dùng nhấn ra ngoài là đóng) */}
        {isFilterOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsFilterOpen(false)} />
        )}
        
        {/* Sidebar di động (render tách biệt để điều khiển trạng thái) */}
        <div className="lg:hidden">
          <FilterSidebar isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
        </div>

        {/* Nội dung chính */}
        <main className="flex-1 w-full">
            {/* Header danh mục */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            {/* Tiêu đề & Tag lọc */}
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-gray-900">iPhone</h1>
                    <span className="text-gray-500 text-sm">256 sản phẩm</span>
                </div>
                
                <div className="flex gap-2">
                {['Apple', 'Trên 20tr'].map((tag) => (
                    <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-900 text-xs font-medium rounded-full cursor-pointer hover:bg-blue-100 transition-colors">
                    {tag}
                    <X size={12} strokeWidth={2.5} />
                    </span>
                ))}
                </div>
            </div>

            {/* Bộ lọc sắp xếp & View mode */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between">
                <button className="flex items-center justify-between gap-4 sm:gap-8 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300">
                Mới nhất
                <ChevronDown size={16} className="text-gray-400" />
                </button>

                {/* View Switcher: Ẩn trên mobile nhỏ nếu cần */}
                <div className="hidden md:flex bg-gray-50 border border-gray-200 rounded-lg p-0.5">
                <button className="p-1.5 rounded bg-white text-blue-900 shadow-sm border border-gray-100">
                    <LayoutGrid size={18} />
                </button>
                <button className="p-1.5 rounded text-gray-400 hover:text-gray-600">
                    <List size={18} />
                </button>
                </div>
            </div>
            </div>

            {/* Grid sản phẩm: Thay đổi số cột theo màn hình */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map((item) => (
                <CategoryProductCard 
                key={item}
                name="iPhone 15 Pro Max 256GB - Titan Tự Nhiên"
                price="28.990.000đ"
                rating={5}
                reviews="42"
                tag="MỚI"
                />
            ))}
            </div>

            {/* Phân trang: Thay đổi bố cục theo thiết bị */}
            <Pagination />
        </main>
      </div>
    </div>
  );
}
"use client";
import { useState, useEffect, useRef } from "react";

// Hàm helper cập nhật xử lý URL chuẩn xác với cấu trúc backend của bạn
const getPublicUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;

  const cleanPath = path.replace(/\\/g, '/');

  // Nếu đường dẫn đã có sẵn chữ uploads
  if (cleanPath.includes('uploads')) {
    const index = cleanPath.indexOf('uploads');
    const relativePath = cleanPath.substring(index);
    return `https://devninjas-tech-website-be.onrender.com/${relativePath}`;
  }

  // Nếu đường dẫn có chứa thư mục con (ví dụ: products/filename.jpg)
  if (cleanPath.startsWith('products/')) {
    return `https://devninjas-tech-website-be.onrender.com/uploads/${cleanPath}`;
  }

  // Nếu backend chỉ trả về tên file thuần túy (ví dụ: products-1785150897541-852043014.jpg)
  return `https://devninjas-tech-website-be.onrender.com/uploads/products/${cleanPath}`;
};

export default function ProductGallery({ variants, selectedVariant }) {
  // 1. Lấy danh sách ảnh từ biến thể được chọn
  const variantImages = selectedVariant?.images?.length > 0 
    ? selectedVariant.images 
    : (selectedVariant?.image ? [selectedVariant.image] : []);
  
  const [activeImg, setActiveImg] = useState(variantImages[0]);
  const sliderRef = useRef(null);

  // 2. Cập nhật ảnh chính khi biến thể được chọn thay đổi
  useEffect(() => {
    if (variantImages.length > 0) {
      setActiveImg(variantImages[0]);
    }
  }, [selectedVariant, variantImages.length]); 

  // Hàm cuộn slider sang trái/phải
  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      // Cuộn một khoảng bằng đúng chiều rộng khung nhìn của slider
      const scrollAmount = clientWidth * 0.75; 
      sliderRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Khung ảnh lớn */}
      <div className="relative bg-[#f8f9fa] rounded-2xl aspect-square w-full flex items-center justify-center p-8 border border-gray-100/80">
        <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
          <span className="bg-[#005ba4] text-white text-[10px] font-bold px-3 py-1 rounded-md text-center tracking-wide">MỚI</span>
          <span className="bg-[#a34c00] text-white text-[10px] font-bold px-3 py-1 rounded-md text-center tracking-wide">BÁN CHẠY</span>
        </div>

        <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center">
          {activeImg ? (
           <img 
             src={getPublicUrl(activeImg)} 
             alt="Product" 
             className="w-full h-full object-contain" 
           />
          ) : (
            <div className="text-gray-400 text-sm font-medium">Đang tải ảnh...</div>
          )}
        </div>
      </div>

      {/* Hàng ảnh nhỏ dạng Slider (Chỉ hiện tối đa 4 cột trên giao diện, vượt quá sẽ cuộn) */}
      <div className="relative group">
        {/* Nút Prev (Chỉ hiện khi có nhiều hơn 4 ảnh) */}
        {variantImages.length > 4 && (
          <button 
            onClick={() => scrollSlider('left')}
            className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous"
          >
            ‹
          </button>
        )}

        {/* Khung chứa các ảnh nhỏ, ẩn thanh cuộn mặc định bằng scrollbar-none */}
        <div 
          ref={sliderRef}
          className="flex gap-3.5 overflow-x-auto scrollbar-none scroll-smooth pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {variantImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImg(img)}
              className={`flex-shrink-0 w-[calc(25%-10.5px)] aspect-square border rounded-xl overflow-hidden p-1 transition-all bg-white flex items-center justify-center ${
                activeImg === img 
                  ? "border-[#005ba4] ring-2 ring-[#005ba4]/10" 
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <img 
                src={getPublicUrl(img)} 
                alt={`Thumb ${idx + 1}`} 
                className="w-full h-full object-cover rounded-lg" 
              />
            </button>
          ))}
        </div>

        {/* Nút Next (Chỉ hiện khi có nhiều hơn 4 ảnh) */}
        {variantImages.length > 4 && (
          <button 
            onClick={() => scrollSlider('right')}
            className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 bg-white border border-gray-200 shadow-md rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}
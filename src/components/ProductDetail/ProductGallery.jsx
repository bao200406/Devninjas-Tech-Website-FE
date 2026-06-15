import { useState, useEffect } from "react";

export default function ProductGallery({ variants }) {
  // 1. Trích xuất mảng từ thuộc tính 'data' (Dựa trên log của bạn)
  const variantList = variants?.data || [];
  
  // 2. Logic lấy ảnh từ biến thể đầu tiên
  const activeVariant = variantList.length > 0 ? variantList[0] : null;
  const variantImages = activeVariant?.images?.length > 0 
    ? activeVariant.images 
    : (activeVariant?.image ? [activeVariant.image] : []);
  
  const [activeImg, setActiveImg] = useState(variantImages[0]);

  // 3. Cập nhật ảnh chính khi variantList thay đổi
  useEffect(() => {
    if (variantImages.length > 0) {
      setActiveImg(variantImages[0]);
    }
  }, [variants]); // Theo dõi object variants để khi dữ liệu về thì update lại

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
            <img src={activeImg} alt="Product" className="w-full h-full object-contain" />
          ) : (
            <div className="text-gray-400 text-sm font-medium">Đang tải ảnh...</div>
          )}
        </div>
      </div>

      {/* Hàng ảnh nhỏ */}
      <div className="grid grid-cols-4 gap-3.5">
        {variantImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImg(img)}
            className={`aspect-square w-full border rounded-xl overflow-hidden p-1 transition-all bg-white flex items-center justify-center ${
              activeImg === img 
                ? "border-[#005ba4] ring-2 ring-[#005ba4]/10" 
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover rounded-lg" />
          </button>
        ))}
      </div>
    </div>
  );
}
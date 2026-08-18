import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

// Hàm hỗ trợ xử lý URL ảnh public
const getPublicUrl = (path) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;
  const index = path.indexOf('uploads');
  if (index === -1) return path;
  const relativePath = path.substring(index).replace(/\\/g, '/');
  return `https://devninjas-tech-website-be-1.onrender.com/${relativePath}`;
};

export function ProductVariantPopover({ currentSelection, variants, onSelect, onOpen }) {
  useEffect(() => {
    console.log("DEBUG: Popover của sản phẩm", currentSelection?.productId, "nhận được variants:", variants);
  }, [variants]);

  return (
    <Popover onOpenChange={(open) => { if (open) onOpen(); }}>
      <PopoverTrigger asChild>
        <div className="inline-flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 -ml-2 rounded-md transition mt-1 text-[#6e6e73]">
          <p className="text-[14px]">
            {currentSelection?.variantName || "Chọn phiên bản"}
          </p>
          <ChevronDown size={14} />
        </div>
      </PopoverTrigger>
      
      {/* Thêm bg-white, shadow-xl và border rõ ràng để khắc phục triệt để lỗi nền trong suốt */}
      <PopoverContent className="w-[320px] p-2.5 z-[9999] bg-white border border-gray-200 shadow-xl rounded-xl" align="start" sideOffset={8}>
        <div className="flex flex-col gap-1.5">
          <p className="text-[12px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
            Chọn phiên bản khác
          </p>
          
          {variants && variants.length > 0 ? (
            variants.map((v) => {
              const isSelected = v._id === currentSelection?.variantId;
              
              // Lấy chuỗi tên thuộc tính (Ví dụ: 16GB / 512GB SSD / Xám)
              const variantTitle = Array.isArray(v.attributes) 
                ? v.attributes.map(a => a.attributeValueId?.value || a.value).join(" / ")
                : "Cấu hình sản phẩm";

              return (
                <button
                  key={v._id}
                  type="button"
                  onClick={() => onSelect(v)}
                  className={`flex items-center gap-3 w-full text-left p-2.5 rounded-lg cursor-pointer transition ${
                    isSelected 
                      ? "bg-blue-50 border border-blue-200 text-[#0068b3]" 
                      : "hover:bg-gray-50 border border-transparent text-[#1d1d1f]"
                  }`}
                >
                  {/* Hiển thị hình ảnh biến thể */}
                  <div className="w-10 h-10 shrink-0 bg-gray-50 border border-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                    <img 
                      src={getPublicUrl(v.image)} 
                      alt={variantTitle} 
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Thông tin cấu hình và giá tiền */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-medium truncate ${isSelected ? "text-[#0068b3] font-bold" : "text-gray-800"}`}>
                      {variantTitle}
                    </p>
                    <span className="block text-[13px] font-semibold text-[#005fa9] mt-0.5">
                      {v.price?.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <p className="px-3 py-3 text-[14px] text-gray-400 italic text-center">
              Đang tải danh sách phiên bản...
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
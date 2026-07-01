import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";
export function ProductVariantPopover({ currentSelection, variants, onSelect, onOpen }) {

    useEffect(() => {
    console.log("DEBUG: Popover của sản phẩm", currentSelection?.productId, "nhận được variants:", variants);
  }, [variants]); // Log mỗi khi variants thay đổi
  return (
    // Sử dụng onOpenChange để gọi API chuẩn xác
    <Popover onOpenChange={(open) => { if (open) onOpen(); }}>
      <PopoverTrigger asChild>
        <div className="inline-flex items-center gap-1 cursor-pointer hover:bg-gray-100 px-2 py-1 -ml-2 rounded-md transition mt-1 text-[#6e6e73]">
          <p className="text-[14px]">
            {currentSelection?.variantName || "Chọn phiên bản"}
          </p>
          <ChevronDown size={14} />
        </div>
      </PopoverTrigger>
      
      <PopoverContent className="w-[300px] p-2 z-[9999]" align="start" sideOffset={8}>
        <div className="flex flex-col gap-1">
          <p className="text-[12px] font-bold text-gray-400 px-2 py-1 uppercase tracking-wider">
            Chọn phiên bản khác
          </p>
          
          {variants && variants.length > 0 ? (
           variants.map((v) => (
              <button
                key={v._id}
                onClick={() => onSelect(v)}
                className={`text-left px-3 py-2 text-[14px] rounded-md transition ${
                  v._id === currentSelection?.variantId 
                  ? "bg-blue-50 text-[#0068b3] font-medium" 
                  : "hover:bg-gray-50 text-[#1d1d1f]"
                }`}
              >
                {/* SỬA ĐOẠN NÀY ĐỂ DEBUG VÀ HIỂN THỊ ĐÚNG */}
                {Array.isArray(v.attributes) ? (
                  v.attributes.map(a => {
                    // Log thử để xem chính xác key chứa tên thuộc tính là gì
                    // Nếu tên là 'value' thì nó phải hiện ra
                    return a.attributeValueId?.value || "N/A";
                  }).join(" / ")
                ) : "Cấu hình sản phẩm"}
                
                <span className="block text-[12px] text-gray-500">
                  {v.price?.toLocaleString("vi-VN")}đ
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-[14px] text-gray-400 italic">
              Đang tải...
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
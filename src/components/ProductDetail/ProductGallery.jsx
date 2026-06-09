import { useState } from "react";

const images = [
  "/images/iphone-front.png",
  "/images/iphone-back.png",
  "/images/iphone-camera.png",
  "/images/iphone-hand.png"
];

export default function ProductGallery() {
  const [activeImg, setActiveImg] = useState(images[0]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Khung ảnh lớn tỉ lệ 1:1 hoàn hảo, tự co giãn chiếm trọn 100% cột bên trái */}
      <div className="relative bg-[#f8f9fa] rounded-2xl aspect-square w-full flex items-center justify-center p-8 border border-gray-100/80">
        <div className="absolute top-4 right-4 flex flex-col gap-1 z-10">
          <span className="bg-[#005ba4] text-white text-[10px] font-bold px-3 py-1 rounded-md text-center tracking-wide">MỚI</span>
          <span className="bg-[#a34c00] text-white text-[10px] font-bold px-3 py-1 rounded-md text-center tracking-wide">BÁN CHẠY</span>
        </div>

        {/* Khung render ảnh mẫu */}
        <div className="w-full h-full bg-gray-200/60 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
          Khung hiển thị ảnh lớn (Tự động dàn full cột trái)
        </div>
      </div>

      {/* Hàng 4 ảnh nhỏ dàn ngang khít với viền ảnh lớn bên trên */}
      <div className="grid grid-cols-4 gap-3.5">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImg(img)}
            className={`aspect-square w-full border rounded-xl overflow-hidden p-1 transition-all bg-white flex items-center justify-center ${
              activeImg === img 
                ? "border-[#005ba4] ring-2 ring-[#005ba4]/10" 
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className="w-full h-full bg-gray-50 rounded-lg flex items-center justify-center text-[10px] text-gray-400 font-medium">
              Thumb {idx + 1}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
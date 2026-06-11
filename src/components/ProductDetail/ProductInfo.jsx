import { useState } from "react";
import { Star, Heart, ArrowLeftRight, Truck, ShieldCheck, RefreshCw } from "lucide-react";

export default function ProductInfo() {
  const [color, setColor] = useState("titan");
  const [storage, setStorage] = useState("256GB");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-5.5 w-full">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight tracking-tight">
          iPhone 15 Pro Max 256GB - Titan Tự Nhiên
        </h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <div className="flex text-amber-500 items-center gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" className="stroke-none" />)}
            <span className="font-bold text-gray-900 ml-1">4.9</span>
          </div>
          <span className="text-gray-200">|</span>
          <span>1.2k đánh giá</span>
          <span className="text-gray-300">|</span>
          <span>Đã bán 2.4k</span>
        </div>
      </div>

      <div className="flex items-center gap-3 py-1">
        <span className="text-2xl font-bold text-[#005ba4]">27.490.000đ</span>
        <span className="text-sm text-gray-400 line-through">34.990.000đ</span>
        <span className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">-20%</span>
      </div>

      {/* Màu sắc */}
      <div>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Màu sắc</h3>
        <div className="flex items-center gap-2.5">
          {[{ id: "titan", bg: "bg-[#bebaa7]" }, { id: "blue", bg: "bg-[#2f4452]" }, { id: "black", bg: "bg-[#232426]" }, { id: "white", bg: "bg-[#e3e4e5]" }].map((item) => (
            <button
              key={item.id}
              onClick={() => setColor(item.id)}
              className={`w-6.5 h-6.5 rounded-full ${item.bg} relative transition-transform ${color === item.id ? "ring-1 ring-offset-2 ring-gray-900 scale-105" : "hover:scale-105"}`}
            />
          ))}
        </div>
      </div>

      {/* Dung lượng */}
      <div>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Dung lượng</h3>
        <div className="flex items-center gap-2">
          {["256GB", "512GB", "1TB"].map((cap) => (
            <button
              key={cap}
              onClick={() => setStorage(cap)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md border transition-all ${storage === cap ? "bg-[#005ba4] text-white border-[#005ba4]" : "bg-[#f1f3f5] text-gray-700 border-transparent hover:border-gray-300"}`}
            >
              {cap}
            </button>
          ))}
        </div>
      </div>

      {/* Bộ đếm số lượng */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-md h-9 bg-white">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 h-full text-gray-500 hover:bg-gray-50 text-sm">−</button>
          <span className="w-8 text-center text-xs font-bold text-gray-800">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="px-2.5 h-full text-gray-500 hover:bg-gray-50 text-sm">+</button>
        </div>
        <button className="p-2 border border-gray-200 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-all"><Heart size={16} /></button>
        <button className="p-2 border border-gray-200 rounded-md text-gray-400 hover:text-blue-500 hover:bg-gray-50 transition-all"><ArrowLeftRight size={16} /></button>
      </div>

      <div className="flex items-center gap-3 text-[11px] font-medium">
        <span className="flex items-center gap-1 text-[#00a862] bg-[#e6f6f0] px-2 py-0.5 rounded font-bold">
          <span className="w-1 h-1 rounded-full bg-[#00a862]" /> CÒN HÀNG
        </span>
        <span className="text-gray-500">📦 Chỉ còn 8 sản phẩm</span>
      </div>

      {/* Cụm nút mua hàng - Co giãn lấp đầy cột bên phải */}
      <div className="flex gap-3.5 mt-1 w-full">
        <button className="flex-1 py-3 border border-[#005ba4] text-[#005ba4] text-xs font-bold rounded-md hover:bg-blue-50/40 transition-colors">
          THÊM VÀO GIỎ HÀNG
        </button>
        <button className="flex-1 py-3 bg-[#005ba4] text-white text-xs font-bold rounded-md hover:bg-[#004b88] transition-colors shadow-sm">
          MUA NGAY
        </button>
      </div>

      {/* Cam kết chân trang tin - Giãn ngang sang biên phải */}
      <div className="grid grid-cols-3 gap-3 mt-2 w-full">
        <div className="flex flex-col items-center justify-center p-3.5 border border-gray-100 rounded-xl bg-[#fdfdfd] text-center">
          <Truck size={18} className="text-[#005ba4] mb-1" />
          <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wide leading-tight">Miễn phí vận chuyển</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3.5 border border-gray-100 rounded-xl bg-[#fdfdfd] text-center">
          <ShieldCheck size={18} className="text-[#005ba4] mb-1" />
          <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wide leading-tight">12 Tháng bảo hành</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3.5 border border-gray-100 rounded-xl bg-[#fdfdfd] text-center">
          <RefreshCw size={18} className="text-[#005ba4] mb-1" />
          <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wide leading-tight">Đổi trả trong 30 ngày</span>
        </div>
      </div>
    </div>
  );
}
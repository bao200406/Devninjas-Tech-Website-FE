import { Star, ShoppingCart } from "lucide-react";

export default function ProductList({ name, price, rating, reviews, tag }) {
  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col justify-between min-h-[420px]">
      
      {/* Khối phía trên: Badge + Ảnh + Rating + Tên */}
      <div className="flex flex-col gap-3">
        {/* Badge MỚI/GIẢM GIÁ/HOT */}
        {tag ? (
          <span className="bg-blue-900 text-white text-[11px] font-bold px-3 py-1 rounded inline-block self-start">
            {tag}
          </span>
        ) : (
          // Giữ khoảng trống bằng chiều cao badge nếu không có tag để tránh lệch hàng ảnh
          <div className="h-6" /> 
        )}

        {/* Khu vực ảnh */}
        <div className="h-48 sm:h-52 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden border border-gray-50">
          <span className="text-gray-300 text-xs sm:text-sm font-medium">Ảnh sản phẩm</span>
        </div>

        {/* Rating & Review count */}
        <div className="flex items-center gap-1.5">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="currentColor" className="text-amber-400 stroke-amber-400" />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">({reviews})</span>
        </div>

        {/* Tên sản phẩm - Giới hạn tối đa 2 dòng */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">
          {name} 
        </h3>
      </div>

      {/* Khối phía dưới: Giá cả + Nút bấm (Luôn được đẩy sát đáy nhờ mt-auto) */}
      <div className="flex flex-col mt-4 gap-3">
        {/* Khu vực giá tiền */}
        <div className="flex flex-col gap-0.5">
          <p className="text-base font-extrabold text-blue-900 leading-none">{price}</p>
          <p className="text-xs text-gray-400 line-through leading-none">32.990.000đ</p>
        </div>

        {/* Nút Thêm vào giỏ */}
        <button className="w-full py-2.5 bg-blue-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition-all active:scale-[0.98] shadow-sm">
          <ShoppingCart size={15} />
          THÊM VÀO GIỎ
        </button>
      </div>

    </div>
  );
}
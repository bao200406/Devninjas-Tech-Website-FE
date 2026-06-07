import { Star, ShoppingCart } from "lucide-react";

export default function ProductList({ name, price, rating, reviews, tag }) {
  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Badge MỚI/GIẢM GIÁ/HOT */}
      {tag && (
        <span className="bg-blue-900 text-white text-[11px] font-bold px-3 py-1 rounded mb-4 inline-block self-start">
          {tag}
        </span>
      )}

      {/* Khu vực ảnh - Tăng height để đúng chuẩn thiết kế "rộng" */}
      <div className="h-56 bg-gray-50 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
        <span className="text-gray-300 text-sm">Ảnh sản phẩm</span>
      </div>

      {/* Rating & Review count */}
      <div className="flex items-center gap-1.5 mb-2">
        <div className="flex text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="currentColor" />
          ))}
        </div>
        <span className="text-xs text-gray-400">({reviews})</span>
      </div>

      {/* Tên sản phẩm - Font đậm, size vừa phải */}
      <h3 className="text-sm font-bold text-gray-900 mb-4 h-10 leading-tight">
        {name}
      </h3>

      {/* Giá tiền - Size lớn, nổi bật */}
      <p className="text-base font-bold text-blue-900 mb-1">{price}</p>
      <p className="text-xs text-gray-400 line-through mb-4">32.990.000đ</p>

      {/* Nút Thêm vào giỏ - Dạng Icon + Text theo thiết kế trong hình */}
      <button className="w-full py-2.5 bg-blue-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors shadow-md">
        <ShoppingCart size={16} />
        THÊM VÀO GIỎ
      </button>
    </div>
  );
}
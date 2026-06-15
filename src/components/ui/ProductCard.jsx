import { Star, ShoppingCart } from "lucide-react";
import Link from "next/link"; // 1. Import Link

export default function ProductCard({
  id, // 2. Thêm prop id để nhận từ Section
  name,
  price,
  rating,
  tag,
  soldCount,
  image,
  showCart = false,
}) {
  const badgeColor = tag === "BÁN CHẠY" ? "bg-gray-900" : "bg-blue-900";

  return (
    // 3. Bọc toàn bộ card bằng thẻ Link. Sử dụng block để Link bao phủ toàn bộ diện tích
    <Link href={`/ProductsPage/${id}`} className="block h-full">
      <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
        
        {/* Hình ảnh - Thêm hiệu ứng hover zoom nhẹ */}
        <div className="relative h-40 mb-3 bg-gray-50 rounded-lg overflow-hidden group">
          {tag && (
            <span
              className={`absolute top-2 left-2 z-10 ${badgeColor} text-white text-[10px] px-2 py-1 rounded-md font-bold shadow-md`}
            >
              {tag}
            </span>
          )}

          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-gray-400 text-xs">Không có ảnh</span>
            </div>
          )}
        </div>

        {/* Rating & Sold */}
        <div className="flex items-center gap-1 text-yellow-500 mb-2">
          <Star size={14} fill="currentColor" />
          <span className="text-xs font-bold text-gray-700">{rating || 5}</span>
          {soldCount > 0 && (
            <span className="text-[10px] text-gray-400 ml-1">
              ({soldCount} đã bán)
            </span>
          )}
        </div>

        {/* Tên sản phẩm */}
        <h3 className="text-sm font-bold text-gray-900 line-clamp-2 mb-2 flex-grow">
          {name}
        </h3>

        {/* Giá & Giỏ hàng */}
        <div className="flex justify-between items-center mt-auto">
          <p className="text-blue-900 font-bold text-lg">
            {Number(price).toLocaleString("vi-VN")}₫
          </p>

          {showCart && (
            <button 
              className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300 shadow-sm"
              onClick={(e) => {
                e.preventDefault(); // Ngăn Link kích hoạt khi click vào nút giỏ hàng
                // Thêm logic thêm vào giỏ hàng ở đây
              }}
            >
              <ShoppingCart size={18} />
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}
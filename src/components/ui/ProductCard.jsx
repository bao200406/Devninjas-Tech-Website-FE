import { Star, ShoppingCart } from "lucide-react";

export default function ProductCard({ 
  name, 
  price, 
  rating, 
  tag, 
  soldCount, 
  showCart = false 
}) {
  // Logic chọn màu badge: Bán chạy là đen, Mới là xanh
  const badgeColor = tag === "BÁN CHẠY" ? "bg-gray-900" : "bg-blue-900";

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Badge */}
      {tag && (
        <span className={`${badgeColor} text-white text-[10px] px-2 py-0.5 rounded mb-2 inline-block font-bold`}>
          {tag}
        </span>
      )}
      
      {/* Hình ảnh */}
      <div className="h-40 flex items-center justify-center mb-4 bg-gray-50 rounded-lg">
        <span className="text-gray-400 text-xs">Ảnh sản phẩm</span>
      </div>

      {/* Thông tin Rating & Lượt bán */}
      <div className="flex items-center gap-1 text-yellow-500 mb-1">
        <Star size={14} fill="currentColor" />
        <span className="text-xs font-bold text-gray-700">{rating}</span>
        {soldCount && <span className="text-[10px] text-gray-400 ml-1">({soldCount} đã bán)</span>}
      </div>
      
      <h3 className="text-sm font-bold text-gray-900 truncate mb-2">{name}</h3>
      
      {/* Giá và Nút giỏ hàng */}
      <div className="flex justify-between items-center">
        <p className="text-blue-900 font-bold text-sm">{price}</p>
        
        {/* Chỉ hiển thị nút giỏ hàng khi showCart được truyền là true */}
        {showCart && (
            <button className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors duration-300 shadow-sm">
                <ShoppingCart size={18} />
            </button>
        )}
      </div>
    </div>
  );
}
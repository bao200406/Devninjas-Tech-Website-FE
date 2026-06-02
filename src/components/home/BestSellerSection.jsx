import { Star, ShoppingCart } from "lucide-react";

export default function BestSellerSection() {
  const products = [
    { name: "Sony XM5 Noise Cancelling", price: "8.490.000đ", rating: 5.0, sold: "1.2k+", tag: "BÁN CHẠY" },
    { name: "iPhone 15 Pro Max", price: "27.490.000đ", rating: 4.9, sold: "2.5k+" },
    { name: "Samsung Galaxy Watch", price: "6.990.000đ", rating: 4.8, sold: "800+" },
    { name: "MacBook Air M2 13\"", price: "18.990.000đ", rating: 5.0, sold: "1.1k+" },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <h2 className="text-xl font-bold text-gray-900 mb-8">SẢN PHẨM BÁN CHẠY</h2>

        {/* Lưới sản phẩm */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={index} className="group bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-2xl transition-all duration-300">
              {/* Badge Bán chạy */}
              {product.tag && (
                <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded mb-3 inline-block">
                  {product.tag}
                </span>
              )}

              {/* Ảnh sản phẩm (Placeholder) */}
              <div className="h-48 bg-gray-50 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-gray-300 text-sm">Ảnh sản phẩm</span>
              </div>

              {/* Đánh giá */}
              <div className="flex items-center gap-1 text-yellow-500 mb-2">
                <Star size={14} fill="currentColor" />
                <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                <span className="text-[10px] text-gray-400">({product.sold} đã bán)</span>
              </div>

              {/* Tên sản phẩm */}
              <h3 className="text-sm font-bold text-gray-900 mb-3 truncate">{product.name}</h3>

              {/* Giá và nút giỏ hàng */}
              <div className="flex justify-between items-center">
                <p className="text-blue-900 font-bold text-sm">{product.price}</p>
                <button className="p-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-blue-900 hover:text-white transition-colors">
                  <ShoppingCart size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
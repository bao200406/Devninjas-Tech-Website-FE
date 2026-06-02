import { Zap } from "lucide-react";

const products = [
  { name: "iPhone 15 Pro Max 256GB", price: "27.990.000đ", oldPrice: "34.990.000đ", rating: 4.9, discount: "-20%", img: "/phone.png" },
  { name: "MacBook Air M2 13\"", price: "18.525.000đ", oldPrice: "28.500.000đ", rating: 4.8, discount: "-35%", img: "/laptop.png" },
  { name: "Galaxy Watch 6", price: "6.366.500đ", oldPrice: "7.490.000đ", rating: 4.7, discount: "-15%", img: "/watch.png" },
  { name: "Sony XM5 Headphones", price: "5.394.000đ", oldPrice: "8.990.000đ", rating: 5.0, discount: "-40%", img: "/headphone.png" },
];

export default function FlashSaleSection() {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Container với Gradient Background */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Zap className="fill-white" />
              <h2 className="text-xl font-bold tracking-wide">FLASH SALE</h2>
              <div className="flex gap-2 text-xs">
                <span className="bg-black px-2 py-1 rounded">02</span>
                <span className="bg-black px-2 py-1 rounded">45</span>
                <span className="bg-black px-2 py-1 rounded">12</span>
              </div>
            </div>
            <button className="text-sm font-medium hover:underline">XEM TẤT CẢ</button>
          </div>

          {/* Grid Sản phẩm */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <div key={i} className="bg-white rounded-xl p-3 text-gray-900 relative">
                {/* Discount Badge */}
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                  {p.discount}
                </span>
                
                {/* Product Image */}
                <div className="h-32 flex items-center justify-center mb-2">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg" /> {/* Placeholder ảnh */}
                </div>
                
                {/* Info */}
                <div className="text-yellow-500 text-xs mb-1">★ {p.rating}</div>
                <h3 className="text-sm font-bold line-clamp-1">{p.name}</h3>
                <p className="text-gray-400 text-[10px] line-through">{p.oldPrice}</p>
                <p className="text-red-600 font-bold text-sm">{p.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getFlashSales } from "../../services/flashSaleService";

export default function FlashSaleSection() {
  const [flashSales, setFlashSales] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getFlashSales();
        if (res && res.data) setFlashSales(res.data);
      } catch (err) {
        console.error("Lỗi khi tải Flash Sale:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3">
              <Zap className="fill-white" />
              <h2 className="text-xl font-bold tracking-wide">FLASH SALE</h2>
              <div className="flex gap-2 text-xs">
                <span className="bg-black px-2 py-1 rounded">00</span>
                <span className="bg-black px-2 py-1 rounded">01</span>
                <span className="bg-black px-2 py-1 rounded">26</span>
              </div>
            </div>
            <button className="text-sm font-medium hover:underline">XEM TẤT CẢ</button>
          </div>

          {/* Grid Sản phẩm */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {flashSales.map((item) => {
              const progress = (item.soldQuantity / item.flashSaleQuantity) * 100;
              return (
                <div key={item._id} className="bg-white rounded-xl p-3 text-gray-900 relative shadow-sm hover:shadow-lg transition-shadow flex flex-col gap-y-2">
  
                {/* Discount Badge */}
                <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold z-10">
                  -{Math.round(((item.variantId.price - item.flashSalePrice) / item.variantId.price) * 100)}%
                </span>
                
                {/* Image: Thêm h-32 và flex center để căn giữa ảnh hoàn hảo */}
                <div className="h-32 flex items-center justify-center overflow-hidden">
                  <img 
                    src={item.productId.image} 
                    alt={item.productId.name} 
                    className="max-h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {/* Info: Nhóm Tên và Giá thành 1 khối để tránh bị tách rời */}
                <div className="flex flex-col gap-y-1">
                  <h3 className="text-sm font-bold line-clamp-2 leading-tight text-gray-800">
                    {item.productId.name}
                  </h3>
                  
                  <div className="flex items-baseline gap-x-2">
                    <p className="text-red-600 font-black text-sm">
                      {item.flashSalePrice.toLocaleString()}đ
                    </p>
                    <p className="text-gray-400 text-[10px] line-through">
                      {item.variantId.price.toLocaleString()}đ
                    </p>
                  </div>
                </div>

                {/* Progress Bar: Tự động nằm dưới nhờ flex-col */}
                <div className="w-full bg-red-200 rounded-full h-6 relative overflow-hidden mt-auto">
                  <div 
                    className="bg-red-300 h-full transition-all duration-500" 
                    style={{ width: `${(item.soldQuantity / item.flashSaleQuantity) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-700 flex items-center gap-1">
                      ⚡ Đã bán {item.soldQuantity}/{item.flashSaleQuantity} suất
                    </span>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
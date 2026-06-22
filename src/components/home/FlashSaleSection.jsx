import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getFlashSaleItems } from "../../services/flashSaleItemService";
import { getFlashSalesByDate } from "../../services/flashSaleService";

export default function FlashSaleSection() {
  const [tabs, setTabs] = useState([]);         
  const [activeTabId, setActiveTabId] = useState(null); 
  const [flashSales, setFlashSales] = useState([]); 
  const [timeLeft, setTimeLeft] = useState(""); // State mới để lưu chuỗi đếm ngược

  // 1. Fetch danh sách các khung giờ
  useEffect(() => {
    const fetchTabs = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await getFlashSalesByDate(today);
        if (res?.data && res.data.length > 0) {
          setTabs(res.data);
          setActiveTabId(res.data[0]._id);
        }
      } catch (err) {
        console.error("Lỗi khi tải danh sách khung giờ:", err);
      }
    };
    fetchTabs();
  }, []);

  // 2. Logic Countdown & Cập nhật trạng thái theo thời gian thực
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      // Tìm tab đang diễn ra để tính countdown
      const active = tabs.find(t => now >= new Date(t.startTime) && now <= new Date(t.endTime));
      
      if (active) {
        const diff = new Date(active.endTime) - now;
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft(""); // Hết giờ hoặc chưa tới
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [tabs]);

  // 3. Khi activeTabId thay đổi, load sản phẩm
  useEffect(() => {
    const fetchData = async () => {
      if (!activeTabId) return;
      try {
        const res = await getFlashSaleItems(activeTabId);
        setFlashSales(Array.isArray(res) ? res : res.data || []);
      } catch (err) {
        console.error("Lỗi khi tải sản phẩm Flash Sale:", err);
      }
    };
    fetchData();
  }, [activeTabId]);

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Zap className="fill-white" />
              <h2 className="text-xl font-bold tracking-wide">FLASH SALE</h2>
            </div>
            <button className="text-sm font-medium hover:underline">XEM TẤT CẢ</button>
          </div>

          <div className="flex justify-center gap-2 mb-6 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const now = new Date();
              const isLive = now >= new Date(tab.startTime) && now <= new Date(tab.endTime);
              
              return (
                <button
                  key={tab._id}
                  onClick={() => setActiveTabId(tab._id)}
                  className={`flex flex-col items-center px-4 py-1 rounded-lg transition-all border-b-2 ${
                    activeTabId === tab._id 
                      ? "bg-white text-red-600 border-white" 
                      : "bg-black/20 text-white border-transparent hover:bg-black/40"
                  }`}
                >
                  <span className="text-[10px] uppercase opacity-80 font-bold">
                    {isLive ? "Đang diễn ra" : "Sắp diễn ra"}
                  </span>
                  <span className="font-bold">
                    {new Date(tab.startTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })}
                  </span>
                  
                  {/* Hiển thị Countdown ngay dưới khung giờ nếu đang live */}
                  {isLive && timeLeft && (
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full mt-1 font-mono">
                      {timeLeft}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {flashSales.map((item) => {
              const flash_price = item?.flash_price || 0;
              const originalPrice = item?.productVariantId?.price || 0;
              const totalQuantity = (item.sold_count || 0) + (item.stock || 0);
              const progress = totalQuantity > 0 ? ((item.sold_count || 0) / totalQuantity) * 100 : 0;
              const discountPercent = originalPrice > 0 ? Math.round(((originalPrice - flash_price) / originalPrice) * 100) : 0;

              return (
                <div key={item._id} className="bg-white rounded-xl p-3 text-gray-900 relative shadow-sm hover:shadow-lg transition-shadow flex flex-col gap-y-2">
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold z-10">
                    -{discountPercent}%
                  </span>
                  <div className="h-32 flex items-center justify-center overflow-hidden">
                    <img src={item.productId?.image} alt={item.productId?.name} className="max-h-full object-contain hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <h3 className="text-sm font-bold line-clamp-2 leading-tight text-gray-800">{item.productId?.name}</h3>
                    <div className="flex items-baseline gap-x-2">
                      <p className="text-red-600 font-black text-sm">{flash_price.toLocaleString()}đ</p>
                      <p className="text-gray-400 text-[10px] line-through">{originalPrice.toLocaleString()}đ</p>
                    </div>
                  </div>
                  <div className="w-full bg-red-200 rounded-full h-6 relative overflow-hidden mt-auto">
                    <div className="bg-red-300 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-[10px] font-bold text-gray-700 flex items-center gap-1">⚡ Đã bán {item.sold_count || 0}/{totalQuantity}</span>
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
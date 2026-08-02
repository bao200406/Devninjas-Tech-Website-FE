import { Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { getFlashSaleItems } from "../../services/flashSaleItemService";
import { getFlashSalesByDate } from "../../services/flashSaleService";

// Hàm helper xử lý URL ảnh đồng bộ với ProductCard
const getPublicUrl = (path) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;

  const index = path.indexOf('uploads');
  if (index !== -1) {
    const relativePath = path.substring(index).replace(/\\/g, '/');
    return `https://devninjas-tech-website-be.onrender.com/${relativePath}`;
  }
  
  return `https://devninjas-tech-website-be.onrender.com/uploads/products/${path.replace(/\\/g, '/')}`;
};

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

        // LOG ĐỂ KIỂM TRA DỮ LIỆU
      console.log("--- DEBUG START ---");
      console.log("Danh sách raw từ API:", res.data);
      console.log("Thời gian hiện tại:", new Date().toLocaleString());
        
        if (res?.data && res.data.length > 0) {          
          // BƯỚC QUAN TRỌNG: Lọc bỏ các tab đã có thời gian kết thúc nhỏ hơn bây giờ
          // Nếu Backend không trả về endTime, hãy đảm bảo bạn dùng startTime thay thế
          const validTabs = res.data.filter(tab => {
            const end = new Date(tab.endTime).getTime();
            const now = new Date().getTime();
            return end > now;
          });
          setTabs(validTabs);

          if (validTabs.length > 0) {
            // Luôn chọn tab sớm nhất trong danh sách còn hạn
            setActiveTabId(validTabs[0]._id);
          } else {
            setTabs([]);
            setActiveTabId(null);
          }
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
      const now = new Date(); // Dùng đối tượng Date chuẩn
      
      const active = tabs.find(t => {
        const start = new Date(t.startTime);
        const end = new Date(t.endTime);
        return now >= start && now <= end;
      });
      
      if (active) {
        const end = new Date(active.endTime);
        const diff = end.getTime() - now.getTime(); // So sánh mili-giây
        
        const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const m = Math.floor((diff / 1000 / 60) % 60);
        const s = Math.floor((diff / 1000) % 60);
        
        setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft("");
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
             // 1. Dùng trực tiếp dữ liệu từ DB, không cộng offset thủ công
            const now = new Date(); 
            const start = new Date(tab.startTime); 
            const end = new Date(tab.endTime);

            const isLive = now >= start && now <= end;
            
            // 2. Debug để kiểm tra lại dữ liệu thực tế
            console.log(`--- Tab: ${tab.name} ---`);
            console.log("Bây giờ (VN):", now.toLocaleString());
            console.log("Start (DB):", start.toLocaleString());
            console.log("isLive:", isLive);

            // 3. Lấy giờ hiển thị (Dùng getHours() của giờ địa phương VN)
            const hour = start.getHours().toString().padStart(2, '0');
            const minute = start.getMinutes().toString().padStart(2, '0');
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
                    {`${hour}:${minute}`}
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

              // Ưu tiên lấy ảnh từ variant trước (giống ProductGallery), nếu không có thì lấy ảnh sản phẩm gốc
              const variantImage = item?.productVariantId?.image || (item?.productVariantId?.images && item.productVariantId.images[0]);
              const displayImage = variantImage || item.productId?.image;

              return (
                <div key={item._id} className="bg-white rounded-xl p-3 text-gray-900 relative shadow-sm hover:shadow-lg transition-shadow flex flex-col gap-y-2">
                  <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold z-10">
                    -{discountPercent}%
                  </span>
                  <div className="h-32 flex items-center justify-center overflow-hidden bg-gray-50 rounded-lg p-2">
                    {displayImage ? (
                      <img 
                        src={getPublicUrl(displayImage)} 
                        alt={item.productId?.name} 
                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-xs">Không có ảnh</span>
                      </div>
                    )}
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
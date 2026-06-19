import { useEffect, useState } from "react";
import { getActiveBanners } from "../../services/bannerService"; // Import hàm từ service bạn vừa tách

export default function HeroSection() {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        // Giả sử vị trí banner ở trang chủ là 'homepage_hero'
        const result = await getActiveBanners("homepage_hero");
        // Lấy banner đầu tiên nếu có danh sách trả về
        if (result.success && result.data.length > 0) {
          setBanner(result.data[0]);
        }
      } catch (error) {
        console.error("Lỗi khi tải banner:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, []);

  if (loading) return <div className="h-96 flex items-center justify-center">Đang tải...</div>;
  if (!banner) return null; // Không hiển thị gì nếu không có banner

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-3xl">
          
          {/* Cột trái: Nội dung động */}
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-md">
              {banner.title || "Bộ sưu tập cao cấp"}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight">
              {banner.title}
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              {banner.description}
            </p>
            
            <div className="flex gap-4 items-center">
              <a 
                href={banner.cta?.url || "#"} 
                className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20"
              >
                {banner.cta?.text || "Mua sắm ngay"}
              </a>
            </div>
          </div>

          {/* Cột phải: Hình ảnh động */}
          <div className="relative">
           <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={banner.imageUrl} 
              alt={banner.title} 
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
           </div>
          </div>

        </div>
      </div>
    </section>
  );
}
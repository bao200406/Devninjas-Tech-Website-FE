"use client";
import { useQuery } from "@tanstack/react-query";
import { getActiveBanners } from "../../services/bannerService";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';

// Đảm bảo import CSS đầy đủ và chính xác
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

export default function HeroSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["banners", "homepage_hero"],
    queryFn: () => getActiveBanners("homepage_hero"),
    staleTime: 1000 * 60 * 5, // Tối ưu: Cache dữ liệu trong 5 phút để tránh gọi API lặp lại liên tục
  });

  if (isLoading) return <div className="h-96 flex items-center justify-center">Đang tải...</div>;
  if (!data?.data || data.data.length === 0) return null;

  return (
    <section>
      <div className="container mx-auto px-4">
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ 
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          loop={true}
          className="rounded-3xl shadow-xl"
        >
          {data.data.map((banner, index) => (
            <SwiperSlide key={banner._id}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-3xl min-h-[550px]">
                <div className="space-y-6">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-md">
                    {banner.title}
                  </span>

                  <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950">
                    {banner.title}
                  </h1>

                  <p className="text-gray-600 text-lg">
                    {banner.description}
                  </p>

                  <a
                    href={banner.cta?.url || "#"}
                    className="inline-block bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    {banner.cta?.text || "Đăng ký ngay"}
                  </a>
                </div>

                <div className="relative h-[400px] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0} // Tối ưu: Ưu tiên tải cực nhanh bức ảnh đầu tiên (Largest Contentful Paint)
                    className="object-cover"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
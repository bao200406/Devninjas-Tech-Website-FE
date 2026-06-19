"use client";
import { useQuery } from "@tanstack/react-query";
import { getActiveBanners } from "../../services/bannerService";
// 1. Thêm đầy đủ module Swiper cần thiết
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// 2. Đảm bảo import CSS đầy đủ và chính xác
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay'; // Import thêm CSS cho Autoplay

export default function HeroSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["banners", "homepage_hero"],
    queryFn: () => getActiveBanners("homepage_hero"),
  });

  if (isLoading) return <div className="h-96 flex items-center justify-center">Đang tải...</div>;
  if (!data?.data || data.data.length === 0) return null;

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        {/* 3. Cấu hình Swiper để sửa lỗi tự động chuyển và chồng nội dung */}
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
          {data.data.map((banner) => (
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
                    className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    {banner.cta?.text || "Đăng ký ngay"}
                  </a>
                </div>

                <div className="h-[400px] overflow-hidden rounded-2xl">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
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
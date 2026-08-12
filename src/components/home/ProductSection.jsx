"use client";
import ProductCard from "../ui/ProductCard";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

export default function ProductSection({ title, products, showCart = false, tag }) {
  const displayProducts = products || [];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        {/* Phần tiêu đề và cụm nút điều hướng */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{title}</h2>
          
          <div className="flex items-center gap-4">
            {/* Cụm nút custom điều hướng định danh bằng class riêng biệt */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                className="custom-prev w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-blue-900 hover:text-white hover:border-blue-900 active:scale-95 cursor-pointer"
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                className="custom-next w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-all duration-200 hover:bg-blue-900 hover:text-white hover:border-blue-900 active:scale-95 cursor-pointer"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <button className="text-xs font-bold text-blue-700 hover:underline uppercase tracking-wide cursor-pointer">
              Xem tất cả
            </button>
          </div>
        </div>

        {displayProducts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Chưa có sản phẩm nào.</p>
        ) : (
          <div className="relative">
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              // Liên kết trực tiếp qua class selector, không dùng ref gây lỗi render
              navigation={{
                prevEl: '.custom-prev',
                nextEl: '.custom-next',
              }}
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={displayProducts.length >= 4} // Tránh lỗi loop warning của Swiper nếu số lượng sản phẩm ít hơn số slide hiển thị
              className="pb-6 pt-2"
            >
              {displayProducts.map((p) => (
                <SwiperSlide key={p._id} className="h-auto">
                  <ProductCard 
                    id={p._id}
                    name={p.name}
                    price={p.basePrice} 
                    rating={p.rating || 5} 
                    tag={tag || (p.isFeatured ? "NỔI BẬT" : null)} 
                    soldCount={p.soldCount} 
                    image={p.image}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
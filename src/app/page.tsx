"use client";
import { useEffect } from "react"; 
import AOS from "aos"; 
import { useQuery } from "@tanstack/react-query";
import { getHomePageData } from "../services/productService";
import HeroSection from "@/components/home/HeroSection";
import CategoryBar from "@/components/home/CategoryBar";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ProductSection from "@/components/home/ProductSection";
import BlogSection from "@/components/home/BlogSection";
import FeedbackSection from "@/components/home/FeedbackSection";
import BrandSection from "@/components/home/BrandSection";
import ThemeToggle from "@/components/ui/ThemeToggle";
import ChatWidget from "@/components/chatbot/ChatWidget"; // 1. Import ChatWidget vào trang chủ

export default function Home() {

  // 1. Sử dụng useQuery để fetch dữ liệu từ API
  const { data, isLoading, error } = useQuery({
    queryKey: ["homeData"],
    queryFn: getHomePageData,
  });

  // 3. Refresh AOS mỗi khi data thay đổi
  useEffect(() => {
    if (data) {
      AOS.refresh();
    }
  }, [data]);

  // 2. Xử lý trạng thái Loading và Error
  if (isLoading) return <div className="text-center py-20">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Lỗi khi tải trang!</div>;

  // data lúc này sẽ có cấu trúc: { newProducts: [], featuredProducts: [], bestSellers: [] }
  const { newProducts, featuredProducts, bestSellers } = data;

  return (
    <div className="bg-app-bg min-h-screen relative">
      
      <main className="flex flex-col gap-12 py-8">
        {/* Banner chính */}
        <div data-aos="fade-up">
          <HeroSection />
        </div>
        
        {/* Các mục tiện ích */}
        <div data-aos="fade-up" data-aos-delay="100">
          <CategoryBar />
        </div>
        
        {/* Flash Sale - Nổi bật */}
        <div data-aos="fade-right">
          <FlashSaleSection />
        </div>

        {/* 3. Truyền dữ liệu thật vào các Section */}
        <div data-aos="fade-up">
          <ProductSection title="SẢN PHẨM MỚI" products={newProducts} showCart={false} tag="MỚI"/>
        </div>
        <div data-aos="fade-up">
          <ProductSection title="SẢN PHẨM NỔI BẬT" products={featuredProducts} showCart={false} tag="NỔI BẬT"/>
        </div>
        <div data-aos="fade-up">
          <ProductSection title="SẢN PHẨM BÁN CHẠY" products={bestSellers} showCart={true} tag="BÁN CHẠY"/>
        </div>

        <div data-aos="fade-up">
          <BrandSection />
        </div>
        
        <div data-aos="fade-up">
          <BlogSection />
        </div>
        <div data-aos="fade-up">
          <FeedbackSection />
        </div>
        
      </main>

      {/* Cấu hình các Floating Components ở cuối trang */}
      <ThemeToggle />
      
      {/* 2. Đặt ChatWidget ở đây để hiển thị nổi ở góc màn hình xuyên suốt trang chủ */}
      <ChatWidget />

    </div>
  );
}
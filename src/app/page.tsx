"use client";
import { useQuery } from "@tanstack/react-query";
import { getHomePageData } from "../services/productService";
import HeroSection from "@/components/home/HeroSection";
import CategoryBar from "@/components/home/CategoryBar";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ProductSection from "@/components/home/ProductSection";
import BlogSection from "@/components/home/BlogSection";
import FeedbackSection from "@/components/home/FeedbackSection";

export default function Home() {

// 1. Sử dụng useQuery để fetch dữ liệu từ API
  const { data, isLoading, error } = useQuery({
    queryKey: ["homeData"],
    queryFn: getHomePageData,
  });

  // 2. Xử lý trạng thái Loading và Error
  if (isLoading) return <div className="text-center py-20">Đang tải dữ liệu...</div>;
  if (error) return <div className="text-center py-20 text-red-500">Lỗi khi tải trang!</div>;

  // data lúc này sẽ có cấu trúc: { newProducts: [], featuredProducts: [], bestSellers: [] }
  const { newProducts, featuredProducts, bestSellers } = data;

  return (
    <div className="bg-app-bg min-h-screen">
      
      <main className="flex flex-col gap-12 py-8">
        {/* Banner chính */}
        <HeroSection />
        
        {/* Các mục tiện ích */}
        <CategoryBar />
        
        {/* Flash Sale - Nổi bật */}
        <FlashSaleSection />
        

        {/* 3. Truyền dữ liệu thật vào các Section */}
        <ProductSection title="SẢN PHẨM MỚI" products={newProducts} showCart={false}  tag="MỚI"/>
        <ProductSection title="SẢN PHẨM NỔI BẬT" products={featuredProducts} showCart={false} tag="NỔI BẬT"/>
        <ProductSection title="SẢN PHẨM BÁN CHẠY" products={bestSellers} showCart={true} tag="BÁN CHẠY"/>
        
        <BlogSection />
        <FeedbackSection />
        
        {/* Nếu bạn muốn thêm Testimonial hoặc Blog thì thêm vào đây */}
      </main>

    </div>
  );
}
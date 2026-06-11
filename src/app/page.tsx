
import HeroSection from "@/components/home/HeroSection";
import CategoryBar from "@/components/home/CategoryBar";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import ProductSection from "@/components/home/ProductSection";
import BlogSection from "@/components/home/BlogSection";
import FeedbackSection from "@/components/home/FeedbackSection";

export default function Home() {
const bestSellerData = [
  { 
    name: "Sony XM5 Noise Cancelling", 
    price: "8.490.000đ", 
    rating: 5.0, 
    soldCount: "1.2k+", 
    tag: "BÁN CHẠY" 
  },
  { 
    name: "iPhone 15 Pro Max", 
    price: "27.490.000đ", 
    rating: 4.9, 
    soldCount: "2.5k+" 
  },
  { 
    name: "Samsung Galaxy Watch", 
    price: "6.990.000đ", 
    rating: 4.8, 
    soldCount: "800+" 
  },
  { 
    name: "MacBook Air M2 13\"", 
    price: "18.990.000đ", 
    rating: 5.0, 
    soldCount: "1.1k+" 
  },
];

  return (
    <div className="bg-app-bg min-h-screen">
      
      <main className="flex flex-col gap-12 py-8">
        {/* Banner chính */}
        <HeroSection />
        
        {/* Các mục tiện ích */}
        <CategoryBar />
        
        {/* Flash Sale - Nổi bật */}
        <FlashSaleSection />
        
        {/* Danh sách sản phẩm */}
        <ProductSection title="SẢN PHẨM MỚI" showCart={false} />
        <ProductSection title="SẢN PHẨM NỔI BẬT" showCart={false} />
        <ProductSection title="SẢN PHẨM BÁN CHẠY" showCart={true} products={bestSellerData} />
        
        <BlogSection />
        <FeedbackSection />
        
        {/* Nếu bạn muốn thêm Testimonial hoặc Blog thì thêm vào đây */}
      </main>

    </div>
  );
}
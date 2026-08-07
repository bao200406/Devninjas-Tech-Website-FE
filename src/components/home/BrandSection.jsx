"use client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getAllBrands } from "../../services/brandService"; 
import HorizontalScrollSlider from "@/components/ui/HorizontalScrollSlider"; // Điều chỉnh đường dẫn import này cho đúng với vị trí thực tế của file HorizontalScrollSlider trong dự án của bạn

export default function BrandSection() {
  // Sử dụng React Query để fetch và cache dữ liệu thương hiệu
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return <div className="h-32 flex items-center justify-center text-gray-400">Đang tải thương hiệu...</div>;
  }

  if (!brands || brands.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center tracking-tight">
        THƯƠNG HIỆU ĐỐI TÁC
      </h2>
      
      {/* Sử dụng component HorizontalScrollSlider để hiển thị dạng trượt ngang */}
      <HorizontalScrollSlider className="py-2">
        {brands.map((brand) => (
          <div 
            key={brand._id || brand.name} 
            /* 
              Cấu hình chiều rộng item linh hoạt theo màn hình:
              - Mobile: hiển thị 2 cột (50%)
              - Tablet: hiển thị 3 cột (~33.3%)
              - Desktop (lg): hiển thị đúng 6 cột (~16.6%)
            */
            className="flex-shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-10px)] lg:w-[calc(16.666%-12px)] group flex items-center justify-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative w-full h-12 grayscale group-hover:grayscale-0 transition-all duration-300">
              <Image 
                src={brand.logo} 
                alt={brand.name} 
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        ))}
      </HorizontalScrollSlider>
    </section>
  );
}
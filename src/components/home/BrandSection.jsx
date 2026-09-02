"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { getAllBrands } from "../../services/brandService";
import HorizontalScrollSlider from "@/components/ui/HorizontalScrollSlider";

// Màu nhận diện của từng thương hiệu
const brandColors = {
  Lenovo: "#E2231A",   // Đỏ
  Dell: "#007DB8",     // Xanh dương
  ASUS: "#001F8B",     // Xanh đậm
  Xiaomi: "#FF6900",   // Cam
  Apple: "#1D1D1F",    // Đen
  Samsung: "#1428A0",  // Xanh dương
};

export default function BrandSection() {
  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["brands"],
    queryFn: getAllBrands,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return (
      <div className="h-32 flex items-center justify-center text-gray-400">
        Đang tải thương hiệu...
      </div>
    );
  }

  if (!brands || brands.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center tracking-tight">
        THƯƠNG HIỆU ĐỐI TÁC
      </h2>

      <HorizontalScrollSlider className="py-2">
        {brands.map((brand) => {
          // Lấy màu theo tên thương hiệu
          const brandColor =
            brandColors[brand.name] || "#374151";

          return (
            <div
              key={brand._id || brand.name}
              className="
                flex-shrink-0
                w-[calc(50%-8px)]
                sm:w-[calc(33.333%-10px)]
                lg:w-[calc(16.666%-12px)]
                group
                flex
                items-center
                justify-center
                bg-white
                p-6
                rounded-xl
                border
                border-gray-100
                shadow-sm
                hover:shadow-md
                transition-all
                duration-300
              "
            >
              <div
                className="relative w-full h-12"
                style={{ color: brandColor }}
              >
                <Image
                  src={brand.logo}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  className="
                    object-contain
                    opacity-100
                    transition-transform
                    duration-300
                    group-hover:scale-105
                  "
                />
              </div>
            </div>
          );
        })}
      </HorizontalScrollSlider>
    </section>
  );
}
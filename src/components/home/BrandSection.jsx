import Image from "next/image";

const brands = [
  { name: "Apple", logo: "/brands/apple.png" },
  { name: "Samsung", logo: "/brands/samsung.png" },
  { name: "Sony", logo: "/brands/sony.png" },
  { name: "Logitech", logo: "/brands/logitech.png" },
  { name: "Asus", logo: "/brands/asus.png" },
  { name: "Dell", logo: "/brands/dell.png" },
];

export default function BrandSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">THƯƠNG HIỆU ĐỐI TÁC</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {brands.map((brand, index) => (
          <div 
            key={index} 
            className="group flex items-center justify-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="relative w-full h-12 grayscale group-hover:grayscale-0 transition-all duration-300">
              {/* Lưu ý: Bạn cần để ảnh logo trong thư mục public/brands/ */}
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="object-contain w-full h-full opacity-70 group-hover:opacity-100"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
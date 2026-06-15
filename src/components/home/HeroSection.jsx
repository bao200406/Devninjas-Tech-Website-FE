export default function HeroSection() {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center bg-slate-50 p-8 md:p-12 rounded-3xl">
          
          {/* Cột trái: Nội dung */}
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-md">
              Bộ sưu tập cao cấp 2026
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-blue-950 leading-tight">
              Nâng tầm <span className="text-blue-700">cuộc sống</span><br /> 
              số của bạn
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed max-w-lg">
              Khám phá những công nghệ tiên tiến nhất với danh mục thiết bị cao cấp được tuyển chọn.
            </p>
            
            <div className="flex gap-4 items-center">
              <button className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition shadow-lg shadow-blue-900/20">
                Mua sắm ngay
              </button>
              <a href="#" className="font-bold text-blue-900 hover:underline">
                Xem Lookbook
              </a>
            </div>
          </div>

          {/* Cột phải: Hình ảnh */}
          <div className="relative">
           <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="http://googleusercontent.com/image_collection/image_retrieval/10756008250706254275" 
              alt="Laptop và Smartphone cao cấp" 
              className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          </div>
            {/* Hiệu ứng trang trí nhẹ nếu muốn giống bản thiết kế chuyên nghiệp */}
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-200 rounded-full blur-3xl opacity-50 -z-10"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
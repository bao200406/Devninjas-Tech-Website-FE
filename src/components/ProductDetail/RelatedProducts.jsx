const sampleProducts = [
  { id: 1, name: "iPhone 15 Pro 128GB", price: "23.990.000đ" },
  { id: 2, name: "Galaxy S24 Ultra 256GB", price: "26.490.000đ" },
  { id: 3, name: "AirPods Pro (2nd Gen)", price: "5.490.000đ" },
  { id: 4, name: "iPad Pro M4 11 inch", price: "28.990.000đ" },
];

export default function RelatedProducts() {
  return (
    <div className="w-full">
      <h3 className="text-xs font-bold uppercase text-gray-900 tracking-wider mb-6">Sản phẩm tương tự</h3>
      
      {/* Grid 4 cột tự dàn trải rộng khắp không gian rộng nhất của trang */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
        {sampleProducts.map((prod) => (
          <div key={prod.id} className="group cursor-pointer flex flex-col w-full">
            {/* Khối nền đen nghệ thuật của sản phẩm */}
            <div className="bg-black aspect-square rounded-2xl flex items-center justify-center p-6 border border-gray-800 overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 w-full">
              <span className="text-gray-700 text-[10px] font-medium">Image Backdrop</span>
            </div>
            
            {/* Thông tin tên và giá */}
            <div className="mt-3 w-full space-y-0.5">
              <h4 className="text-xs font-bold text-gray-900 group-hover:text-[#005ba4] transition-colors line-clamp-1">
                {prod.name}
              </h4>
              <p className="text-xs font-bold text-[#005ba4]">{prod.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import { Search, User, Heart, Bell, ShoppingCart, Moon, Menu } from "lucide-react";

export default function Header() {
  const menuItems = ["ĐIỆN THOẠI", "LAPTOP", "PHỤ KIỆN", "AUDIO", "GAMING", "ĐỒNG HỒ"];

  return (
    <header className="bg-white border-b border-gray-100">
      {/* Tầng trên: Logo, Tìm kiếm, Icons */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4 ">
        {/* Logo */}
       <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-700 rounded-md flex items-center justify-center text-white font-bold">
            A
          </div>

          <h2 className="text-2xl font-bold text-blue-700">
            Azure Logic
          </h2>
        </div>

        {/* Search Bar - Ẩn trên Mobile, hiện trên Tablet/Desktop */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-6 text-gray-700">
          <User size={20} className="cursor-pointer hidden sm:block" />
          <Heart size={20} className="cursor-pointer hidden sm:block" />
          <div className="relative cursor-pointer">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full">3</span>
          </div>
          <div className="relative cursor-pointer">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full">2</span>
          </div>
          <Moon size={20} className="cursor-pointer hidden sm:block" />
          {/* Nút Menu cho Mobile */}
          <Menu size={24} className="md:hidden cursor-pointer" />
        </div>
      </div>

      {/* Tầng dưới: Menu điều hướng & Buttons - Ẩn hoàn toàn trên Mobile */}
      <div className="hidden md:flex container mx-auto px-4 pb-3 items-center justify-between">
        <nav className="flex gap-6 lg:gap-8">
          {menuItems.map((item, index) => (
            <a
              key={item}
              href="#"
              className={`text-xs font-bold transition-colors ${index === 0 ? "text-blue-600 border-b-2 border-blue-600 pb-1" : "text-gray-500 hover:text-blue-600"}`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex gap-2">
          <button className="text-blue-900 text-[11px] font-bold px-3 py-2 border border-blue-900 rounded hover:bg-gray-50 whitespace-nowrap">
            TRẢ GÓP 0%
          </button>
          <button className="bg-blue-900 text-white text-[11px] font-bold px-3 py-2 rounded hover:bg-blue-800 whitespace-nowrap">
            THU CŨ ĐỔI MỚI
          </button>
        </div>
      </div>
    </header>
  );
}
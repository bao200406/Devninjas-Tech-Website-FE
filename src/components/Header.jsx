import { Search, User, Heart, Bell, ShoppingCart, Moon, Menu } from "lucide-react";
import UserSection from "@/components/ui/UserSection";
import Link from 'next/link';
import Logo from "./logo/Logo";
export default function Header() {
  const menuItems = ["ĐIỆN THOẠI", "LAPTOP", "PHỤ KIỆN", "AUDIO", "GAMING", "ĐỒNG HỒ"];

  return (
    <header className="bg-white border-b border-gray-100">
      {/* Tầng trên: Logo, Tìm kiếm, Icons */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
<Logo />

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
        <div className="flex items-center gap-2 md:gap-4 text-gray-600">
          {/* Icon Container cho các nút bấm */}
          {[
            { icon: Heart, label: "Wishlist", hidden: "hidden sm:block" },
            { icon: Bell, label: "Notifications", badge: "3", color: "bg-red-500" },
            { icon: ShoppingCart, label: "Cart", badge: "2", color: "bg-blue-600" },
            { icon: Moon, label: "Theme", hidden: "hidden sm:block" },
          ].map((item, index) => (
            <button 
              key={index}
              className={`relative p-2.5 rounded-full hover:bg-gray-100 hover:text-blue-600 transition-all duration-200 ${item.hidden || ""}`}
              aria-label={item.label}
            >
              <item.icon size={22} strokeWidth={1.8} />
              {item.badge && (
                <span className={`absolute top-1 right-1 ${item.color} text-[10px] text-white w-4 h-4 flex items-center justify-center rounded-full font-bold shadow-sm`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          {/* Mobile Menu */}
          <button className="md:hidden p-2.5 hover:bg-gray-100 rounded-full">
            <Menu size={24} />
          </button>

          {/* User Section (giữ nguyên vị trí cuối) */}
          <div className="ml-2">
            <UserSection />
          </div>
        </div>
      </div>

      {/* Đường kẻ ngăn cách tinh tế giữa Header và Menu */}
      <div className="w-full border-b border-gray-100"></div>


      {/* Tầng dưới: Menu điều hướng & Buttons - Ẩn hoàn toàn trên Mobile */}
      <div className="hidden md:flex container mx-auto px-4 items-center justify-between h-14">
        <nav className="flex items-center h-full gap-8">
          {menuItems.map((item, index) => (
            <a
              key={item}
              href="#"
              className={`text-sm font-bold uppercase tracking-wide transition-all border-b-2 h-full flex items-center ${
                index === 0 
                  ? "text-blue-700 border-blue-700" 
                  : "text-gray-600 border-transparent hover:text-blue-700 hover:border-blue-700"
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Nhóm CTA Buttons */}
        <div className="flex items-center gap-3">
          <button className="text-blue-800 text-[11px] font-bold px-4 py-1.5 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors whitespace-nowrap">
            TRẢ GÓP 0%
          </button>
          <button className="bg-blue-900 text-white text-[11px] font-bold px-4 py-1.5 rounded-md hover:bg-blue-800 transition-colors whitespace-nowrap">
            THU CŨ ĐỔI MỚI
          </button>
        </div>
      </div>
    </header>
  );
}
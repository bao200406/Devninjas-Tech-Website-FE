"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, MapPin, Package, Settings, Heart } from 'lucide-react';
import Logo from '../logo/Logo';

const Sidebar = ({ user }) => {
  const pathname = usePathname(); // Hook này giúp tự động lấy đường dẫn hiện tại

  const menuItems = [
    { icon: User, label: "Personal Info", href: "/account" },
    // { icon: MapPin, label: "Addresses", href: "/addresses" },
    { icon: Package, label: "Order History", href: "/orderHistory" },
    // { icon: Heart, label: "Wishlist", href: "/wishlist" }
  ];

  return (
    <aside className="w-72 bg-white p-6 rounded-2xl shadow-sm h-fit">
      <Logo />
      
      {/* User Info */}
      <div className="flex items-center gap-4 mb-8 p-3 rounded-2xl bg-gray-50 border border-gray-100">
         <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white">
           {user?.avatar ? (
             <img 
               src={`https://devninjas-tech-website-be.onrender.com/uploads/users/${user.avatar}`} 
               alt={user?.name} 
               className="w-full h-full object-cover"
             />
           ) : (
             user?.name?.charAt(0).toUpperCase() || 'U'
           )}
         </div>
         <div className="overflow-hidden">
           <p className="font-bold text-gray-800 truncate">{user?.name}</p>
           <p className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase font-bold inline-block">{user?.role || "Member"}</p>
         </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 text-gray-500 text-sm">
        {menuItems.map((item, i) => {
          const isActive = pathname === item.href; // TỰ ĐỘNG HIGHLIGHT
          return (
            <Link 
              key={i} 
              href={item.href} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all 
                ${isActive ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'hover:bg-gray-50 text-gray-600'}`}
            >
              <item.icon size={18} /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import hook để lấy đường dẫn
import { logoutUser } from "../../services/authService";
import Link from "next/link"; // Import Link để chuyển trang
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BarChart3,
  ShoppingCart,
  Users,
  Box,
  FileText,
  PieChart,
  Layers,
  ChevronDown,
  Ticket,
  Tags,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại
  const router = useRouter();
  // Quản lý menu đang mở
  const [openMenus, setOpenMenus] = useState({ Products: true });

  const toggleMenu = (name) => {
    setOpenMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.clear();
    sessionStorage.clear();
    router.replace("/login");
  }
};
  const menuGroups = [
    {
      title: "OVERVIEW",
      items: [
        { name: "Dashboard", icon: LayoutDashboard, href: "/admin2/dashboard" },
        // { name: "Analytics", icon: BarChart3, href: "/admin2/analytics" },
        // { name: "eCommerce", icon: ShoppingCart, href: "admin2/ecommerce" },
        // { name: "CRM", icon: Users, href: "/admin2/crm" },
        // { name: "SaaS", icon: Layers, href: "/admin2/saas" },
        // { name: "Charts", icon: PieChart, href: "/admin2/charts" },
      ],
    },
    {
      title: "COMMERCE",
      items: [
        { name: "Orders", icon: ShoppingCart, href: "/admin2/orders", badge: 12 },
        {
          name: "Products",
          icon: Box,
          hasSubmenu: true,
          submenu: [
            { name: "List Products", href: "/admin2/products" },
            { name: "Product Details", href: "admin2/product-details" },
            { name: "Add Product", href: "/admin2/addproduct" },
          ],
        },
        { name: "Customers", icon: Users, href: "/admin2/users" },
        { name: "Voucher", icon: Ticket, href: "/admin2/vouchers" },
        { name: "Category", icon: Tags, href: "/admin2/categories" },
        { name: "Invoices", icon: FileText, href: "admin2/invoices" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col sticky top-0 h-screen shadow-sm">
      {/* Brand Section */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-lg shadow-black/20">
          <Box className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">
          ADMIN
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="mb-8">
            <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-4 px-3 uppercase">
              {group.title}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isMenuOpen = openMenus[item.name];
                const isActive = 
                pathname === item.href || 
                (item.href === "/admin2/dashboard" && pathname === "/admin2");

                return (
                  <li key={item.name}>
                    {item.hasSubmenu ? (
                      <div className="flex flex-col">
                        <button
                          onClick={() => toggleMenu(item.name)}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                            ${isMenuOpen ? "text-slate-900 bg-slate-50/50" : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
                          `}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon
                              size={18}
                              className={isMenuOpen ? "text-black" : "text-slate-400"}
                            />
                            {item.name}
                          </div>
                          <motion.div
                            animate={{ rotate: isMenuOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown size={14} />
                          </motion.div>
                        </button>

                        <AnimatePresence initial={false}>
                          {isMenuOpen && (
                            <motion.ul
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                              className="overflow-hidden ml-4 mt-1 border-l border-slate-100"
                            >
                              {item.submenu.map((sub) => (
                                <li key={sub.name}>
                                  <Link
                                    href={sub.href}
                                    className={`flex items-center gap-3 px-6 py-2 text-[13px] rounded-lg transition-colors group ${
                                        pathname === sub.href ? "text-slate-900 font-semibold" : "text-slate-500 hover:text-slate-900"
                                    }`}
                                  >
                                    <div className={`w-1 h-1 rounded-full ${pathname === sub.href ? "bg-black" : "bg-slate-300 group-hover:bg-black"} transition-colors`} />
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                          ${
                            isActive
                              ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                              : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} />
                          {item.name}
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                            ${isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}
                            `}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Profile Section */}
<div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50/30">
  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm shadow-sm">
    A
  </div>

  <div className="flex-1">
    <p className="text-sm font-bold text-slate-900">Admin</p>
  </div>

  <button
    onClick={handleLogout}
    title="Đăng xuất"
    className="p-2 rounded-lg hover:bg-red-50 transition"
  >
    <LogOut
      size={18}
      className="text-slate-400 hover:text-red-500"
    />
  </button>
</div>
    </aside>
  );
}
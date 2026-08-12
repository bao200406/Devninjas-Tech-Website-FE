"use client";

import {
  Search, User, Heart, GitCompare, Bell, ShoppingCart, Moon, Menu, LayoutGrid, } from "lucide-react";
import UserSection from "@/components/ui/UserSection";
import Link from 'next/link';
import Logo from "./logo/Logo";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/services/categoryService";

export default function Header() {
  const [categories, setCategories] = useState([]);

    useEffect(() => {
      const fetchCategories = async () => {
        const data = await getAllCategories();
        setCategories(data);
      };

      fetchCategories();
    }, []);

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Logo />

        {/* Search Bar + Danh mục */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4 gap-2">
          {/* Nút Danh mục (Dropdown) */}
          <div className="relative group">
            <button className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-800 transition whitespace-nowrap">
              <LayoutGrid size={18} />
              Danh mục
            </button>
            
            {/* Dropdown Menu */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/products/category/${category.slug}`}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 first:rounded-t-xl last:rounded-b-xl"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-2 text-gray-600">
          {[
            { icon: GitCompare, label: "Compare", hidden: "hidden sm:block", href: "/compare" }, // Đã đổi sang GitCompare
            { icon: Bell, label: "Notifications", badge: "3", color: "bg-red-500" },
            { icon: ShoppingCart, label: "Cart", badge: "2", color: "bg-blue-600", href: "/cart" },
          ].map((item, index) => (
            <Link key={index} href={item.href || "#"} className={`relative p-2 rounded-full hover:bg-gray-100 ${item.hidden || ""}`}>
              <item.icon size={22} />
              {item.badge && <span className={`absolute top-0 right-0 ${item.color} text-[10px] text-white w-4 h-4 flex items-center justify-center rounded-full font-bold`}>{item.badge}</span>}
            </Link>
          ))}
          
          <div className="ml-2">
            <UserSection />
          </div>
        </div>
      </div>
    </header>
  );
}
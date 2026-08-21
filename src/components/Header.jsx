"use client";

import {
  Search,
  GitCompare,
  Bell,
  ShoppingCart,
  LayoutGrid,
  X,
} from "lucide-react";
import UserSection from "@/components/ui/UserSection";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { getCart } from "@/services/cartService";
import { getAllProducts } from "@/services/productService";
import { getAllCategories } from "@/services/categoryService";
import Logo from "./logo/Logo";

export default function Header() {
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
  try {
    const data = await getAllCategories();

    console.log("========== HEADER CATEGORIES ==========");
    console.log("CATEGORIES:", data);

    setCategories(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Không thể lấy danh sách danh mục:", error);
    setCategories([]);
  }
};

  // =========================
  // SEARCH
  // =========================
  const [searchKeyword, setSearchKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  // =========================
  // CART
  // =========================
  const [cartCount, setCartCount] = useState(0);

  // =========================
  // LẤY GIỎ HÀNG THẬT
  // =========================
  const fetchCartCount = async () => {
    try {
      const response = await getCart();

      console.log("Header Cart:", response);

      if (!response?.success) {
        setCartCount(0);
        return;
      }

      // Backend có thể trả data.items
      const items =
        response?.data?.items ||
        response?.items ||
        [];

      // Tổng số lượng sản phẩm trong giỏ
      const totalQuantity = items.reduce((total, item) => {
        return total + Number(item.quantity || 0);
      }, 0);

      setCartCount(totalQuantity);
    } catch (error) {
      console.log("Không thể lấy số lượng giỏ hàng:", error);

      // Nếu chưa đăng nhập hoặc API lỗi
      setCartCount(0);
    }
  };

  // =========================
  // LẤY DANH SÁCH SẢN PHẨM
  // =========================
const fetchProducts = async () => {
  try {
    const data = await getAllProducts();

    console.log("========== HEADER PRODUCTS ==========");
    console.log("DATA:", data);
    console.log("IS ARRAY:", Array.isArray(data));

    let productList = [];

    if (Array.isArray(data)) {
      productList = data;
    } else if (Array.isArray(data?.products)) {
      productList = data.products;
    } else if (Array.isArray(data?.items)) {
      productList = data.items;
    } else if (Array.isArray(data?.results)) {
      productList = data.results;
    } else if (Array.isArray(data?.data)) {
      productList = data.data;
    }

    console.log("PRODUCT LIST:", productList);
    console.log("PRODUCT COUNT:", productList.length);
    console.log("PRODUCT ĐẦU TIÊN:", productList[0]);

    setProducts(productList);
  } catch (error) {
    console.error("Không thể lấy danh sách sản phẩm:", error);
    setProducts([]);
  }
};

  // =========================
  // LOAD KHI HEADER MOUNT
  // =========================
  useEffect(() => {
    fetchCartCount();
    fetchProducts();
    fetchCategories();
  }, []);

  // =========================
  // LẮNG NGHE KHI GIỎ HÀNG THAY ĐỔI
  // =========================
  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  // =========================
  // TÌM KIẾM SẢN PHẨM
  // =========================
  useEffect(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

const results = products
  .filter((product) => {
    const productName = String(product.name || "");

    return productName
      .toLowerCase()
      .includes(keyword);
  })
  .slice(0, 8);

    setSearchResults(results);
    setShowSearchResults(true);
  }, [searchKeyword, products]);

  // =========================
  // CLICK RA NGOÀI SEARCH
  // =========================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // =========================
  // LẤY TÊN SẢN PHẨM
  // =========================
  const getProductName = (product) => {
    return (
      product.name ||
      product.productName ||
      product.title ||
      "Sản phẩm"
    );
  };

  // =========================
  // LẤY ID SẢN PHẨM
  // =========================
  const getProductId = (product) => {
    return product._id || product.id;
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 flex items-center justify-between gap-4">

        {/* =========================
            LOGO
        ========================= */}
        <Logo />

        {/* =========================
            SEARCH + DANH MỤC
        ========================= */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4 gap-2">

          {/* DANH MỤC */}
          <div className="relative group">

            <button
              type="button"
              className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2.5 rounded-full text-sm font-medium hover:bg-blue-800 transition whitespace-nowrap"
            >
              <LayoutGrid size={18} />
              Danh mục
            </button>

            {/* DROPDOWN */}
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

              {categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/products/category/${category._id}`}
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 first:rounded-t-xl last:rounded-b-xl"
                  >
                    {category.name}
                  </Link>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-400">
                  Đang tải danh mục...
                </div>
              )}

            </div>
          </div>

          {/* =========================
              SEARCH
          ========================= */}
          <div
            ref={searchRef}
            className="relative flex-1"
          >

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />

            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => {
                setSearchKeyword(e.target.value);
              }}
              onFocus={() => {
                if (searchKeyword.trim()) {
                  setShowSearchResults(true);
                }
              }}
              placeholder="Tìm kiếm sản phẩm..."
              className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />

            {/* NÚT XÓA SEARCH */}
            {searchKeyword && (
              <button
                type="button"
                onClick={() => {
                  setSearchKeyword("");
                  setSearchResults([]);
                  setShowSearchResults(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X size={17} />
              </button>
            )}

            {/* =========================
                KẾT QUẢ TÌM KIẾM
            ========================= */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-[60]">

                {searchResults.length > 0 ? (
                  <div className="py-2">

                    {searchResults.map((product) => {
                      const productId = getProductId(product);

                      return (
                        <Link
                          key={productId}
                          href={`/products/${productId}`}
                          onClick={() => {
                            setShowSearchResults(false);
                            setSearchKeyword("");
                          }}
                          className="block px-4 py-3 hover:bg-gray-50 transition"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {getProductName(product)}
                          </p>

                          {product.price && (
                            <p className="text-xs text-[#0052A3] mt-1">
                              {Number(product.price).toLocaleString(
                                "vi-VN"
                              )}{" "}
                              ₫
                            </p>
                          )}
                        </Link>
                      );
                    })}

                  </div>
                ) : (
                  <div className="px-5 py-6 text-center">

                    <Search
                      size={28}
                      className="mx-auto text-gray-300 mb-2"
                    />

                    <p className="text-sm text-gray-500">
                      Không tìm thấy sản phẩm
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Thử tìm với từ khóa khác
                    </p>

                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* =========================
            ICONS
        ========================= */}
        <div className="flex items-center gap-2 text-gray-600">

          {/* COMPARE */}
          <Link
            href="/compare"
            className="relative p-2 rounded-full hover:bg-gray-100 hidden sm:block"
          >
            <GitCompare size={22} />
          </Link>

          {/* NOTIFICATION */}
          <Link
            href="#"
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <Bell size={22} />
          </Link>

          {/* CART */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-gray-100"
          >
            <ShoppingCart size={22} />

            {/* CHỈ HIỆN BADGE KHI CÓ SẢN PHẨM */}
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-blue-600 text-[10px] text-white w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* USER */}
          <div className="ml-2">
            <UserSection />
          </div>

        </div>
      </div>
    </header>
  );
}
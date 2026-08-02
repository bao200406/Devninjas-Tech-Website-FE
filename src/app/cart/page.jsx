"use client";

import Image from "next/image";
import { Trash2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { LoginRequiredModal } from "../../components/ui/LoginRequiredModal";
import { ProductVariantPopover } from "../../components/ui/ProductVariantPopover";
import * as cartService from "../../services/cartService"; // Đường dẫn đến file service của bạn
import { getVariantsByProduct } from "../../services/variantsService";
import { useAuth } from "../../context/AuthContext"; // Import hook Auth
import Link from "next/link";

const getPublicUrl = (path) => {
  if (!path) return "/placeholder.png"; // Trả về ảnh mặc định nếu không có path
  if (path.startsWith("http")) return path;

  const index = path.indexOf('uploads');
  if (index === -1) return path;
  
  const relativePath = path.substring(index).replace(/\\/g, '/');
  return `https://devninjas-tech-website-be.onrender.com/${relativePath}`;
};

export default function CartPage() {
  const [products, setProducts] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); // Lấy thông tin user
  const [variantsMap, setVariantsMap] = useState({});
  const router = useRouter();

 // Hàm fetchCart cải tiến
  const fetchCart = async () => {
    setIsLoading(true);
    if (user) {
      // 1. Nếu đã đăng nhập: Lấy từ Database
      try {
        const response = await cartService.getCart();
        setProducts(response?.data?.items || []);
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng từ DB:", err);
      }
    } else {
      // 2. Nếu chưa đăng nhập: Lấy từ LocalStorage
      const guestCart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      setProducts(guestCart);
    }
    setIsLoading(false);
  };

  // Chạy lại mỗi khi user thay đổi (đăng nhập hoặc đăng xuất)
  useEffect(() => {
    fetchCart();
  }, [user ]);



 const handleLoadVariants = async (product) => {
  if (!product.productId) return;
  if (variantsMap[product.productId]) return;

  try {
    const res = await getVariantsByProduct(product.productId);
    console.log("DEBUG: Data lấy từ API trả về:", res); 
    
    // SỬA Ở ĐÂY: Kiểm tra xem res có phải là mảng không, 
    // nếu không thì mới thử lấy res.data
    const fetchedVariants = Array.isArray(res) ? res : res.data;

    if (Array.isArray(fetchedVariants)) {
      setVariantsMap(prev => ({ 
        ...prev, 
        [product.productId]: fetchedVariants 
      }));
    } else {
      console.error("LỖI: Dữ liệu không phải là mảng:", fetchedVariants);
    }
  } catch (err) {
    console.error("Lỗi lấy danh sách biến thể:", err);
  }
};

const handleUpdateVariant = async (oldVariantId, newVariant) => {
    try {
      if (user) {
        await cartService.updateCartVariant(oldVariantId, newVariant._id);
        await fetchCart();
        alert("Cập nhật phiên bản thành công!");
      } else {
        const cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const idx = cart.findIndex((item) => item.variantId === oldVariantId);

        if (idx > -1) {
          // Lấy thông tin từ item cũ để giữ lại name, productId, quantity
          const existingItem = cart[idx];
          
          // Cập nhật với đầy đủ các cột giống hệt lúc push
          cart[idx] = {
            ...existingItem, // Giữ lại quantity, name, productId cũ
            variantId: newVariant._id, // Ghi đè variant mới
            price: newVariant.price,
            variantName: newVariant.attributes 
              ? newVariant.attributes.map(a => a.attributeValueId?.value || a.value).join(" / ")
              : existingItem.variantName,
            image: newVariant.image,
            stock: newVariant.stock,
            isAvailable: true, // Reset flag
            compareAtPrice: newVariant.compareAtPrice || null
          };

          localStorage.setItem("guestCart", JSON.stringify(cart));
          fetchCart();
          alert("Đã cập nhật giỏ hàng!");
        } else {
          throw new Error("Sản phẩm không có trong giỏ hàng");
        }
      }
    } catch (error) {
      console.error("Lỗi khi update variant:", error);
      // Hiển thị message chi tiết hơn nếu là lỗi logic (ví dụ: lỗi throw new Error ở trên)
      alert(error.message || "Không thể cập nhật phiên bản!");
    }
  };

  // Bạn có thể truyền variantId và quantity mới
 // 1. Cập nhật số lượng
  const handleUpdateQuantity = async (variantId, newQuantity) => {
    try {
      // Thử gọi API trước
      await cartService.updateQuantity(variantId, newQuantity);
      fetchCart(); // Refresh từ server
    } catch (error) {
      // Nếu lỗi, cập nhật trên localStorage
      let cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const index = cart.findIndex(item => item.variantId === variantId);
      if (index > -1) {
        cart[index].quantity = newQuantity;
        localStorage.setItem("guestCart", JSON.stringify(cart));
        setProducts(cart); // Update UI ngay lập tức
      }
    }
  };

  // 2. Xóa 1 sản phẩm
  const handleDeleteItem = async (variantId) => {
    try {
      // Thử gọi API trước
      await cartService.deleteItem(variantId);
      fetchCart(); // Refresh từ server
    } catch (error) {
      // Nếu lỗi, xóa trên localStorage
      let cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      cart = cart.filter(item => item.variantId !== variantId);
      localStorage.setItem("guestCart", JSON.stringify(cart));
      setProducts(cart); // Update UI ngay lập tức
    }
  };

  // 3. Xóa toàn bộ giỏ hàng
  const handleClearCart = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa sạch giỏ hàng?")) {
      try {
        // Thử gọi API trước
        await cartService.clearCart();
        setProducts([]); 
      } catch (error) {
        // Nếu lỗi, xóa trên localStorage
        localStorage.removeItem("guestCart");
        setProducts([]); 
      }
    }
  };

  const handleCheckout = () => {
    if (!user) {
      setIsModalOpen(true);
    } else {
      router.push("/checkout");
    }
  };

  const totalPrice = products.reduce((sum, item) => sum + (item.price * item.quantity), 0);


 return (
  <div className="min-h-screen bg-[#f5f5f7]">
    <div className="mx-auto max-w-[1360px] px-8 py-10">
      <h1 className="text-[48px] font-bold leading-none text-[#1d1d1f]">
        Giỏ hàng của bạn
      </h1>

      <p className="mt-1 text-[15px] text-[#6e6e73]">
        Bạn đang có
        <span className="font-semibold text-[#0071e3]">
          {" "}
          {products.length} sản phẩm
        </span>
        {" "}trong giỏ hàng
      </p>

      <div className="mt-8 grid grid-cols-[1fr_450px] gap-7">
        {/* LEFT */}
        <div>
          <div className="flex items-center justify-between border-b border-[#e5e5e5] pb-4">
            <label className="flex items-center gap-4 text-[14px] font-medium text-[#1d1d1f]">
              <button className="w-[28px] h-[28px] border border-[#c9d1dc] bg-white flex items-center justify-center rounded-sm">
                <Check size={18} className="text-[#0071e3]" />
              </button>
              Chọn tất cả ({products.length})
            </label>
            <button className="flex items-center gap-2 text-[13px] text-[#6e6e73] hover:text-red-500">
              <Trash2 size={16} />
              Xóa đã chọn
            </button>
          </div>

       <div className="space-y-5 mt-5">
            {products && products.length > 0 ? (
              products.map((item, index) => (
                // Dùng variantId làm key vì API không có _id
                <div
                  key={item.variantId || index}
                  className="bg-white border border-[#ececec] rounded-[10px] px-8 py-6 flex items-center gap-6 w-full"
                >
                  <button className="w-6 h-6 border-2 border-[#cfd5dd] rounded-sm flex items-center justify-center bg-white">
                    {item.selected && <Check size={16} className="text-[#0071e3]" />}
                  </button>

                  <div className="w-[120px] shrink-0">
                    <img
                      src={getPublicUrl(item.image)}
                      alt="Sản phẩm"
                      width={102}
                      height={102}
                      className="w-[102px] h-[102px] object-cover rounded-sm"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Tên sản phẩm */}
                    <h3 className="text-[20px] font-bold text-[#1d1d1f]">
                      {item.name}
                    </h3>
                    
                    {/* BỔ SUNG: Hiển thị thuộc tính (ví dụ: Màu sắc/Dung lượng) */}
                    <ProductVariantPopover 
                      key={`${item.variantId}-${variantsMap[item.productId]?.length || 0}`}
                      currentSelection={{ 
                        ...item, 
                        _id: item.variantId // Đảm bảo truyền đúng _id để highlight item đang chọn
                      }} 
                      variants={variantsMap[item.productId] ? [...variantsMap[item.productId]] : []}
                      onOpen={() => handleLoadVariants(item)} // Gọi API khi mở
                      onSelect={(newVariant) => handleUpdateVariant(item.variantId, newVariant)}
                    />

                    <p className={`mt-2 text-[15px] ${item.isAvailable ? "text-green-600" : "text-red-500"}`}>
                      {item.isAvailable ? "Còn hàng" : "Hết hàng"}
                    </p>
                    
                    <div className="mt-5 flex items-center w-[88px] h-[34px] rounded bg-[#f2f3f7]">
                     <button 
                        className="w-8 text-[#555]" 
                        onClick={() => handleUpdateQuantity(item.variantId, item.quantity - 1)}
                        disabled={item.quantity <= 1} // Không cho giảm dưới 1
                      >
                        -
                      </button>
                      <div className="flex-1 text-center text-[15px] font-medium">{item.quantity}</div>
                        <button 
                          className="w-8 text-[#555]"
                          onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                        >
                          +
                        </button>
                    </div>
                  </div>

                  <div className="w-[180px] shrink-0 text-right">
                    <div className="text-[22px] font-bold text-[#005fa9]">
                      {item.price?.toLocaleString("vi-VN")}đ
                    </div>
                    
                    {/* BỔ SUNG: Hiển thị giá cũ gạch ngang */}
                    {item.compareAtPrice > item.price && (
                      <div className="text-[14px] text-[#6e6e73] line-through mt-1">
                        {item.compareAtPrice?.toLocaleString("vi-VN")}đ
                      </div>
                    )}

                    <button 
                      className="mt-8 text-red-500 hover:text-red-700 transition"
                      onClick={() => handleDeleteItem(item.variantId)}
                    >
                      <Trash2 size={20} />
                    </button>     
                  </div>
                </div>
              ))
            ) : (
              <p>Giỏ hàng trống hoặc đang tải...</p>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white border border-[#e5e7eb] rounded-xl p-7">
          <h2 className="text-[18px] font-bold text-[#1d1d1f]">Tóm tắt đơn hàng</h2>
          
          {/* Tạm tính */}
          <div className="mt-6 flex items-center justify-between text-[15px]">
            <span className="text-[#6e6e73]">Tạm tính</span>
            <span className="font-semibold text-[#1d1d1f]">{totalPrice.toLocaleString("vi-VN")}đ</span>
          </div>

          {/* Phí vận chuyển */}
          <div className="mt-4 flex items-center justify-between text-[15px]">
            <span className="text-[#6e6e73]">Phí vận chuyển</span>
            <span className="font-semibold text-[#005b9f]">Miễn phí</span>
          </div>
          
          <div className="my-6 border-t border-[#e5e5e5]"></div>

          {/* Mã giảm giá */}
          <div className="mb-6">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Nhập mã ưu đãi..." 
                className="flex-1 border border-[#d8dde6] rounded-[8px] px-4 py-2 text-[14px] outline-none focus:border-[#0071e3]"
              />
              <button className="px-4 py-2 bg-[#48535b] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#333]">
                Áp dụng
              </button>
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="mt-2">
            <div className="flex items-start justify-between">
              <span className="text-[20px] font-bold text-[#1d1d1f]">Tổng cộng</span>
              <div className="text-right">
                <div className="text-[24px] font-bold text-[#1d1d1f]">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </div>
                <div className="text-[12px] italic font-medium text-[#7f7f7f]">
                  (Đã bao gồm VAT)
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={handleCheckout} // Gọi hàm kiểm tra
            className="mt-8 w-full h-[64px] rounded-[10px] bg-[#0068b3] text-white text-[18px] font-semibold shadow-md transition hover:bg-[#00599a]"
          >
            Tiến hành thanh toán →
          </button>

          {/* Render Modal */}
          <LoginRequiredModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />

          <button className="mt-4 w-full h-[64px] rounded-[10px] border-2 border-[#d8dde6] bg-white text-[18px] font-semibold text-[#222] transition hover:bg-[#f8f8f8]">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
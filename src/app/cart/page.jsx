"use client";

import Image from "next/image";
import { Trash2, Check } from "lucide-react";
import { useState, useEffect } from "react";
import * as cartService from "../../services/cartService"; // Đường dẫn đến file service của bạn
import Link from "next/link";
export default function CartPage() {
 const [products, setProducts] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu giỏ hàng từ Backend
  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await cartService.getCart();
      console.log("1. API Raw Response:", response); // Kiểm tra xem API có trả về dữ liệu không

      const cartItems = response?.data?.items || [];
      console.log("2. Extracted Items:", cartItems); // Kiểm tra xem đã lấy đúng mảng items chưa

      setProducts(cartItems);
    } catch (err) {
      console.error("3. Fetch Error:", err); // Nếu vào đây, lỗi nằm ở server hoặc network
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCart();
  }, []);

  // Bạn có thể truyền variantId và quantity mới
  const handleUpdateQuantity = async (variantId, newQuantity) => {
    try {
      const result = await cartService.updateQuantity(variantId, newQuantity);
      console.log("Cập nhật thành công:", result);
      // Sau khi update, gọi lại hàm lấy giỏ hàng để refresh UI
      fetchCart(); 
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
    }
  };

    const handleDeleteItem = async (variantId) => {
    try {
      const result = await cartService.deleteItem(variantId);
      console.log("Đã xóa sản phẩm:", result);
      // Refresh giỏ hàng sau khi xóa
      fetchCart();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
    }
  };

    const handleClearCart = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa sạch giỏ hàng?")) {
      try {
        const result = await cartService.clearCart();
        console.log("Đã xóa toàn bộ:", result);
        // Reset state giỏ hàng về mảng rỗng
        setProducts([]); 
      } catch (error) {
        console.error("Lỗi khi xóa giỏ hàng:", error);
      }
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
                    <Image
                      src={item.image || "/placeholder.png"}
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
                    {item.variantName && (
                      <p className="text-[14px] text-[#6e6e73] mt-1">
                        {item.variantName}
                      </p>
                    )}

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

          <Link href="/checkout">
            <button className="mt-8 w-full h-[64px] rounded-[10px] bg-[#0068b3] text-white text-[18px] font-semibold shadow-md transition hover:bg-[#00599a]">
              Tiến hành thanh toán →
            </button>
          </Link>
          <button className="mt-4 w-full h-[64px] rounded-[10px] border-2 border-[#d8dde6] bg-white text-[18px] font-semibold text-[#222] transition hover:bg-[#f8f8f8]">
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
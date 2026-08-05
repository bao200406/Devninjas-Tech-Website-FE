"use client";

import Image from "next/image";
import { Trash2, Check } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { LoginRequiredModal } from "../../components/ui/LoginRequiredModal";
import { ProductVariantPopover } from "../../components/ui/ProductVariantPopover";
import * as cartService from "../../services/cartService"; 
import { getVariantsByProduct } from "../../services/variantsService";
import { useAuth } from "../../context/AuthContext"; 
import { ConfirmDeleteModal } from "../../components/modals/ConfirmDeleteModal";
import { toast } from "react-toastify";
import Link from "next/link";

const getPublicUrl = (path) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;

  const index = path.indexOf('uploads');
  if (index === -1) return path;
  
  const relativePath = path.substring(index).replace(/\\/g, '/');
  return `https://devninjas-tech-website-be.onrender.com/${relativePath}`;
};

export default function CartPage() {
  const [products, setProducts] = useState([]); 
  const [selectedItems, setSelectedItems] = useState([]); // State lưu các sản phẩm được tích chọn
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth(); 
  const [variantsMap, setVariantsMap] = useState({});
  const [deletingVariantId, setDeletingVariantId] = useState(null);
  const router = useRouter();

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    let fetchedProducts = [];
    if (user) {
      try {
        const response = await cartService.getCart();
        fetchedProducts = response?.data?.items || [];
      } catch (err) {
        console.error("Lỗi lấy giỏ hàng từ DB:", err);
        toast.error("Không thể tải giỏ hàng từ hệ thống!");
      }
    } else {
      fetchedProducts = JSON.parse(localStorage.getItem("guestCart") || "[]");
    }
    setProducts(fetchedProducts);
    
    // Tự động chọn tất cả sản phẩm khi mới load lần đầu
    if (fetchedProducts.length > 0 && selectedItems.length === 0) {
      setSelectedItems(fetchedProducts.map(item => item.variantId));
    }
    setIsLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleLoadVariants = useCallback(async (product) => {
    if (!product.productId || variantsMap[product.productId]) return;

    try {
      const res = await getVariantsByProduct(product.productId);
      const fetchedVariants = Array.isArray(res) ? res : res.data;

      if (Array.isArray(fetchedVariants)) {
        setVariantsMap(prev => ({ 
          ...prev, 
          [product.productId]: fetchedVariants 
        }));
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách biến thể:", err);
    }
  }, [variantsMap]);

  const handleUpdateVariant = async (oldVariantId, newVariant) => {
    try {
      if (user) {
        await cartService.updateCartVariant(oldVariantId, newVariant._id);
        await fetchCart();
        toast.success("Cập nhật phiên bản thành công!");
      } else {
        const cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const idx = cart.findIndex((item) => item.variantId === oldVariantId);

        if (idx > -1) {
          const existingItem = cart[idx];
          cart[idx] = {
            ...existingItem,
            variantId: newVariant._id,
            price: newVariant.price,
            variantName: newVariant.attributes 
              ? newVariant.attributes.map(a => a.attributeValueId?.value || a.value).join(" / ")
              : existingItem.variantName,
            image: newVariant.image,
            stock: newVariant.stock,
            isAvailable: true,
            compareAtPrice: newVariant.compareAtPrice || null
          };

          localStorage.setItem("guestCart", JSON.stringify(cart));
          setProducts(cart);
          toast.success("Đã cập nhật giỏ hàng!");
        } else {
          throw new Error("Sản phẩm không có trong giỏ hàng");
        }
      }
      
      // Cập nhật lại ID trong selectedItems nếu nó đang được chọn
      if (selectedItems.includes(oldVariantId)) {
        setSelectedItems(prev => prev.map(id => id === oldVariantId ? newVariant._id : id));
      }
    } catch (error) {
      console.error("Lỗi khi update variant:", error);
      toast.error(error.message || "Không thể cập nhật phiên bản!");
    }
  };

  const handleUpdateQuantity = async (variantId, newQuantity) => {
    if (newQuantity < 1) return;

    setProducts(prevProducts => 
      prevProducts.map(item => 
        item.variantId === variantId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      if (user) {
        await cartService.updateQuantity(variantId, newQuantity);
      } else {
        let cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
        const index = cart.findIndex(item => item.variantId === variantId);
        if (index > -1) {
          cart[index].quantity = newQuantity;
          localStorage.setItem("guestCart", JSON.stringify(cart));
        }
      }
    } catch (error) {
      toast.error("Không thể cập nhật số lượng!");
      fetchCart();
    }
  };

  // Logic Chọn/Bỏ chọn 1 sản phẩm
  const handleSelectItem = (variantId) => {
    setSelectedItems(prev => 
      prev.includes(variantId) 
        ? prev.filter(id => id !== variantId) // Bỏ chọn
        : [...prev, variantId] // Chọn
    );
  };

  // Logic Chọn/Bỏ chọn tất cả
  const isAllSelected = products.length > 0 && selectedItems.length === products.length;
  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItems([]); // Nếu đang chọn tất cả -> Bỏ chọn tất cả
    } else {
      setSelectedItems(products.map(item => item.variantId)); // Chọn tất cả
    }
  };

  const handleDeleteItem = (variantId) => {
    setDeletingVariantId(variantId);
  };

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return;
    setDeletingVariantId("ALL_SELECTED");
  };

  // Thực hiện xóa khi user bấm đồng ý trên Modal (hỗ trợ cả xóa 1 và xóa nhiều)
  const confirmDelete = async () => {
    if (!deletingVariantId) return;

    try {
      if (deletingVariantId === "ALL_SELECTED") {
        // Xóa nhiều
        if (user) {
          await Promise.all(selectedItems.map(id => cartService.deleteItem(id)));
          fetchCart(); 
        } else {
          let cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
          cart = cart.filter(item => !selectedItems.includes(item.variantId));
          localStorage.setItem("guestCart", JSON.stringify(cart));
          setProducts(cart); 
        }
        setSelectedItems([]); // Reset danh sách chọn
        toast.success("Đã xóa các sản phẩm đã chọn");
      } else {
        // Xóa 1
        if (user) {
          await cartService.deleteItem(deletingVariantId);
          fetchCart(); 
        } else {
          let cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
          cart = cart.filter(item => item.variantId !== deletingVariantId);
          localStorage.setItem("guestCart", JSON.stringify(cart));
          setProducts(cart); 
        }
        setSelectedItems(prev => prev.filter(id => id !== deletingVariantId));
        toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
      }
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm!");
    } finally {
      setDeletingVariantId(null);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    if (!user) {
      setIsModalOpen(true);
    } else {
      router.push("/checkout");
    }
  };

  // Chỉ tính tổng tiền các sản phẩm ĐƯỢC CHỌN
  const totalPrice = products
    .filter(item => selectedItems.includes(item.variantId))
    .reduce((sum, item) => sum + (item.price * item.quantity), 0);

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
              {/* Checkbox chọn tất cả */}
              <label className="flex items-center gap-3 text-[14px] font-medium text-[#1d1d1f] cursor-pointer">
                <button 
                  type="button" 
                  onClick={handleSelectAll}
                  className={`w-[24px] h-[24px] border flex items-center justify-center rounded-sm transition-colors duration-200 ${isAllSelected ? 'bg-[#0071e3] border-[#0071e3]' : 'bg-white border-[#c9d1dc]'}`}
                >
                  {isAllSelected && <Check size={16} className="text-white" />}
                </button>
                Chọn tất cả ({products.length})
              </label>

              {/* Nút Xóa tất cả các sản phẩm đã chọn */}
              {selectedItems.length > 0 && (
                <button 
                  type="button"
                  onClick={handleDeleteSelected}
                  className="text-red-500 hover:text-red-700 font-medium text-[14px] flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Trash2 size={18} /> Xóa đã chọn ({selectedItems.length})
                </button>
              )}
            </div>

            <div className="space-y-5 mt-5">
              {isLoading ? (
                <div className="text-center py-10 text-[#6e6e73]">Đang tải giỏ hàng...</div>
              ) : products.length > 0 ? (
                products.map((item, index) => {
                  const isSelected = selectedItems.includes(item.variantId);
                  
                  return (
                    <div
                      key={item.variantId || index}
                      className={`bg-white border rounded-[10px] px-6 py-6 flex items-center gap-5 w-full shadow-sm transition-all duration-200 ${isSelected ? 'border-[#0071e3]/30 bg-[#f0f7ff]/30' : 'border-[#ececec]'}`}
                    >
                      {/* Checkbox Từng sản phẩm */}
                      <button 
                        type="button" 
                        onClick={() => handleSelectItem(item.variantId)}
                        className={`w-[24px] h-[24px] shrink-0 border flex items-center justify-center rounded-sm cursor-pointer transition-colors duration-200 ${isSelected ? 'bg-[#0071e3] border-[#0071e3]' : 'bg-white border-[#c9d1dc]'}`}
                      >
                        {isSelected && <Check size={16} className="text-white" />}
                      </button>

                      <div className="w-[110px] shrink-0">
                        <Image
                          src={getPublicUrl(item.image)}
                          alt={item.name || "Sản phẩm"}
                          width={102}
                          height={102}
                          className="w-[102px] h-[102px] object-cover rounded-sm"
                          unoptimized
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-[18px] font-bold text-[#1d1d1f] truncate">
                          {item.name}
                        </h3>
                        
                        <ProductVariantPopover 
                          key={`${item.variantId}-${variantsMap[item.productId]?.length || 0}`}
                          currentSelection={{ 
                            ...item, 
                            _id: item.variantId 
                          }} 
                          variants={variantsMap[item.productId] || []}
                          onOpen={() => handleLoadVariants(item)} 
                          onSelect={(newVariant) => handleUpdateVariant(item.variantId, newVariant)}
                        />

                        <p className={`mt-2 text-[14px] font-medium ${item.isAvailable !== false ? "text-green-600" : "text-red-500"}`}>
                          {item.isAvailable !== false ? "Còn hàng" : "Hết hàng"}
                        </p>
                        
                        <div className="mt-3 flex items-center w-[88px] h-[34px] rounded bg-[#f2f3f7] border border-gray-200">
                          <button 
                            type="button"
                            className="w-8 text-[#555] hover:bg-gray-200 h-full flex items-center justify-center cursor-pointer disabled:cursor-not-allowed rounded-l transition-colors" 
                            onClick={() => handleUpdateQuantity(item.variantId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <div className="flex-1 text-center text-[14px] font-medium bg-white">{item.quantity}</div>
                          <button 
                            type="button"
                            className="w-8 text-[#555] hover:bg-gray-200 h-full flex items-center justify-center cursor-pointer rounded-r transition-colors"
                            onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="w-[160px] shrink-0 text-right">
                        <div className="text-[20px] font-bold text-[#005fa9]">
                          {item.price?.toLocaleString("vi-VN")}đ
                        </div>
                        
                        {item.compareAtPrice > item.price && (
                          <div className="text-[13px] text-[#6e6e73] line-through mt-1">
                            {item.compareAtPrice?.toLocaleString("vi-VN")}đ
                          </div>
                        )}

                        <button 
                          type="button"
                          className="mt-6 text-red-500 hover:text-red-700 cursor-pointer transition inline-flex items-center gap-1 text-[13px] font-medium"
                          onClick={() => handleDeleteItem(item.variantId)}
                        >
                          <Trash2 size={16} /> Xóa
                        </button>   
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-[#ececec]">
                  <p className="text-lg text-[#6e6e73]">Giỏ hàng của bạn đang trống</p>
                  <Link href="/" className="mt-4 inline-block px-6 py-2.5 bg-[#0068b3] text-white rounded-lg font-medium hover:bg-[#00599a] transition">
                    Khám phá sản phẩm ngay
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white border border-[#e5e7eb] rounded-xl p-7 h-fit shadow-sm sticky top-[100px]">
            <h2 className="text-[18px] font-bold text-[#1d1d1f]">Tóm tắt đơn hàng</h2>
            
            <div className="mt-6 flex items-center justify-between text-[15px]">
              <span className="text-[#6e6e73]">Tạm tính ({selectedItems.length} sản phẩm)</span>
              <span className="font-semibold text-[#1d1d1f]">{totalPrice.toLocaleString("vi-VN")}đ</span>
            </div>

            <div className="mt-4 flex items-center justify-between text-[15px]">
              <span className="text-[#6e6e73]">Phí vận chuyển</span>
              <span className="font-semibold text-[#005b9f]">Miễn phí</span>
            </div>
            
            <div className="my-6 border-t border-[#e5e5e5]"></div>

            <div className="mb-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Nhập mã ưu đãi..." 
                  className="flex-1 border border-[#d8dde6] rounded-[8px] px-4 py-2 text-[14px] outline-none focus:border-[#0071e3] transition-colors"
                />
                <button type="button" className="px-4 py-2 cursor-pointer bg-[#48535b] text-white text-[14px] font-medium rounded-[8px] hover:bg-[#333] transition-colors">
                  Áp dụng
                </button>
              </div>
            </div>

            <div className="mt-2">
              <div className="flex items-start justify-between">
                <span className="text-[20px] font-bold text-[#1d1d1f]">Tổng cộng</span>
                <div className="text-right">
                  <div className="text-[24px] font-bold text-[#1d1d1f]">
                    {totalPrice.toLocaleString("vi-VN")}đ
                  </div>
                  <div className="text-[12px] italic font-medium text-[#7f7f7f] mt-1">
                    (Đã bao gồm VAT)
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleCheckout} 
              className="mt-8 w-full h-[56px] rounded-[10px] cursor-pointer bg-[#0068b3] text-white text-[18px] font-semibold shadow-md transition hover:bg-[#00599a] flex items-center justify-center gap-2"
            >
              Tiến hành thanh toán
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <LoginRequiredModal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)} 
            />

            <Link href="/" className="mt-4 block w-full text-center py-3.5 rounded-[10px] border-2 border-[#d8dde6] bg-white text-[15px] font-semibold text-[#222] transition hover:bg-[#f8f8f8]">
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa sản phẩm */}
      <ConfirmDeleteModal 
        isOpen={Boolean(deletingVariantId)}
        onClose={() => setDeletingVariantId(null)}
        onConfirm={confirmDelete}
        title={deletingVariantId === "ALL_SELECTED" ? "Xóa các sản phẩm đã chọn?" : "Xóa sản phẩm khỏi giỏ hàng?"}
        message={deletingVariantId === "ALL_SELECTED" 
          ? `Bạn có chắc chắn muốn xóa ${selectedItems.length} sản phẩm đã chọn khỏi giỏ hàng không?`
          : "Bạn có chắc chắn muốn xóa sản phẩm này không? Thao tác này không thể hoàn tác."
        }
      />
    </div>
  );
}
import { useState, useEffect, useMemo } from "react";
import { Star, Heart, ArrowLeftRight, Truck, ShieldCheck, RefreshCw, ChevronDown, ChevronUp, Sliders } from "lucide-react";
import * as cartService from "../../services/cartService"; 
import { useAuth } from "../../context/AuthContext";

export default function ProductInfo({ product, variants, onVariantChange }) {
  const { user } = useAuth();
  const variantList = variants?.data || [];

  // 1. Tự động gom nhóm tất cả các thuộc tính có trong variant
  const attributeGroups = useMemo(() => {
    const groups = new Map();

    variantList.forEach((v) => {
      (v.attributes || []).forEach((a) => {
        const attrDoc = a.attributeValueId?.attributeId;
        const attrVal = a.attributeValueId;

        if (attrDoc && attrVal) {
          const attrName = attrDoc.name;
          if (!groups.has(attrName)) {
            groups.set(attrName, new Set());
          }
          groups.get(attrName).add(attrVal.value);
        }
      });
    });

    const result = {};
    groups.forEach((valuesSet, key) => {
      result[key] = Array.from(valuesSet);
    });
    return result; 
  }, [variantList]);

  // Phân loại thuộc tính: "Màu sắc" để riêng bên ngoài, các thuộc tính còn lại gom nhóm
  const colorAttributeKey = Object.keys(attributeGroups).find(
    (key) => key.toLowerCase().includes("màu") || key.toLowerCase().includes("color")
  );

  const otherAttributeGroups = useMemo(() => {
    const others = {};
    Object.entries(attributeGroups).forEach(([key, values]) => {
      if (key !== colorAttributeKey) {
        others[key] = values;
      }
    });
    return others;
  }, [attributeGroups, colorAttributeKey]);

  // Điều kiện kiểm tra tổng số lượng nhóm thuộc tính (>= 3 thì gom nhóm cấu hình)
  const totalAttributeCount = Object.keys(attributeGroups).length;
  const shouldCollapseOthers = totalAttributeCount >= 3;

  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isConfigOpen, setIsConfigOpen] = useState(false); // Trạng thái mở/đóng khung cấu hình

  // Tự động chọn biến thể mặc định khi load
  useEffect(() => {
    if (variantList.length > 0 && !selectedVariant) {
      const defaultVariant = variantList.find(v => v.isDefault) || variantList[0];
      setSelectedVariant(defaultVariant);
      onVariantChange?.(defaultVariant);

      const initialSelection = {};
      (defaultVariant.attributes || []).forEach(a => {
        const attrName = a.attributeValueId?.attributeId?.name;
        const attrVal = a.attributeValueId?.value;
        if (attrName && attrVal) {
          initialSelection[attrName] = attrVal;
        }
      });
      setSelectedAttributes(initialSelection);
    }
  }, [variantList]);

  // Logic tìm biến thể dựa trên lựa chọn
  useEffect(() => {
    if (variantList.length === 0 || Object.keys(selectedAttributes).length === 0) return;

    const found = variantList.find((v) => {
      return Object.entries(selectedAttributes).every(([attrName, selectedVal]) => {
        return v.attributes.some(
          (a) => a.attributeValueId?.attributeId?.name === attrName && 
                 a.attributeValueId?.value === selectedVal
        );
      });
    });

    if (found) {
      setSelectedVariant(found);
      onVariantChange?.(found);
    }
  }, [selectedAttributes, variantList, onVariantChange]);

  const handleAttributeSelect = (attrName, value) => {
    setSelectedAttributes(prev => ({
      ...prev,
      [attrName]: value
    }));
  };

  if (!product) return <div>Đang tải thông tin sản phẩm...</div>;
  if (!selectedVariant) return <div>Đang tải cấu hình...</div>;

  const handleAddToCart = async () => {
    const isAvailable = selectedVariant && selectedVariant.stock > 0 && selectedVariant.isActive !== false;
    
    if (!isAvailable) {
      alert("Sản phẩm này hiện đã hết hàng hoặc không khả dụng!");
      return;
    }

    const variantAttributes = selectedVariant.attributes
      .map((a) => a.attributeValueId.value)
      .join(" / ");

    if (user) {
      try {
        await cartService.addToCart(selectedVariant._id, quantity, product._id);
        alert("Thêm vào giỏ hàng thành công!");
      } catch (error) {
        alert("Có lỗi xảy ra");
      }
    } else {
      const cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
      const idx = cart.findIndex((item) => item.variantId === selectedVariant._id);

      const currentQtyInCart = idx > -1 ? cart[idx].quantity : 0;
      if (currentQtyInCart + quantity > selectedVariant.stock) {
        alert(`Số lượng yêu cầu vượt quá tồn kho (Còn: ${selectedVariant.stock})`);
        return;
      }

      if (idx > -1) {
        cart[idx].quantity += quantity;
      } else {
        cart.push({
          variantId: selectedVariant._id,
          productId: product._id,
          quantity,
          name: product.name,
          price: selectedVariant.price,
          image: selectedVariant.image,
          variantName: variantAttributes,
          stock: selectedVariant.stock,
          isAvailable: true,
          compareAtPrice: selectedVariant.compareAtPrice || null
        });
      }
      localStorage.setItem("guestCart", JSON.stringify(cart));
      alert("Đã thêm vào giỏ hàng!");
    }
  };

  return (
    <div className="flex flex-col gap-5.5 w-full">
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight tracking-tight">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
          <div className="flex text-amber-500 items-center gap-0.5">
            {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" className="stroke-none" />)}
            <span className="font-bold text-gray-900 ml-1">4.9</span>
          </div>
          <span className="text-gray-200">|</span>
          <span>1.2k đánh giá</span>
          <span className="text-gray-300">|</span>
          <span>Đã bán {product.soldCount || 0}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 py-1">
        <span className="text-2xl font-bold text-[#005ba4]">
          {selectedVariant.price.toLocaleString()}đ
        </span>
        {selectedVariant.compareAtPrice > 0 && (
          <>
            <span className="text-sm text-gray-400 line-through">{selectedVariant.compareAtPrice.toLocaleString()}đ</span>
            <span className="bg-red-50 text-red-500 text-[10px] font-bold px-1.5 py-0.5 rounded">
              -{Math.round(((selectedVariant.compareAtPrice - selectedVariant.price) / selectedVariant.compareAtPrice) * 100)}%
            </span>
          </>
        )}
      </div>

      {/* 1. HIỂN THỊ THUỘC TÍNH MÀU SẮC Ở BÊN NGOÀI (NẾU CÓ) */}
      {colorAttributeKey && attributeGroups[colorAttributeKey] && (
        <div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{colorAttributeKey}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {attributeGroups[colorAttributeKey].map((val) => {
              const isSelected = selectedAttributes[colorAttributeKey] === val;
              return (
                <button
                  key={val}
                  onClick={() => handleAttributeSelect(colorAttributeKey, val)}
                  className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                    isSelected 
                      ? "bg-[#005ba4] text-white border-[#005ba4]" 
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {val}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. LOGIC HIỂN THỊ CÁC THUỘC TÍNH CÒN LẠI */}
      {shouldCollapseOthers ? (
        /* GIAO DIỆN GOM NHÓM (DÀNH CHO >= 3 THUỘC TÍNH NHƯ LAPTOP) */
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-4">
          <div 
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="flex items-center justify-between cursor-pointer select-none"
          >
            <div className="flex items-center gap-2">
              <Sliders size={16} className="text-[#005ba4]" />
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Lựa chọn cấu hình tùy chỉnh
              </span>
            </div>
            <button type="button" className="text-xs font-bold text-[#005ba4] flex items-center gap-1">
              {isConfigOpen ? "Thu gọn" : "Xem tất cả"} 
              {isConfigOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>

          {/* Nội dung thu gọn / mở rộng */}
          {isConfigOpen && (
            <div className="space-y-4 pt-3 border-t border-gray-200 animate-in fade-in duration-200">
              {Object.entries(otherAttributeGroups).map(([attrName, values]) => (
                <div key={attrName}>
                  <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{attrName}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {values.map((val) => {
                      const isSelected = selectedAttributes[attrName] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleAttributeSelect(attrName, val)}
                          className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                            isSelected 
                              ? "bg-[#005ba4] text-white border-[#005ba4]" 
                              : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* GIAO DIỆN BÌNH THƯỜNG (DÀNH CHO < 3 THUỘC TÍNH NHƯ ĐIỆN THOẠI) */
        Object.entries(otherAttributeGroups).map(([attrName, values]) => (
          <div key={attrName}>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">{attrName}</h3>
            <div className="flex flex-wrap items-center gap-2">
              {values.map((val) => {
                const isSelected = selectedAttributes[attrName] === val;
                return (
                  <button
                    key={val}
                    onClick={() => handleAttributeSelect(attrName, val)}
                    className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                      isSelected 
                        ? "bg-[#005ba4] text-white border-[#005ba4]" 
                        : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50"
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}

      {/* Bộ đếm số lượng */}
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-gray-200 rounded-md h-9 bg-white">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-2.5 h-full text-gray-500 hover:bg-gray-50 text-sm">−</button>
          <span className="w-8 text-center text-xs font-bold text-gray-800">{quantity}</span>
          <button onClick={() => setQuantity(Math.min(selectedVariant.stock, quantity + 1))} className="px-2.5 h-full text-gray-500 hover:bg-gray-50 text-sm">+</button>
        </div>
        <button className="p-2 border border-gray-200 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-50 transition-all"><Heart size={16} /></button>
        <button className="p-2 border border-gray-200 rounded-md text-gray-400 hover:text-blue-500 hover:bg-gray-50 transition-all"><ArrowLeftRight size={16} /></button>
      </div>

      <div className="flex items-center gap-3 text-[11px] font-medium">
        <span className="flex items-center gap-1 text-[#00a862] bg-[#e6f6f0] px-2 py-0.5 rounded font-bold">
          <span className="w-1 h-1 rounded-full bg-[#00a862]" /> {selectedVariant.stock > 0 ? "CÒN HÀNG" : "HẾT HÀNG"}
        </span>
        <span className="text-gray-500">📦 Chỉ còn {selectedVariant.stock} sản phẩm</span>
      </div>

      <div className="flex gap-3.5 mt-1 w-full">
        <button 
          onClick={handleAddToCart}
          className="flex-1 py-3 border border-[#005ba4] text-[#005ba4] text-xs font-bold rounded-md hover:bg-blue-50/40 transition-colors"
        >
          THÊM VÀO GIỎ HÀNG
        </button>
        <button className="flex-1 py-3 bg-[#005ba4] text-white text-xs font-bold rounded-md hover:bg-[#004b88] transition-colors shadow-sm">
          MUA NGAY
        </button>
      </div>

      {/* Cam kết */}
      <div className="grid grid-cols-3 gap-3 mt-2 w-full">
        <div className="flex flex-col items-center justify-center p-3.5 border border-gray-100 rounded-xl bg-[#fdfdfd] text-center">
          <Truck size={18} className="text-[#005ba4] mb-1" />
          <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wide leading-tight">Miễn phí vận chuyển</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3.5 border border-gray-100 rounded-xl bg-[#fdfdfd] text-center">
          <ShieldCheck size={18} className="text-[#005ba4] mb-1" />
          <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wide leading-tight">12 Tháng bảo hành</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3.5 border border-gray-100 rounded-xl bg-[#fdfdfd] text-center">
          <RefreshCw size={18} className="text-[#005ba4] mb-1" />
          <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wide leading-tight">Đổi trả trong 30 ngày</span>
        </div>
      </div>
    </div>
  );
}
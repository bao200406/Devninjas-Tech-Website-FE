import { useState, useEffect, useMemo  } from "react";
import { Star, Heart, ArrowLeftRight, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import * as cartService from "../../services/cartService"; // Đường dẫn đến file service của bạn
import { useAuth } from "../../context/AuthContext";


export default function ProductInfo({ product, variants, onVariantChange }) {
  // --- ĐẶT DEBUG Ở ĐÂY ---
  console.log("DEBUG [ProductInfo nhận props]:", {
    product,
    variants,
    isArray: Array.isArray(variants), // Phải in ra true thì mới đúng là mảng
    length: variants?.length
  });
  
  const { user } = useAuth();
  const variantList = variants?.data || [];

  const colors = useMemo(() => {
    const colorMap = new Map();
    variantList.flatMap((v) => v.attributes || [])
      .filter((a) => a.attributeValueId?.attributeId?.name === "Màu sắc")
      .forEach((a) => {
        const attrValue = a.attributeValueId;
        if (!colorMap.has(attrValue.value)) {
          colorMap.set(attrValue.value, { name: attrValue.value });
        }
      });
    return Array.from(colorMap.values());
  }, [variantList]);

  const storages = useMemo(() => {
    return Array.from(new Set(
      variantList.flatMap((v) => v.attributes || [])
        .filter((a) => a.attributeValueId?.attributeId?.name === "Dung lượng")
        .map((a) => a.attributeValueId.value)
    ));
  }, [variantList]);

  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // 1. Tự động chọn biến thể mặc định (hoặc phần tử đầu tiên)
  useEffect(() => {
    if (variantList.length > 0 && !selectedVariant) {
      const defaultVariant = variantList.find(v => v.isDefault) || variantList[0];
      setSelectedVariant(defaultVariant);
      onVariantChange?.(defaultVariant);

      // Gán giá trị màu/dung lượng nếu có tồn tại trong attributes của variant đó
      const colorAttr = defaultVariant.attributes?.find(a => a.attributeValueId?.attributeId?.name === "Màu sắc");
      const storageAttr = defaultVariant.attributes?.find(a => a.attributeValueId?.attributeId?.name === "Dung lượng");
      
      if (colorAttr) setSelectedColor(colorAttr.attributeValueId.value);
      if (storageAttr) setSelectedStorage(storageAttr.attributeValueId.value);
    }
  }, [variantList]);

  // 2. Logic tìm biến thể dựa trên lựa chọn Màu sắc hoặc Dung lượng
  useEffect(() => {
    if (variantList.length === 0) return;

    const found = variantList.find((v) => {
      const vals = v.attributes.map((a) => a.attributeValueId?.value);
      
      // Khớp theo những gì người dùng đang chọn
      const matchColor = selectedColor ? vals.includes(selectedColor) : true;
      const matchStorage = selectedStorage ? vals.includes(selectedStorage) : true;

      return matchColor && matchStorage;
    });

    if (found) {
      setSelectedVariant(found);
      onVariantChange?.(found);
    }
  }, [selectedColor, selectedStorage, variantList, onVariantChange]);

  // Loading state
  if (!product) return <div>Đang tải thông tin sản phẩm...</div>;
  if (!selectedVariant) return <div>Đang tải cấu hình...</div>;

  const handleAddToCart = async () => {
    // 1. Tính toán logic kiểm tra hàng (giống Backend)
    const isAvailable = selectedVariant && selectedVariant.stock > 0 && selectedVariant.isActive !== false;
    
    // 2. Chặn nếu sản phẩm hết hàng hoặc không khả dụng
    if (!isAvailable) {
      alert("Sản phẩm này hiện đã hết hàng hoặc không khả dụng!");
      return;
    }

    // 3. Chuẩn bị dữ liệu hiển thị (tương tự như Backend trả về)
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

      // Kiểm tra số lượng tồn kho trước khi thêm vào localStorage
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
          productId: product._id, // <--- THÊM DÒNG NÀY ĐỂ ĐỒNG BỘ
          quantity,
          name: product.name,
          price: selectedVariant.price,
          image: selectedVariant.image,
          variantName: variantAttributes,
          stock: selectedVariant.stock, // Lưu stock mới nhất vào localStorage
          isAvailable: true, // Gắn flag để Frontend dùng hiển thị
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

      {/* Màu sắc */}
      {/* Màu sắc - Hiển thị dạng Tag với giá trị value */}
        <div>
          <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Màu sắc</h3>
          <div className="flex flex-wrap items-center gap-2">
            {colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedColor(c.name)}
                className={`px-4 py-2 text-xs font-medium rounded-lg border transition-all ${
                  selectedColor === c.name 
                    ? "bg-[#005ba4] text-white border-[#005ba4]" // Trạng thái đang chọn (Active)
                    : "bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50" // Trạng thái bình thường
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

      {/* Dung lượng */}
      <div>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Dung lượng</h3>
        <div className="flex items-center gap-2">
          {storages.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStorage(s)}
              className={`px-4 py-1.5 text-xs font-medium rounded-md border transition-all ${
                selectedStorage === s 
                  ? "bg-[#005ba4] text-white border-[#005ba4]" 
                  : "bg-[#f1f3f5] text-gray-700 border-transparent hover:border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

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
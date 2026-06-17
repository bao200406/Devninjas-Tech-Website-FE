import { useState, useEffect, useMemo  } from "react";
import { Star, Heart, ArrowLeftRight, Truck, ShieldCheck, RefreshCw } from "lucide-react";
import * as cartService from "../../services/cartService"; // Đường dẫn đến file service của bạn

export default function ProductInfo({ product, variants }) {
  const variantList = variants?.data || [];

  console.log("Dữ liệu variant nhận được từ Props:", variants);

  if (variants?.data?.length > 0) {
  console.log("Cấu trúc của biến thể đầu tiên:", JSON.stringify(variants.data[0], null, 2));
}

  // 1. Trích xuất danh sách thuộc tính duy nhất từ toàn bộ biến thể
  const allAttributes = variantList.flatMap((v) => v.attributes || []);

  // 2. Dùng useMemo để cố định tham chiếu của mảng
  const colors = useMemo(() => {
    const allAttributes = variantList.flatMap((v) => v.attributes || []);
    return Array.from(
      new Set(
        allAttributes
          .filter((a) => a.attributeValueId?.attributeId?.name === "Màu sắc")
          .map((a) => a.attributeValueId.value)
      )
    );
  }, [variantList]); // Chỉ tính lại khi variantList thay đổi

  const storages = useMemo(() => {
    const allAttributes = variantList.flatMap((v) => v.attributes || []);
    return Array.from(
      new Set(
        allAttributes
          .filter((a) => a.attributeValueId?.attributeId?.name === "Dung lượng")
          .map((a) => a.attributeValueId.value)
      )
    );
  }, [variantList]);

  // 2. State cho lựa chọn người dùng
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedStorage, setSelectedStorage] = useState(storages[0]);
  const [selectedVariant, setSelectedVariant] = useState(variantList[0]);
  const [quantity, setQuantity] = useState(1);

  // 3. Khi danh sách variants thay đổi, cập nhật mặc định
  useEffect(() => {
    if (variantList.length > 0) {
      const first = variantList[0];
      setSelectedVariant(first);
      
      // Tự động chọn giá trị dựa trên biến thể đầu tiên
      const firstVals = first.attributes.map((a) => a.attributeValueId.value);
      setSelectedColor(firstVals.find((v) => colors.includes(v)));
      setSelectedStorage(firstVals.find((v) => storages.includes(v)));
    }
  }, [variantList]);

  // 4. Logic tìm biến thể khi người dùng thay đổi lựa chọn
  useEffect(() => {
    const found = variantList.find((v) => {
      const vals = v.attributes.map((a) => a.attributeValueId.value);
      return vals.includes(selectedColor) && vals.includes(selectedStorage);
    });
    if (found) setSelectedVariant(found);
  }, [selectedColor, selectedStorage, variantList]);

  if (!product || !selectedVariant) return null;

    const handleAddToCart = async () => {
    try {
      // selectedVariant.variantId chính là ID của biến thể đang được chọn
      // quantity là state số lượng người dùng đã chọn
      await cartService.addToCart(selectedVariant._id, quantity);
      
      alert("Thêm vào giỏ hàng thành công!"); 
      // Gợi ý: Dùng toast (như react-hot-toast) thay cho alert sẽ chuyên nghiệp hơn
    } catch (error) {
      console.error("Lỗi thêm vào giỏ:", error);
      alert(error.response?.data?.message || "Có lỗi xảy ra khi thêm vào giỏ hàng");
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
      <div>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Màu sắc</h3>
        <div className="flex items-center gap-2.5">
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedColor(c)}
              className={`w-6.5 h-6.5 rounded-full relative transition-transform ${selectedColor === c ? "ring-2 ring-offset-2 ring-gray-900 scale-105" : "hover:scale-105"}`}
              style={{ backgroundColor: c.toLowerCase().includes('đen') ? '#333' : c.toLowerCase().includes('trắng') ? '#eee' : '#ccc' }}
            />
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
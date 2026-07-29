import { useState } from "react";
import ProductReviews from "./ProductReviews"; // Import component con vào
import ProductSpecifications from "./ProductSpecifications"; // Import component thông số kỹ thuật

export default function ProductTabs({ product }) {
  // Thay vì chỉ nhận productId, nhận nguyên object product để lấy specifications và description
  const productId = product?._id;
  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="w-full mx-auto p-4 font-sans">
      {/* Thanh tab */}
      <div className="flex border-b border-gray-200 overflow-x-auto whitespace-nowrap gap-8 w-full">
        {[
          { id: "description", label: "Mô tả" },
          { id: "specifications", label: "Thông số kỹ thuật" },
          { id: "policy", label: "Chính sách" },
          { id: "reviews", label: "Đánh giá (37)" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold tracking-wide border-b-2 transition-all relative ${
              activeTab === tab.id
                ? "border-[#d70018] text-[#d70018]"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nội dung tab */}
      <div className="mt-6 w-full">
        {activeTab === "description" && (
          <div className="p-6 bg-white rounded-2xl border text-slate-700 leading-relaxed">
            {product?.description || "Mô tả sản phẩm..."}
          </div>
        )}

        {/* Đã thay thế phần thông số kỹ thuật cũ bằng component chuẩn UI đẹp mắt */}
        {activeTab === "specifications" && (
          <ProductSpecifications specifications={product?.specifications} />
        )}

        {activeTab === "policy" && (
          <div className="p-6 bg-white rounded-2xl border text-slate-700 space-y-2">
            <p className="font-bold">Chính sách bảo hành:</p>
            <p>1 đổi 1 trong vòng 30 ngày nếu có lỗi từ nhà sản xuất.</p>
            <p>Bảo hành chính hãng 12 tháng tại trung tâm ủy quyền.</p>
          </div>
        )}
        
        {/* Gọi component con ra đây và truyền productId */}
        {activeTab === "reviews" && <ProductReviews productId={productId} />}
      </div>
    </div>
  );
}
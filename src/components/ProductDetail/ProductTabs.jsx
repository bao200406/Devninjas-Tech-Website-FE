import { useState } from "react";
import ProductReviews from "./ProductReviews"; // Import component con vào

export default function ProductTabs({ productId }) {
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
        {activeTab === "description" && <div className="p-6 bg-white rounded-2xl border">Mô tả sản phẩm...</div>}
        {activeTab === "specifications" && <div className="p-6 bg-white rounded-2xl border">Thông số kỹ thuật...</div>}
        {activeTab === "policy" && <div className="p-6 bg-white rounded-2xl border">Chính sách...</div>}
        
        {/* Gọi component con ra đây và truyền productId */}
        {activeTab === "reviews" && <ProductReviews productId={productId} />}
      </div>
    </div>
  );
}
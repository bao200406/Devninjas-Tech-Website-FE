import { useState } from "react";

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="w-full">
      {/* Thanh tab trải dài */}
      <div className="flex border-b border-gray-100 overflow-x-auto whitespace-nowrap gap-8 w-full">
        {[{ id: "description", label: "Mô tả" }, { id: "specifications", label: "Thông số kỹ thuật" }, { id: "policy", label: "Chính sách" }, { id: "reviews", label: "Đánh giá (1,248)" }].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-sm font-bold tracking-wide border-b-2 transition-all relative ${activeTab === tab.id ? "border-[#005ba4] text-[#005ba4]" : "border-transparent text-gray-400 hover:text-gray-600"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Nội dung Tab - Ép sát sang hai biên */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mt-8 items-start w-full">
        {/* Khối mô tả chiếm 5/12 cột */}
        <div className="lg:col-span-5 text-sm text-gray-600 space-y-4 leading-relaxed w-full">
          <p>iPhone 15 Pro Max là chiếc iPhone đầu tiên có thiết kế bằng titan chuẩn hãng không vũ trụ, cực bền và siêu nhẹ.</p>
          <p>Sở hữu nút Action mới thay thế thanh gạt truyền thống, cùng cụm camera zoom quang học 5x sắc nét đỉnh cao.</p>

          <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-gray-100/80 mt-6 w-full">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">Thông số nổi bật:</h4>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-200/50"><span className="text-gray-400">Chip xử lý</span><span className="font-bold text-gray-900">A17 Pro (3nm)</span></div>
              <div className="flex justify-between py-1.5 border-b border-gray-200/50"><span className="text-gray-400">Bộ nhớ RAM</span><span className="font-bold text-gray-900">8GB LPDDR5X</span></div>
              <div className="flex justify-between py-1.5"><span className="text-gray-400">Màn hình</span><span className="font-bold text-gray-900"> Super Retina XDR OLED</span></div>
            </div>
          </div>
        </div>

        {/* Khối Banner lớn bên phải chiếm 7/12 cột còn lại - Tự động giãn bung kịch biên mạn phải */}
        <div className="lg:col-span-7 bg-gray-900 rounded-2xl overflow-hidden aspect-[16/10] flex items-center justify-center border border-gray-800 w-full">
          <span className="text-gray-500 text-xs font-medium">Banner thiết kế của sản phẩm (Bung full cột phải)</span>
        </div>
      </div>
    </div>
  );
}
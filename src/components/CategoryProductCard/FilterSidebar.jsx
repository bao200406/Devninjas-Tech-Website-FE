"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getFiltersByCategory } from "../../services/categoryAttributeService";


export default function FilterSidebar({ categoryId, categoryName, priceGroupName = "price", isOpen, onClose, filters = { minPrice: null, maxPrice: null, attributeValueIds: [] }, setFilters, onApply, onReset }) {
  
    const [filterGroups, setFilterGroups] = useState([]);

      // Chỉ hiển thị những thuộc tính được phép theo từng danh mục
    const getVisibleFilterGroups = (groups) => {
  const category = categoryName?.trim().toLowerCase();

    if (category === "điện thoại") {
      return groups.filter((group) => 
        ["màu sắc", "dung lượng"].includes(
          group.attributeId?.name?.trim().toLowerCase()
        )
      );
    }

    // Bộ lọc Laptop
    if (category === "laptop") {
      return groups.filter((group) => 
        ["ổ cứng", "ram", "cpu", "màu sắc"].includes(
          group.attributeId?.name?.trim().toLowerCase()
        )
      );
    }

    // Các danh mục khác giữ nguyên dữ liệu từ API
    return groups;
  };

  // const [filterGroups, setFilterGroups] = useState([]);
  const [price, setPrice] = useState(20000000);
  // Hàm xử lý thay đổi giá
  const handlePriceChange = (min, max) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  // Gọi API lấy bộ lọc động theo categoryId và reset state filter khi đổi danh mục
  useEffect(() => {
    if (categoryId) {
      getFiltersByCategory(categoryId)
        .then((res) => {
          console.log("CATEGORY ID:", categoryId);
          console.log("FILTER RESPONSE:", JSON.stringify(res, null, 2));
          console.log("FILTER SUCCESS:", res?.success);
          console.log("FILTER DATA:", res?.data);

          if (res.success) {
            setFilterGroups(res.data);
          }
        })
        .catch((error) => {
          console.error("FILTER ERROR:", error);
          console.error("FILTER RESPONSE ERROR:", error.response?.data);
          console.error("FILTER STATUS:", error.response?.status);
        });
      }
  }, [categoryId, setFilters]);

  const toggleAttribute = (id) => {
    setFilters(prev => {
      const currentIds = prev.attributeValueIds || [];
      const newIds = currentIds.includes(id) 
        ? currentIds.filter(item => item !== id) 
        : [...currentIds, id];
      return { ...prev, attributeValueIds: newIds };
    });
  };

  console.log("Dữ liệu filterGroups:", filterGroups);
  console.log("CATEGORY NAME:", categoryName);
  console.log("CATEGORY ID:", categoryId);
  console.log("VISIBLE FILTERS:", getVisibleFilterGroups(filterGroups));
  

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white p-6 rounded-none lg:rounded-2xl 
        border border-gray-100 shadow-xl lg:shadow-sm h-screen lg:h-fit overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="font-bold text-lg">BỘ LỌC</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        {/* KHOẢNG GIÁ */}
        <h3 className="font-bold text-gray-900 mb-4">KHOẢNG GIÁ</h3>
        <div className="space-y-3 mb-6">
          {[
            { label: 'Dưới 10.000.000đ', min: 0, max: 10000000 },
            { label: '10tr - 20tr', min: 10000000, max: 20000000 },
            { label: 'Trên 20.000.000đ', min: 20000000, max: 50000000 }
          ].map((item, i) => (
            <label key={i} className="flex items-center gap-3 text-sm cursor-pointer">
              <input 
                type="radio"
                name={priceGroupName}
                className="accent-blue-900"
                onChange={() => handlePriceChange(item.min, item.max)}
                checked={filters.minPrice === item.min && filters.maxPrice === item.max}
              />
              {item.label}
            </label>
          ))}
        </div>

            <div className="mb-7">
          <div className="flex items-center justify-between mb-2 text-xs text-gray-600">
            <span>0đ</span>
            <span>{(filters.maxPrice ?? 20000000).toLocaleString("vi-VN")}đ</span>
          </div>
          <div className="relative h-6">
            <div className="absolute top-2.5 left-0 right-0 h-1 rounded bg-gray-200" />
            <div
              className="absolute top-2.5 h-1 rounded bg-blue-900"
              style={{
                left: "0%",
                right: `${100 - ((filters.maxPrice ?? 20000000) / 50000000) * 100}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max="50000000"
              step="500000"
              value={filters.maxPrice ?? 20000000}
              onChange={(event) => handlePriceChange(0, Number(event.target.value))}
              className="absolute inset-0 w-full appearance-none bg-transparent accent-blue-900 [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:-translate-y-1.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-900"
              aria-label="Giá tối đa"
            />
          </div>
        </div>
        
        
        {/* DUNG LƯỢNG & CÁC THUỘC TÍNH ĐỘNG */}
        {getVisibleFilterGroups(filterGroups)?.map((group) => (
        <div key={group.attributeId?._id } className="mb-6">
          <h3 className="font-bold text-gray-900 mb-4 uppercase">
            {group.attributeId?.name || "Đang tải..."}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Thêm ?. vào group.values để tránh lỗi nếu values không tồn tại */}
            {group.values?.map((val) => (
              <button 
                key={val._id} 
                onClick={() => toggleAttribute(val._id)}
                className={`py-2 text-xs border rounded-lg transition-colors ${
                  filters.attributeValueIds?.includes(val._id) 
                    ? 'border-blue-900 bg-blue-50 text-blue-900' 
                    : 'hover:border-blue-900'
                }`}
              >
                {val.value}
              </button>
            ))}
          </div>
        </div>
      ))}

        {/* NÚT HÀNH ĐỘNG */}
        <button onClick={onApply} className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg mb-3">Áp dụng bộ lọc</button>
        <button onClick={onReset} className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-lg">Thiết lập lại</button>
      </div>
    </>
  );
}
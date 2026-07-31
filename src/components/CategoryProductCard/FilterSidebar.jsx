"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getFiltersByCategory } from "../../services/categoryAttributeService";

export default function FilterSidebar({ categoryId, isOpen, onClose, filters = { minPrice: null, maxPrice: null, attributeValueIds: [] }, setFilters, onApply, onReset }) {
  
    const [filterGroups, setFilterGroups] = useState([]);

  // Hàm xử lý thay đổi giá
  const handlePriceChange = (min, max) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  // Gọi API lấy bộ lọc động theo categoryId và reset state filter khi đổi danh mục
  useEffect(() => {
    if (categoryId) {
      setFilters({ minPrice: null, maxPrice: null, attributeValueIds: [] });

      getFiltersByCategory(categoryId).then((res) => {
        if (res.success) setFilterGroups(res.data);
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
                type="radio" name="price" className="accent-blue-900" 
                onChange={() => handlePriceChange(item.min, item.max)}
                checked={filters.minPrice === item.min && filters.maxPrice === item.max}
              />
              {item.label}
            </label>
          ))}
        </div>
        
        
        {/* DUNG LƯỢNG & CÁC THUỘC TÍNH ĐỘNG */}
        {filterGroups?.map((group) => (
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
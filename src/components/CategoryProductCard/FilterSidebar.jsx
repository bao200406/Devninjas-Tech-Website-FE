"use client";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
// import { getFiltersByCategory } from "../../services/categoryAttributeService";

export default function FilterSidebar({
  categoryId,
  categoryFilters = [],
  isOpen,
  onClose,
  filters = {
    minPrice: null,
    maxPrice: null,
    attributeValueIds: [],
  },
  setFilters,
  onApply,
  onReset,
}) {
  
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
  // useEffect(() => {
  //   if (categoryId) {
  //     setFilters({ minPrice: null, maxPrice: null, attributeValueIds: [] });

  //     getFiltersByCategory(categoryId).then((res) => {
  //       if (res.success) setFilterGroups(res.data);
  //     });
  //   }
  // }, [categoryId, setFilters]);

  const toggleAttribute = (id) => {
    setFilters(prev => {
      const currentIds = prev.attributeValueIds || [];
      const newIds = currentIds.includes(id) 
        ? currentIds.filter(item => item !== id) 
        : [...currentIds, id];
      return { ...prev, attributeValueIds: newIds };
    });
  };

  console.log("Dữ liệu categoryFilters:", categoryFilters);

  console.log(filters.minPrice, filters.maxPrice);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}

      <div className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white
          px-6 py-7 rounded-none lg:rounded-2xl border border-[#ECECEC]
          shadow-lg lg:shadow-sm h-screen lg:h-fit overflow-y-auto transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
        
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="text-[22px] font-bold text-[#222]">BỘ LỌC</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full"><X size={20} /></button>
        </div>

        {/* KHOẢNG GIÁ */}
        <h3 className="font-bold text-gray-900 mb-4">KHOẢNG GIÁ</h3>
        <div className="space-y-3 mb-6">
          {[
            { label: "Dưới 10.000.000đ", min: 0, max: 10000000 },
            { label: "10tr - 20tr", min: 10000000, max: 20000000 },
            { label: "Trên 20.000.000đ", min: 20000000, max: 50000000 },
          ].map((item, i) => (
            <label
              key={i}
              className="flex items-center gap-3 text-sm cursor-pointer select-none"
            >
              <input
                type="radio"
                name="price"
                className="w-5 h-5 cursor-pointer accent-blue-600"
                // checked={
                //   filters.minPrice === item.min &&
                //   filters.maxPrice === item.max
                // }
                onChange={() => handlePriceChange(item.min, item.max)}
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
        
        
        {/* DUNG LƯỢNG & CÁC THUỘC TÍNH ĐỘNG */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>0đ</span>
            <span>{price.toLocaleString("vi-VN")}đ</span>
          </div>

          <input
            type="range"
            min={0}
            max={50000000}
            step={500000}
            value={price}
            onChange={(e) => {
              const value = Number(e.target.value);
              setPrice(value);

              setFilters((prev) => ({
                ...prev,
                minPrice: 0,
                maxPrice: value,
              }));
            }}
            className="w-full accent-blue-900 cursor-pointer"
          />
        </div>
        {categoryFilters?.map((group) => (
          <div key={group._id} className="mb-6">

            <h3 className="text-[18px] font-bold text-[#1F1F1F] uppercase mb-5">
              {group.name}
            </h3>

            <div className="grid grid-cols-2 gap-x-3 gap-y-3">
              {group.values.map((val) => {
                const active = filters.attributeValueIds.includes(val._id);

                return (
                  <button
                    key={val._id}
                    onClick={() => toggleAttribute(val._id)}
                    className={`
                      w-full
                      h-[40px]
                      rounded-[10px]
                      border
                      text-[15px]
                      font-normal
                      transition-all
                      duration-200
                      ${
                        active
                          ? "bg-[#1E3A8A] border-[#1E3A8A] text-white"
                          : "bg-white border-[#BDBDBD] text-[#333] hover:border-[#1E3A8A]"
                      }
                    `}
                  >
                    {val.value}
                  </button>
                );
              })}
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
import { X } from "lucide-react"; // Import thêm X để đóng sidebar trên mobile

export default function FilterSidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay: Chỉ hiện trên mobile khi sidebar mở để làm mờ nền */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container: Thêm class fixed cho mobile và static cho desktop */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white p-6 rounded-none lg:rounded-2xl 
        border border-gray-100 shadow-xl lg:shadow-sm h-screen lg:h-fit overflow-y-auto
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Nút đóng (Chỉ hiện trên mobile) */}
        <div className="flex justify-between items-center mb-6 lg:hidden">
          <h2 className="font-bold text-lg">BỘ LỌC</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* --- NỘI DUNG GỐC CỦA BẠN (GIỮ NGUYÊN 100%) --- */}
        <h3 className="font-bold text-gray-900 mb-4">KHOẢNG GIÁ</h3>
        <div className="space-y-3 mb-6">
          {['Dưới 10.000.000đ', '10tr - 20tr', 'Trên 20.000.000đ'].map((label, i) => (
            <label key={i} className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="radio" name="price" className="accent-blue-900" />
              {label}
            </label>
          ))}
        </div>
        
        <div className="mb-6">
          <div className="h-1 bg-gray-200 rounded-full mb-2">
            <div className="h-1 bg-blue-900 w-1/2 rounded-full relative">
              <span className="absolute -top-1 right-0 w-3 h-3 bg-blue-900 rounded-full"></span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500"><span>0đ</span><span>50.000.000đ</span></div>
        </div>

        <h3 className="font-bold text-gray-900 mb-4">THƯƠNG HIỆU</h3>
        <div className="space-y-3 mb-6">
          {['Apple', 'Samsung', 'Google Pixel'].map((brand) => (
            <label key={brand} className="flex items-center gap-3 text-sm">
              <input type="checkbox" className="rounded border-gray-300 text-blue-900" />
              {brand}
            </label>
          ))}
        </div>

        <h3 className="font-bold text-gray-900 mb-4">DUNG LƯỢNG</h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {['128GB', '256GB', '512GB', '1TB'].map((cap) => (
            <button key={cap} className="py-2 text-xs border rounded-lg hover:border-blue-900">{cap}</button>
          ))}
        </div>

        <h3 className="font-bold text-gray-900 mb-4">MÀU SẮC</h3>
        <div className="flex gap-3 mb-8">
          {['bg-gray-200', 'bg-gray-800', 'bg-gray-100', 'bg-blue-900'].map((color, i) => (
            <div key={i} className={`w-8 h-8 rounded-full border border-gray-300 ${color}`}></div>
          ))}
        </div>

        <button onClick={onClose} className="w-full py-3 bg-blue-900 text-white font-bold rounded-lg mb-3">Áp dụng bộ lọc</button>
        <button className="w-full py-3 bg-gray-200 text-gray-700 font-bold rounded-lg">Thiết lập lại</button>
        {/* --- KẾT THÚC NỘI DUNG GỐC --- */}
      </div>
    </>
  );
}
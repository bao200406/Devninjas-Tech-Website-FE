import { Award, Play, Share2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#F8F9FA] border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Cột 1: Logo & Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#0052A3]">Azure Logic</h2>
          <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
            Điểm đến tin cậy cho những người yêu công nghệ tại Việt Nam. 
            Chúng tôi tuyển chọn những sản phẩm tốt nhất với trải nghiệm mua sắm đẳng cấp.
          </p>
          <div className="flex gap-2">
            <div className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"><Award size={18} /></div>
            <div className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"><Play size={18} /></div>
            <div className="p-2 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300"><Share2 size={18} /></div>
          </div>
        </div>

        {/* Cột 2: Hỗ trợ khách hàng */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">HỖ TRỢ KHÁCH HÀNG</h3>
          <ul className="text-sm text-gray-600 space-y-3">
            <li className="hover:text-[#0052A3] cursor-pointer">Trung tâm hỗ trợ</li>
            <li className="hover:text-[#0052A3] cursor-pointer">Chính sách bảo hành</li>
            <li className="hover:text-[#0052A3] cursor-pointer">Điều khoản dịch vụ</li>
            <li className="hover:text-[#0052A3] cursor-pointer">Tra cứu đơn hàng</li>
          </ul>
        </div>

        {/* Cột 3: Thông tin công ty */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">THÔNG TIN CÔNG TY</h3>
          <ul className="text-sm text-gray-600 space-y-3">
            <li className="hover:text-[#0052A3] cursor-pointer">Về TechCurator</li>
            <li className="hover:text-[#0052A3] cursor-pointer">Hệ thống cửa hàng</li>
            <li className="hover:text-[#0052A3] cursor-pointer">Tuyển dụng</li>
            <li className="hover:text-[#0052A3] cursor-pointer">Liên hệ</li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận tin */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">ĐĂNG KÝ NHẬN TIN</h3>
          <p className="text-sm text-gray-500 mb-4">Nhận ngay ưu đãi hấp dẫn và tin tức công nghệ mới nhất.</p>
          <div className="flex border rounded-lg bg-white p-1">
            <input 
              type="email" 
              placeholder="Email của bạn" 
              className="w-full px-3 py-2 text-sm outline-none"
            />
            <button className="bg-[#0052A3] text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition">
              Gửi
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
import { Award, Play, Share2 } from "lucide-react";
import Logo from "./logo/Logo";
import Link from "next/link";
export default function Footer() {
  return (
    <footer className="bg-[#F8F9FA] border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-6 xl:px-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Cột 1: Logo & Info */}
        <div className="space-y-2 max-w-sm">
          <Logo />
          <p className="text-sm text-gray-500 leading-relaxed max-w-sm">
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
            <li><Link href="/support" className="hover:text-[#0052A3]">Trung tâm hỗ trợ</Link></li>
            <li><Link href="/warranty"className="hover:text-[#0052A3] cursor-pointer">Chính sách bảo hành</Link></li>
            <li><Link href="/terms" className="hover:text-[#0052A3] cursor-pointer">Điều khoản dịch vụ</Link></li>
            <li><Link href="/faq" className="hover:text-[#0052A3] cursor-pointer">Câu hỏi thường gặp</Link></li>
          </ul>
        </div>

        {/* Cột 3: Thông tin công ty */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">THÔNG TIN CÔNG TY</h3>
          <ul className="text-sm text-gray-600 space-y-3">
            <li><Link href="/about" className="hover:text-[#0052A3] cursor-pointer">Về Devninjas</Link></li>
            <li><Link href="/stores" className="hover:text-[#0052A3] cursor-pointer">Hệ thống cửa hàng</Link></li>
            <li><Link href="/careers" className="hover:text-[#0052A3] cursor-pointer">Tuyển dụng</Link></li>
            <li><Link href="/contact" className="hover:text-[#0052A3] cursor-pointer">Liên hệ</Link></li>
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
import React from 'react';
import { BadgeCheck } from 'lucide-react';

const Step4 = () => {
  return (
    <div className="text-center">
      {/* Icon Thành công */}
      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <BadgeCheck className="text-[#00477a]" size={40} />
      </div>
      
      <h2 className="text-xl font-bold text-slate-900 mb-2">Mật khẩu đã được cập nhật thành công</h2>
      <p className="text-slate-500 mb-8 text-sm px-4">
        Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
      </p>

      {/* Nút Đăng nhập */}
      <button 
        onClick={() => window.location.href = '/login'}
        className="w-full py-3 bg-[#00477a] text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors mb-8"
      >
        Đăng nhập ngay
      </button>

      {/* Liên hệ hỗ trợ */}
      <p className="text-sm text-slate-500">
        Gặp vấn đề? <a href="/support" className="text-[#00477a] font-bold underline">Liên hệ hỗ trợ</a>
      </p>
    </div>
  );
};

export default Step4;
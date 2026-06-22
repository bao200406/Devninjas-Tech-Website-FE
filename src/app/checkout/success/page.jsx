import React from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight, Copy } from "lucide-react";
import PrintButton from "@/components/button/PrintButton";

// 🔥 IMPORT CHÍNH HÀM SERVICE CỦA BẠN
// (Thay đổi đường dẫn "../" cho đúng với cấu trúc thư mục thực tế của bạn)
import { getOrderById } from "../../../services/orderService"; 
// 1. Import thư viện lấy cookie của Next.js
import { cookies } from "next/headers";

export default async function CheckoutSuccessPage({ searchParams }) {
    // Next.js 15+ yêu cầu await searchParams
    const { order_id } = await searchParams;

    let order = null;

    // Gọi API thông qua Service của bạn
    if (order_id) {
    try {
        // 1. Lấy cookie từ trình duyệt gửi lên Server (Next.js 15+ bắt buộc phải có await)
        const cookieStore = await cookies();
        const cookieString = cookieStore.toString();

        // 2. Gọi hàm và truyền cookie vào tham số thứ hai (config)
        const result = await getOrderById(order_id, {
        headers: {
            Cookie: cookieString, // Bơm cookie vào đây để Backend xác thực danh tính
        },
        });

        // Dựa vào ảnh console.log trước của bạn: Backend trả về { data: { orderCode: ... } }
        // Vì hàm orderService của bạn đã return response.data rồi, nên result lúc này chính là bọc { data: {...} }
        order = result.data || result; 
        
    } catch (error) {
        console.error("Lỗi khi gọi getOrderById từ Service:", error);
    }
    }

  // Giao diện xử lý khi không tìm thấy đơn hàng
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased font-sans">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-50 text-slate-400 rounded-full mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 tracking-tight">Không tìm thấy đơn hàng</h2>
          <p className="text-slate-500 text-sm mt-2 leading-relaxed">
            Mã đơn hàng không hợp lệ hoặc bạn không có quyền truy cập. Vui lòng kiểm tra lại.
          </p>
          <Link 
            href="/dashboard/orders" 
            className="mt-6 inline-flex items-center justify-center w-full bg-slate-900 text-white text-sm font-medium py-3 px-5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            Về lịch sử đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans antialiased selection:bg-emerald-500/10">
      <div className="max-w-3xl mx-auto">
        
        {/* --- Header Status --- */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full mb-4 ring-8 ring-emerald-500/5">
            <CheckCircle2 className="w-10 h-10" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Thanh toán thành công!
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-500 max-w-md mx-auto">
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Hệ thống đang chuẩn bị đơn hàng cho bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Cột trái: Chi tiết đơn hàng */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Mã đơn hàng & Thời gian */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Mã đơn hàng</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-base font-bold text-slate-800 tracking-wide">{order.id}</span>
                    <button className="text-slate-400 hover:text-slate-600 transition p-1 rounded hover:bg-slate-50" title="Sao chép">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="sm:text-right">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Thời gian</span>
                  <span className="text-sm font-medium text-slate-700 mt-0.5 block">{order.date}</span>
                </div>
              </div>

              {/* Chi tiết sản phẩm */}
              <div className="mt-5 space-y-4">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Chi tiết sản phẩm</h3>
                <ul className="divide-y divide-slate-50">
                  {order.items?.map((item) => (
                    <li key={item.id} className="py-3 flex justify-between items-start gap-4 text-sm">
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 line-clamp-2">{item.name}</h4>
                        <p className="text-xs text-slate-400 mt-0.5">Số lượng: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-slate-700 whitespace-nowrap">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Thông tin khách hàng & Thanh toán */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Thông tin nhận hàng</h3>
                <div className="text-sm space-y-1 text-slate-700">
                  <p className="font-semibold text-slate-800">{order.customer?.name}</p>
                  <p>{order.customer?.phone}</p>
                  <p className="text-slate-500 text-xs leading-relaxed mt-1">{order.customer?.address}</p>
                </div>
              </div>
              <div className="sm:border-l sm:border-slate-100 sm:pl-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Phương thức thanh toán</h3>
                <div className="text-sm">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                    {order.paymentMethod}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">
                    Trạng thái:{" "}
                    <span className={order.paymentStatus === 'paid' ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                      {order.paymentStatus === 'paid' ? "Đã thanh toán" : "Chờ thanh toán"}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Tổng kết hóa đơn */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide mb-4">Tổng kết hóa đơn</h3>
              <div className="space-y-3 text-sm border-b border-slate-100 pb-4">
                <div className="flex justify-between text-slate-500">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Phí vận chuyển</span>
                  <span>{order.shippingFee > 0 ? formatCurrency(order.shippingFee) : "Miễn phí"}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Giảm giá</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-base font-bold text-slate-800">Tổng thanh toán</span>
                
              </div>
              <span className="text-xl font-extrabold text-emerald-600 tracking-tight">
                  {formatCurrency(order.total || 0)}
                </span>
            </div>

            {/* Điều hướng UX */}
            <div className="space-y-2">
              <Link
                href="/dashboard/orders"
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-3 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] shadow-sm"
              >
                Theo dõi đơn hàng
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/"
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm py-3 px-4 rounded-xl transition-all border border-slate-200"
              >
                <ShoppingBag className="w-4 h-4" />
                Tiếp tục mua sắm
              </Link>

              <PrintButton />
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-12">
          Gặp khó khăn? Liên hệ với chúng tôi qua <a href="mailto:support@domain.com" className="text-slate-600 underline font-medium hover:text-slate-900">support@domain.com</a> hoặc hotline <span className="text-slate-600 font-medium">1900-XXXX</span>.
        </p>

      </div>
    </div>
  );
}
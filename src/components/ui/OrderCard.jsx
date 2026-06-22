import { StatusBadge } from './StatusBadge';

export default function OrderCard({ order }) {
    // 1. Kiểm tra an toàn: Nếu order không tồn tại, trả về null để tránh crash
    console.log("Dữ liệu order nhận vào OrderCard:", order); // Debug log để kiểm tra dữ liệu đầu vào
  if (!order) return null;

  // 2. Sử dụng Optional Chaining (?.) và cung cấp giá trị mặc định để tránh lỗi slice
  const orderId = order._id?.slice(-6)?.toUpperCase() || "N/A";
  // Format currency helper
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Header: ID & Status */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Mã đơn hàng</p>
          <h3 className="font-extrabold text-slate-800 text-lg">#{orderId}</h3>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Body: Product Info List */}
      <div className="space-y-4 mb-6">
        {order.items?.map((item) => (
          <div key={item._id} className="flex gap-4">
            <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <div className="flex-grow pt-1">
              <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.name}</p>
              <p className="text-xs text-slate-500 mt-1">Số lượng: x{item.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer: Price & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 text-left uppercase font-bold">Thành tiền</p>
          <p className="font-black text-xl text-blue-900">{formatCurrency(order.totalPrice)}</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
            Xem chi tiết
          </button>
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 shadow-lg shadow-blue-200 transition-all">
            Mua lại
          </button>
        </div>
      </div>
    </div>
  );
};
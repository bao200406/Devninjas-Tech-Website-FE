import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function OrderDetailModal({ order, open, onOpenChange }) {
  if (!order) return null;

  // Giả lập dữ liệu bổ sung chuẩn Production
  const mockLogistics = { trackingNumber: "GHN-9988776655", carrier: "Giao Hàng Nhanh" };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-4xl p-0 overflow-hidden bg-white shadow-2xl rounded-2xl border-none flex flex-col gap-0 max-h-[90vh]">
        
        {/* Header */}
        <DialogHeader className="px-8 py-6 border-b border-slate-100 flex-row justify-between items-center bg-slate-50/50 shrink-0">
          <div className="flex flex-col gap-1">
            <DialogTitle className="text-xl font-bold text-slate-900">Chi tiết đơn hàng #{order.orderCode}</DialogTitle>
            <p className="text-sm text-slate-500">Ngày đặt: {new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <Badge variant="outline" className={`px-4 py-1 rounded-full uppercase text-[11px] font-bold tracking-wider ${
            order.status === "delivered" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            {order.status}
          </Badge>
        </DialogHeader>

        {/* Nội dung chính */}
        <div className="px-8 py-6 space-y-8 overflow-y-auto flex-1">
          
          {/* Thông tin khách hàng & Địa chỉ */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Thông tin khách hàng</p>
              <p className="font-semibold text-sm text-slate-900">{order.receiverName}</p>
              <p className="text-sm text-slate-500">{order.receiverPhone}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Địa chỉ giao hàng</p>
              <p className="text-sm text-slate-700">{order.address || "250/8 Phạm Văn Bạch, Tân Bình, TP.HCM"}</p>
            </div>
          </div>

          {/* Bảng sản phẩm */}
          <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-slate-500 text-[10px] uppercase tracking-widest">
                  <th className="px-6 py-4 text-left">Sản phẩm</th>
                  <th className="px-6 py-4 text-center">SKU</th>
                  <th className="px-6 py-4 text-center">Số lượng</th>
                  <th className="px-6 py-4 text-right">Đơn giá</th>
                  <th className="px-6 py-4 text-right">Thành tiền</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 flex items-center gap-4">
                      <img src={item.image} className="w-10 h-10 rounded-lg object-cover border border-slate-100" />
                      <span className="font-medium text-slate-900">{item.name}</span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 font-mono text-xs">{item.sku || "SS25-DEFAULT"}</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-600">{item.quantity}</td>
                    <td className="px-6 py-4 text-right text-slate-600">${item.price.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tài chính & Vận chuyển */}
          <div className="grid grid-cols-2 gap-8 items-start">
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thông tin vận chuyển</h4>
              <p className="text-sm text-slate-600">Đơn vị: {mockLogistics.carrier}</p>
              <p className="text-sm font-bold text-slate-900 font-mono">{mockLogistics.trackingNumber}</p>
            </div>
            
            <div className="w-full space-y-3">
              <div className="flex justify-between text-sm text-slate-500"><span>Tạm tính</span><span>${order.totalPrice.toLocaleString()}</span></div>
              <div className="flex justify-between text-sm text-slate-500"><span>Thuế (VAT 10%)</span><span>${(order.totalPrice * 0.1).toLocaleString()}</span></div>
              <Separator />
              <div className="flex justify-between items-center pt-1">
                <span className="font-bold text-slate-900">Tổng cộng</span>
                <span className="text-2xl font-black text-slate-900">${(order.totalPrice * 1.1).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-100 text-[11px] text-slate-400 flex justify-between shrink-0">
          <span>Thanh toán: <strong className="text-slate-600">{order.paymentMethod || "STRIPE"}</strong></span>
          <span>Cập nhật cuối: {new Date(order.updatedAt || order.createdAt).toLocaleString()}</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
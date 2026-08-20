"use client"
import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { useOrderActions } from '../../hooks/useOrderActions';
import { ActionMenu } from '../../components/ui/ActionMenu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog";
import ReviewModal from "../../components/modals/ReviewModal";

const getPublicUrl = (path) => {
  if (!path) return "/placeholder.png";
  if (path.startsWith("http")) return path;

  const index = path.indexOf('uploads');
  if (index === -1) return path;
  
  const relativePath = path.substring(index).replace(/\\/g, '/');
  return `https://devninjas-tech-website-be-1.onrender.com/${relativePath}`;
};

export default function OrderCard({ order }) {
  // 1. Hook phải gọi ở top-level
  const { actions, handleAction, loading } = useOrderActions(order);

  // 3. State quản lý Modal Hủy đơn
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // State quản lý Modal Đánh giá
  const [showReviewModal, setShowReviewModal] = useState(false);

  // 2. Kiểm tra an toàn
  if (!order) return null;

  // 4. Hàm bọc (Wrapper) để xử lý nút Hủy
  const handleActionClick = (action) => {
    if (action === 'cancel') {
      setShowCancelModal(true);
    } else {
      handleAction(action);
    }
  };

  // 3. Phân loại Action
  const primaryAction = actions.find(a => a.style === 'primary');
  const secondaryActions = actions.filter(a => a.style !== 'primary');

  // 4. Helper functions
  const orderId = order.orderCode || "N/A";
  const formatCurrency = (val) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);

  // Lấy sản phẩm đầu tiên trong đơn hàng để truyền orderDetailId vào ReviewModal
  const firstItem = order.items?.[0];

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300">
      {/* Header: ID & Status */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Mã đơn hàng</p>
          <h3 className="font-extrabold text-slate-800 text-lg">{orderId}</h3>
        </div>
        {/* Dropdown cho các hành động phụ */}
        {secondaryActions.length > 0 && (
          <ActionMenu 
            items={secondaryActions.map(action => ({
              label: action.label,
              onClick: () => handleActionClick(action.action)
            }))} 
          />
        )}
      </div>

      {/* Body: Product Info List */}
      <div className="space-y-4 mb-6 flex justify-between items-center">
        <div className="space-y-3 w-full">
          {order.items?.map((item) => (
            <div key={item._id} className="flex gap-4">
              <div className="w-20 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                <img src={getPublicUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className="flex-grow pt-1">
                <p className="text-sm font-semibold text-slate-900 line-clamp-1">{item.name}</p>
                <p className="text-xs text-slate-500 mt-1">Số lượng: x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Footer: Price & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <div className="text-right">
          <p className="text-[10px] text-slate-400 text-left uppercase font-bold">Thành tiền</p>
          <p className="font-black text-xl text-blue-900">{formatCurrency(order.totalPrice)}</p>
        </div>
        
        <div className="flex gap-2 items-center">
          {/* Nút Xem chi tiết */}
          <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors">
            Xem chi tiết
          </button>

          {/* Nút Viết đánh giá: Nằm ngay cạnh nút Xem chi tiết khi đơn hàng ở trạng thái 'delivered' */}
          {order.status === 'delivered' && (
            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
            >
              Đánh giá
            </button>
          )}

          {/* Nút hành động chính (Primary) - Chỉ hiển thị khi không phải là delivered */}
          {primaryAction && order.status !== 'delivered' && (
            <button
              onClick={() => handleActionClick(primaryAction.action)}
              disabled={loading}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-blue-900 hover:bg-blue-800 shadow-lg shadow-blue-200 transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? "Đang xử lý..." : primaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* 5. Dialog Hủy đơn hàng (Đặt ngay trong card) */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-white border-0 ring-0 shadow-2xl shadow-slate-200 rounded-3xl">
          <DialogHeader className="p-8 pb-2 space-y-3">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <DialogTitle className="text-center text-2xl font-bold text-slate-900">
              Hủy đơn hàng #{order.orderCode || "N/A"}
            </DialogTitle>
            <DialogDescription className="text-center text-slate-500">
              Bạn chắc chắn muốn hủy đơn hàng này? Hãy cho chúng tôi biết lý do nhé.
            </DialogDescription>
          </DialogHeader>

          <div className="px-8 py-4">
            <textarea 
              className="w-full min-h-[120px] p-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-red-100 outline-none transition-all resize-none placeholder:text-slate-400"
              placeholder="Nhập lý do hủy..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
          </div>

          <DialogFooter className="p-8 pt-2 flex flex-row gap-3 bg-white border-0">
            <button 
              onClick={() => setShowCancelModal(false)}
              className="flex-1 py-3.5 rounded-xl font-semibold text-slate-500 hover:bg-slate-50 transition-colors"
            >
              Quay lại
            </button>
            <button 
              disabled={loading}
              onClick={() => {
                handleAction('cancel', { reason: cancelReason });
                setShowCancelModal(false);
              }}
              className="flex-[2] py-3.5 rounded-xl font-bold bg-[#FF4500] text-white shadow-lg hover:bg-[#E63900] transition-all active:scale-[0.98]"
            >
              {loading ? "Đang xử lý..." : "Xác nhận hủy"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal: Truyền chính xác orderDetailId (item._id) */}
      {firstItem && (
        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          orderDetailId={firstItem._id}
          productInfo={firstItem}
          onSuccess={() => {
            alert("Đánh giá thành công!");
          }}
        />
      )}
    </div>
  );
}
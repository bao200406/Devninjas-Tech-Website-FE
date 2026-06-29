// src/hooks/useOrderActions.js
import { useState } from 'react';
import { toast } from 'react-toastify'; // Bổ sung
import { cancelOrder } from '../services/orderService'; // Bổ sung service gọi API

const ORDER_ACTIONS_CONFIG = {
  pending: [
    { label: "Thanh toán", action: "pay", style: "primary" },
    { label: "Hủy đơn", action: "cancel", style: "danger" },
  ],
  paid: [
    { label: "Xem hóa đơn", action: "invoice", style: "secondary" },
    { label: "Hủy đơn", action: "cancel", style: "danger" }, // Khách có thể hủy sau khi đã trả tiền nếu kho chưa xuất
  ],
  processing: [
    { label: "Liên hệ hỗ trợ", action: "support", style: "secondary" },
  ],
  shipping: [
    { label: "Theo dõi vận đơn", action: "track", style: "secondary" },
    { label: "Đã nhận hàng", action: "confirm_received", style: "primary" },
  ],
  delivered: [
    { label: "Đánh giá", action: "review", style: "primary" },
    { label: "Mua lại", action: "buy_again", style: "secondary" },
  ],
  cancelled: [
    { label: "Mua lại", action: "buy_again", style: "primary" },
  ],
};

export const useOrderActions = (order) => {
  const [loading, setLoading] = useState(false);

  const handleAction = async (actionType, payload = {}) => {
    if (!order?._id) return;

    setLoading(true);
    try {
      switch (actionType) {
        case 'pay':
          console.log(`Điều hướng đến cổng thanh toán cho đơn: ${order._id}`);
          break;
        case 'cancel':
          // Thực hiện gọi API hủy đơn với lý do từ payload (được truyền từ Modal)
          await cancelOrder(order._id, { reason: payload.reason || "Người dùng hủy đơn" });
          toast.success("Hủy đơn hàng thành công!");
          break;
        case 'invoice':
          console.log(`Tải hóa đơn cho đơn: ${order._id}`);
          break;
        case 'track':
          console.log(`Mở trang tracking vận chuyển`);
          break;
        case 'confirm_received':
          console.log(`Xác nhận đã nhận hàng cho đơn: ${order._id}`);
          break;
        case 'review':
          console.log(`Mở form đánh giá sản phẩm`);
          break;
        case 'buy_again':
          console.log(`Thêm lại sản phẩm vào giỏ hàng`);
          break;
        case 'support':
          console.log(`Mở live chat hỗ trợ`);
          break;
        default:
          console.warn("Hành động chưa được xử lý:", actionType);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý hành động:", error);
      // Hiển thị lỗi từ backend nếu có, nếu không thì dùng thông báo mặc định
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra khi thực hiện hành động.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const actions = ORDER_ACTIONS_CONFIG[order?.status] || [];

  return { actions, handleAction, loading };
};
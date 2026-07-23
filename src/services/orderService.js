import api from "../axios/api";

export const createOrder = async (data) => {
  const response = await api.post("/orders", data);

  return response.data;
};

export const getOrderByUser = async (params) => {
  // params có thể là { status: 'ĐANG GIAO', page: 1, limit: 10 }
  const res = await api.get('/orders/my-orders', { params });
  return res.data;
};

export const getOrderById = async (orderId, config = {} ) => {
  const response = await api.get(`/orders/${orderId}`, config);
  return response.data;
};

// Thêm hàm cancelOrder vào đây
export const cancelOrder = async (orderId, data) => {
  // data có thể bao gồm { reason: "Lý do hủy..." }
  const response = await api.patch(`/orders/${orderId}/cancel`, data);
  return response.data;
};

export const updateOrder = async (orderId, data) => {
  const response = await api.patch(`/orders/update-info/${orderId}`, data);
  return response.data;
};

/* =======================
   ADMIN SERVICES
======================= */

// Lấy tất cả đơn hàng (Admin)
export const getAllOrdersAdmin = async (params = {}) => {
  // params có thể dùng để lọc theo status, search, hoặc phân trang
  const response = await api.get("/orders/admin/all", { params });
  return response.data;
};

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatusAdmin = async (orderId, statusData) => {
  // statusData ví dụ: { status: "COMPLETED" }
  const response = await api.patch(`/orders/admin/${orderId}/status`, statusData);
  return response.data;
};
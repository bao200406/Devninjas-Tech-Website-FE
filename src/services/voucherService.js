import api from "../axios/api";

/**
 * Tạo voucher mới (Admin)
 * @param {Object} voucherData - Object chứa thông tin voucher
 */
export const createVoucher = async (voucherData) => {
  const response = await api.post("/vouchers", voucherData);
  return response.data;
};

/**
 * Lấy danh sách voucher khả dụng (User)
 * @param {Number} orderValue - Giá trị đơn hàng hiện tại để lọc voucher
 */
export const getAvailableVouchers = async (orderValue = 0) => {
  const response = await api.get("/vouchers/available", { 
    params: { orderValue } 
  });
  return response.data;
};

/**
 * Áp dụng voucher vào đơn hàng (User)
 * @param {String} voucherCode - Mã voucher
 * @param {String} orderId - ID đơn hàng
 */
export const applyVoucher = async (voucherCode, orderId) => {
  const response = await api.post("/vouchers/apply", { 
    voucherCode, 
    orderId 
  });
  return response.data;
};
/**
 * Lấy tất cả voucher (Admin)
 */
export const getAllVouchers = async () => {
  const response = await api.get("/vouchers");
  return response.data;
};

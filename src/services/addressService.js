import api from "../axios/api";

// 1. Lấy danh sách địa chỉ (có hỗ trợ phân trang và tìm kiếm query, ví dụ: ?page=1&limit=10&search=Hà+Nội)
export const getAddresses = async (params = {}) => {
  const response = await api.get("/addresses", { params });
  return response.data;
};

// 2. Thêm địa chỉ mới
export const createAddress = async (addressData) => {
  const response = await api.post("/addresses", addressData);
  return response.data;
};

// 3. Cập nhật địa chỉ theo ID
export const updateAddress = async (addressId, addressData) => {
  const response = await api.put(`/addresses/${addressId}`, addressData);
  return response.data;
};

// 4. Xóa địa chỉ theo ID
export const deleteAddress = async (addressId) => {
  const response = await api.delete(`/addresses/${addressId}`);
  return response.data;
};
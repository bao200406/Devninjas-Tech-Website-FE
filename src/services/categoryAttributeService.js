import api from "../axios/api.js";

// Lấy danh sách bộ lọc (Attributes & Values) theo categoryId
export const getFiltersByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/category-attributes/${categoryId}`);
    return response?.data || { success: false, data: [] };
  } catch (error) {
    console.error("Lỗi khi gọi API getFiltersByCategory:", error);
    return { success: false, data: [] };
  }
};

// Gán thuộc tính vào danh mục (Dùng cho Admin)
export const assignAttributeToCategory = async (categoryId, attributeId) => {
  const response = await api.post(`/category-attributes/assign`, {
    categoryId,
    attributeId,
  });
  return response.data;
};
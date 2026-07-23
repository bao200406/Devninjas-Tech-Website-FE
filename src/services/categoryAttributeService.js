import api from "../axios/api.js";

// Lấy danh sách bộ lọc (Attributes & Values) theo categoryId
export const getFiltersByCategory = async (categoryId) => {
  try {
    const response = await api.get(`/category-attributes/${categoryId}`);
    return response.data; // Trả về { success: true, data: [...] }
  } catch (error) {
    console.error("Lỗi khi gọi API getFiltersByCategory:", error);
    throw error;
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
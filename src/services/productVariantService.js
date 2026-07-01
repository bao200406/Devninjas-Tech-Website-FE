import api from "../axios/api";
export const getVariantsByProduct = async (productId) => {
  try {
    console.log("Đang gọi API cho productId:", productId); // 1. Kiểm tra ID gửi đi có đúng không
    const response = await api.get(`/variants/product/${productId}`);
    return response.data;
  } catch (error) {
    // 2. In lỗi chi tiết ra console để nhìn thấy rõ nguyên nhân
    if (error.response) {
      console.error("Server trả về lỗi:", {
        status: error.response.status,
        data: error.response.data, // Dòng này thường chứa thông báo lỗi cụ thể (ví dụ: "Product not found")
      });
    } else {
      console.error("Lỗi không kết nối được server:", error.message);
    }
    
    // Ném lỗi để UI vẫn biết là đã thất bại
    throw error.response?.data || error;
  }
};

export const getVariantById = async (variantId) => {
  try {
    const response = await api.get(`/variants/${variantId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
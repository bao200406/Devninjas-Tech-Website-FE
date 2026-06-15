import api from "../axios/api";
export const getVariantsByProduct = async (productId) => {
  try {
    const response = await api.get(`/variants/product/${productId}`);
    return response.data; // Trả về object { success: true, data: [...] }
  } catch (error) {
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
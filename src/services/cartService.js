import api from "../axios/api.js"; 

/**
 * Lấy giỏ hàng của user
 */
export const getCart = async () => {
  const response = await api.get("/cart");
  return response.data;
};

/**
 * Thêm sản phẩm vào giỏ hàng
 * @param {string} variantId 
 * @param {number} quantity 
 */
export const addToCart = async (variantId, quantity , productId,) => {
  const response = await api.post("/cart/items", { variantId, quantity , productId, });
  return response.data;
};

/**
 * Cập nhật số lượng sản phẩm
 * @param {string} variantId 
 * @param {number} quantity 
 */
export const updateQuantity = async (variantId, quantity) => {
  const response = await api.put(`/cart/items/${variantId}`, { quantity });
  return response.data;
};

/**
 * Xóa 1 sản phẩm khỏi giỏ hàng
 * @param {string} variantId 
 */
export const deleteItem = async (variantId) => {
  const response = await api.delete(`/cart/items/${variantId}`);
  return response.data;
};

/**
 * Xóa toàn bộ giỏ hàng
 */
export const clearCart = async () => {
  const response = await api.delete("/cart/clear");
  return response.data;
};

export const updateCartVariant = async (oldVariantId, newVariantId) => {
  const response = await api.put("/cart/update-variant", { 
    oldVariantId, 
    newVariantId 
  });
  return response.data;
};
import api from "../axios/api.js";

/**
 * Thông báo cho Header biết giỏ hàng đã thay đổi
 */
const notifyCartUpdated = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartUpdated"));
  }
};

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
 * @param {string} productId
 */
export const addToCart = async (variantId, quantity, productId) => {
  const response = await api.post("/cart/items", {
    variantId,
    quantity,
    productId,
  });

  // Báo cho Header cập nhật lại số lượng
  notifyCartUpdated();

  return response.data;
};

/**
 * Cập nhật số lượng sản phẩm
 * @param {string} variantId
 * @param {number} quantity
 */
export const updateQuantity = async (variantId, quantity) => {
  const response = await api.put(`/cart/items/${variantId}`, {
    quantity,
  });

  // Báo cho Header cập nhật lại số lượng
  notifyCartUpdated();

  return response.data;
};

/**
 * Xóa 1 sản phẩm khỏi giỏ hàng
 * @param {string} variantId
 */
export const deleteItem = async (variantId) => {
  const response = await api.delete(`/cart/items/${variantId}`);

  // Báo cho Header cập nhật lại số lượng
  notifyCartUpdated();

  return response.data;
};

/**
 * Xóa toàn bộ giỏ hàng
 */
export const clearCart = async () => {
  const response = await api.delete("/cart/clear");

  // Báo cho Header cập nhật lại số lượng
  notifyCartUpdated();

  return response.data;
};

/**
 * Đổi variant trong giỏ hàng
 */
export const updateCartVariant = async (oldVariantId, newVariantId) => {
  const response = await api.put("/cart/update-variant", {
    oldVariantId,
    newVariantId,
  });

  // Báo cho Header cập nhật lại số lượng
  notifyCartUpdated();

  return response.data;
};
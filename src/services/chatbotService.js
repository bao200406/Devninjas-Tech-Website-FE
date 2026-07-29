import api from "../axios/api";

/**
 * Gửi tin nhắn tới trợ lý AI tư vấn sản phẩm
 * @param {String} message - Nội dung tin nhắn của khách hàng
 */
export const sendChatMessage = async (message) => {
  const response = await api.post("/chatbot/consultation", { message });
  return response.data;
};
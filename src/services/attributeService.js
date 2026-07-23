import api from "../axios/api.js"; 

export const createAttribute = async (data) => {
  const response = await api.post("/attributes", data);
  return response.data;
};

// Hàm lấy danh sách thuộc tính kèm giá trị (values)
export const getAllAttributes = async () => {
  // Lưu ý: Đảm bảo phía Server/Controller của bạn có xử lý hàm aggregate này
  const response = await api.get("/attributes"); 
  console.log("Giá trị của response.data là:", response.data);
  return response.data;
};